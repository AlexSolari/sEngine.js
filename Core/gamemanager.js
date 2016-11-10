function GameManager() {
    this.UpdateIntervalID = 0;
    this.RenderIntervalID = 0;

    this.ScreenWidth = window.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth;

    this.ScreenHeight = window.innerHeight
                || document.documentElement.clientHeight
                || document.body.clientHeight;
    
    this.Scenes = [];

    this.CurrentSecondNumber = 0;
    this.CurrentFrameNumber = 0;
    this.LastSecondFrameNumber = 0;
    this.ImageCache = null;
    this.Screen = null;
    this.Cursor = {};
}

GameManager.prototype.GetTopScene = function GetTopScene() {
    return this.Scenes[0];
}

GameManager.prototype.Restart = function Restart(size, targetFPS) {
    this.Start(size, targetFPS);
}

GameManager.prototype.Initialize = function Initialize() {
    var self = this;

    self.ImageCache = new ImageCache();
    self.Screen = new GameScreen(this.ScreenWidth, this.ScreenHeight);

    $("body").on("mousemove", function SaveMousePosition(e) {
        self.Cursor.x = e.clientX;
        self.Cursor.y = e.clientY;
    });
}

GameManager.prototype.Start = function Start(targetFPS, targetTickrate, initializerCallback) {
    targetFPS = targetFPS || 100;
    targetTickrate = targetTickrate || 25;

    var self = this;

    this.Scenes = [];
    this.Scenes.push(new GameScene());

    initializerCallback(this, this.GetTopScene());

    clearInterval(this.UpdateIntervalID);
    clearInterval(this.RenderIntervalID);

    this.UpdateIntervalID = setInterval(function GameUpdateLoop() {
        self.GetTopScene().UpdateScene();
    }, 1000 / targetTickrate);
    this.RenderIntervalID = setInterval(function GameRenderLoop() {
        self.CountFPS();
        self.Screen.RenderScene(targetFPS, targetTickrate, self.GetTopScene());
    }, 1000 / targetFPS);
}

GameManager.prototype.CountFPS = function CountFPS() {
    if (this.CurrentSecondNumber != new Date().getSeconds()) {
        $("#fpsMeter").html(this.CurrentFrameNumber - this.LastSecondFrameNumber + "fps");
        this.LastSecondFrameNumber = this.CurrentFrameNumber;
        this.CurrentSecondNumber = new Date().getSeconds();
    }
    this.CurrentFrameNumber++;
}