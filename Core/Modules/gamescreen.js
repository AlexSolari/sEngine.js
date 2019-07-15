function GameScreen(width, height) {
    var canvas = sEngineHelper("#canvas");
    canvas[0].width = width;
    canvas[0].height = height;
    this.Canvas = canvas[0].getContext("2d");
    this.Canvas.width = width;
    this.Canvas.height = height;
    this.Width = width;
    this.Height = height;
}

GameScreen.prototype.RenderScene = function RenderScene(fps, tickrate, scene) {
    var self = this;

    self.Canvas.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
    scene.Entities.forEach(function EntityRender(entity) {
        entity.visualX += entity.speed.dX * (tickrate/fps);
        entity.visualY += entity.speed.dY * (tickrate/fps);
        
        self.Draw(entity.sprite, entity.angle, entity.x, entity.y, entity);

        if (Game.Debug)
        {
            self.Canvas.strokeStyle = '#ff0000';
            self.Canvas.beginPath();
            self.Canvas.moveTo(entity.x,entity.y);
            self.Canvas.lineTo(entity.x + entity.speed.dX * 10,entity.y + entity.speed.dY * 10);
            self.Canvas.stroke();
            
            self.Canvas.strokeStyle = '#00ff00';
            self.Canvas.beginPath();
            self.Canvas.moveTo(entity.x,entity.y);
            self.Canvas.lineTo(entity.x + entity.acceleration.dX * 100,entity.y + entity.acceleration.dY * 100);
            self.Canvas.stroke();
        }
    });
}

GameScreen.prototype.Draw = function Draw(sprite, angle, x, y, entity) {
    var self = this; 

    if (sprite)
    {
        Game.ImageCache.Get("Files/Sprites/"+sprite+".png", function GetImageCallback(image) {
            self.Canvas.save(); 
            self.Canvas.translate(x, y);
            self.Canvas.rotate(angle * Math.PI/180);
            self.Canvas.drawImage(image, -(image.width/2), -(image.height/2));
            self.Canvas.restore(); 
        });
    }
    else {
        var rgbToHex = function (rgb) { 
            rgb = Math.round(rgb);

            var hex = Number(rgb).toString(16);
            if (hex.length < 2) {
                 hex = "0" + hex;
            }
            return hex;
          };

        var fullColorHex = function(r,g,b) {   
            var red = rgbToHex(r);
            var green = rgbToHex(g);
            var blue = rgbToHex(b);
            return red+green+blue;
          };

        self.Canvas.fillStyle = '#'+fullColorHex(255 * (entity.mass / 3), 255 * (entity.mass / 3), 255 * (entity.mass / 3));
        self.Canvas.beginPath();
        self.Canvas.arc(x, y, entity.collider.radius, 0, 2 * Math.PI);
        self.Canvas.fill();

        if (Game.Debug)
        {
            self.Canvas.strokeStyle = '#f5ec42';
            self.Canvas.beginPath();
            self.Canvas.arc(x, y, entity.collider.radius, 0, 2 * Math.PI);
            self.Canvas.stroke();
        }
    }

}