function GameScreen(width, height) {
    var canvas = $("#canvas");
    canvas[0].width = width;
    canvas[0].height = height;
    this.Canvas = canvas[0].getContext("2d");
    this.Canvas.width = width;
    this.Canvas.height = height;
}

GameScreen.prototype.RenderScene = function RenderScene(fps, tickrate, scene) {
    var self = this;

    self.Canvas.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
    scene.Entities.forEach(function EntityRender(entity) {
        entity.visualX += entity.speed.dX * (tickrate/fps);
        entity.visualY += entity.speed.dY * (tickrate/fps);
        
        self.Draw(entity.sprite, entity.angle, entity.x, entity.y)

        self.Canvas.strokeStyle = '#ff0000';
        self.Canvas.beginPath();
        self.Canvas.moveTo(entity.x,entity.y);
        self.Canvas.lineTo(entity.x + entity.speed.dX * 10,entity.y + entity.speed.dY * 10);
        self.Canvas.stroke();

        self.Canvas.strokeStyle = '#00ff00';
        self.Canvas.beginPath();
        self.Canvas.moveTo(entity.x,entity.y);
        self.Canvas.lineTo(entity.x + entity.acceleration.dX * 50,entity.y + entity.acceleration.dY * 50);
        self.Canvas.stroke();
    });
}

GameScreen.prototype.Draw = function Draw(sprite, angle, x, y) {
    var self = this; 

    Game.ImageCache.Get("Files/Sprites/"+sprite+".png", function GetImageCallback(image) {
        self.Canvas.save(); 
	    self.Canvas.translate(x, y);
	    self.Canvas.rotate(angle * Math.PI/180);
	    self.Canvas.drawImage(image, -(image.width/2), -(image.height/2));
	    self.Canvas.restore(); 
    });
}