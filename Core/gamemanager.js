function GameManager() {
    this.Debug = false;
    this.UpdateIntervalID = 0;
    this.RenderIntervalID = 0;

    this.ScreenWidth = window.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth;

    this.ScreenHeight = -20 + window.innerHeight
                || document.documentElement.clientHeight
                || document.body.clientHeight;
    
    this.Scenes = [];
    this.UpdateCallbacks = [];

    this.CurrentSecondNumberForFPS = 0;
    this.CurrentSecondNumberForTPS = 0;
    this.CurrentFrameNumber = 0;
    this.LastSecondFrameNumber = 0;
    this.CurrentTickNumber = 0;
    this.LastSecondTickNumber = 0;
    
    this.ExtraOptions = {};

    this.CleanUpCallback = function(){};
    this.ImageCache = null;
    this.Cursor = {};
    this.Modules = {
        Collisions: null,
        Renderer: null,
        Logger: null
    };

    this.DefaultExtraOptions = {
        useSimplifiedPhisics: false,
        phisicsPrecision: 5
    };
}

GameManager.prototype.GetTopScene = function GetTopScene() {
    return this.Scenes[0];
}

GameManager.prototype.Restart = function Restart(size, targetFPS) {
    this.Stop();
    this.Start(size, targetFPS);
}

GameManager.prototype.Initialize = function Initialize() {
    var self = this;

    self.Modules.Collisions = new CollisionProcessor();
    self.Modules.Renderer = new GameScreen(this.ScreenWidth, this.ScreenHeight);
    self.Modules.Logger = new Logger();
    self.ImageCache = new ImageCache();

    sEngineHelper("body").on("mousemove", function SaveMousePosition(e) {
        self.Cursor.x = e.clientX;
        self.Cursor.y = e.clientY;
    });
}

GameManager.prototype.Start = function Start(targetFPS, targetTickrate, initializerCallback, extraOptions) {
    Game.Modules.Logger.Log("Starting engine at " + targetTickrate + "ticks per second and target FPS at " + targetFPS);
    
    targetFPS = targetFPS || 100;
    targetTickrate = targetTickrate || 25;

    var self = this;

    this.ExtraOptions = extraOptions || this.DefaultExtraOptions;
    this.Scenes = [];
    this.Scenes.push(new GameScene());

    this.CleanUpCallback = initializerCallback(this, this.GetTopScene());

    clearInterval(this.UpdateIntervalID);
    clearInterval(this.RenderIntervalID);

    this.UpdateIntervalID = setInterval(function GameUpdateLoop() {
        if (!self.ExtraOptions.useSimplifiedPhisics)
        {
            for (var precisionStep = self.ExtraOptions.phisicsPrecision; precisionStep > 0; precisionStep--) {
                Game.Modules.Collisions.DetectCollisions(self.GetTopScene());
            }
        }

        self.CountTPS();
        self.GetTopScene().UpdateScene();
        self.UpdateCallbacks.forEach(function(callback) {
            callback(self, self.GetTopScene());
        });
    }, 1000 / targetTickrate);
    this.RenderIntervalID = setInterval(function GameRenderLoop() {
        self.CountFPS();
        self.Modules.Renderer.RenderScene(targetFPS, targetTickrate, self.GetTopScene());
    }, 1000 / targetFPS);
}

GameManager.prototype.Stop = function(){
    this.Scenes = [];
    this.UpdateCallbacks = [];
    clearInterval(this.UpdateIntervalID);
    clearInterval(this.RenderIntervalID);
    this.CleanUpCallback();
};

GameManager.prototype.CountFPS = function CountFPS() {
    if (this.CurrentSecondNumberForFPS != new Date().getSeconds()) {
        sEngineHelper("#fpsMeter").html(this.CurrentFrameNumber - this.LastSecondFrameNumber + "fps");
        this.LastSecondFrameNumber = this.CurrentFrameNumber;
        this.CurrentSecondNumberForFPS = new Date().getSeconds();
    }
    this.CurrentFrameNumber++;
}

GameManager.prototype.CountTPS = function CountFPS() {
    if (this.CurrentSecondNumberForTPS != new Date().getSeconds()) {
        sEngineHelper("#tpsMeter").html(this.CurrentTickNumber - this.LastSecondTickNumber + " ticks per second");
        this.LastSecondTickNumber = this.CurrentTickNumber;
        this.CurrentSecondNumberForTPS = new Date().getSeconds();
    }
    this.CurrentTickNumber++;
}