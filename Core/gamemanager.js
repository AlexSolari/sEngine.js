function GameManager() {
    this.UpdateIntervalID = 0;
    this.RenderIntervalID = 0;

    this.ScreenWidth = window.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth;

    this.ScreenHeight = window.innerHeight
                || document.documentElement.clientHeight
                || document.body.clientHeight;

    this.Scene = new GameScene(this.ScreenWidth, this.ScreenHeight);

    this.CurrentSecondNumber = 0;
    this.CurrentFrameNumber = 0;
    this.LastSecondFrameNumber = 0;
    this.ImageCache = new ImageCache();

    this.Points = {};
    this.Cursor = {};
}

GameManager.prototype.Restart = function Restart(size, targetFPS) {
    this.Start(size, targetFPS);
}

GameManager.prototype.Initialize = function Initialize() {
    var self = this;

    $("body").on("mousemove", function SaveMousePosition(e) {
        self.Cursor.x = e.clientX;
        self.Cursor.y = e.clientY;
    });
}

GameManager.prototype.Start = function Start(targetFPS, targetTickrate) {
    targetFPS = targetFPS || 100;
    targetTickrate = targetTickrate || 25;

    var self = this;

    this.Scene.Clear();

    for (var y = 50; y < this.ScreenHeight - 440; y+=25) {
        var x = this.ScreenWidth/2 - y;
        x/=1.3;
        var end = this.ScreenWidth - x;
        for (; x < end; x+=25) {
            var unit = new Block(x,y);
            this.Scene.Add(unit);
        }
    }
    

    var platform = new Platform(this.ScreenWidth / 2, this.ScreenHeight - 20);
    this.Scene.Add(platform);

    var ball = new Ball(this.ScreenWidth / 2, this.ScreenHeight - 50, platform);
    this.Scene.Add(ball);
    ball.speed = new Vector(0, 0, -10, -10);

    clearInterval(this.UpdateIntervalID);
    clearInterval(this.RenderIntervalID);

    this.UpdateIntervalID = setInterval(function GameLoop() {
        self.Scene.Update();
    }, 1000 / targetTickrate);
    this.RenderIntervalID = setInterval(function GameLoop() {
        self.CountFPS();
        self.Scene.Render(targetFPS, targetTickrate);

        if (platform.x > self.Cursor.x)
            platform.x -= 10;
        
        if (platform.x < self.Cursor.x)
            platform.x += 10;
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