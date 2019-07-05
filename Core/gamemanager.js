function GameManager() {
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

    this.CleanUpCallback = function(){};
    this.ImageCache = null;
    this.Screen = null;
    this.Cursor = {};
    this.Modules = {
        Collisions: new CollisionProcessor(),
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

    self.ImageCache = new ImageCache();
    self.Screen = new GameScreen(this.ScreenWidth, this.ScreenHeight);

    sEngineHelper("body").on("mousemove", function SaveMousePosition(e) {
        self.Cursor.x = e.clientX;
        self.Cursor.y = e.clientY;
    });
}

GameManager.prototype.Start = function Start(targetFPS, targetTickrate, initializerCallback) {
    targetFPS = targetFPS || 100;
    targetTickrate = targetTickrate || 25;

    var self = this;

    this.Scenes = [];
    this.Scenes.push(new GameScene(self.Screen));

    this.CleanUpCallback = initializerCallback(this, this.GetTopScene());

    clearInterval(this.UpdateIntervalID);
    clearInterval(this.RenderIntervalID);

    this.UpdateIntervalID = setInterval(function GameUpdateLoop() {
        self.CountTPS();
        self.GetTopScene().UpdateScene();
        self.UpdateCallbacks.forEach(function(callback) {
            callback(self, self.GetTopScene());
        });
    }, 1000 / targetTickrate);
    this.RenderIntervalID = setInterval(function GameRenderLoop() {
        self.CountFPS();
        self.Screen.RenderScene(targetFPS, targetTickrate, self.GetTopScene());
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