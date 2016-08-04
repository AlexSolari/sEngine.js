function GameScene(width, height)
{
    this.Entities = [];
    this.GravityForce = new Vector(0, 0, 0, 1);
    var canvas = $("#canvas");
    canvas[0].width = width;
    canvas[0].height = height;
    this.Screen = canvas[0].getContext("2d");
    this.Screen.width = width;
    this.Screen.height = height;
}

GameScene.prototype.Add = function Add(entity) {
    this.Entities.push(entity);
}

GameScene.prototype.Clear = function Clear() {
    this.Entities = [];
    this.Screen.clearRect(0, 0, Game.ScreenWidth, Game.ScreenHeight);
}

GameScene.prototype.Update = function Update() {
    var self = this;

    this.Entities.forEach(function EntityUpdate(entity) {

	    entity.Move();

        if (entity.x + entity.radius > self.Screen.width) {
            entity.x = self.Screen.width - entity.radius;
            entity.speed.dX *= -1;
        } 
        if (entity.x - entity.radius < 0){
            entity.x = entity.radius;
            entity.speed.dX *= -1;
        }
        if (entity.y + entity.radius > self.Screen.height){
            entity.y = self.Screen.height - entity.radius;
            entity.speed.dY *= -1;
        }
        if (entity.y - entity.radius < 0){
            entity.y = entity.radius;
            entity.speed.dY *= -1;
	    }

        entity.Update();
    });
}

GameScene.prototype.Render = function Render(fps, tickrate) {
    this.Screen.clearRect(0, 0, this.Screen.width, this.Screen.height);
    this.Entities.forEach(function EntityRender(entity) {
        entity.Render(fps, tickrate);
    });
}

GameScene.prototype.Draw = function Draw(sprite, angle, x, y) {
    var self = this; 

    Game.ImageCache.Get("Files/Sprites/"+sprite+".png", function (image) {
        self.Screen.save(); 
	    self.Screen.translate(x, y);
	    self.Screen.rotate(angle * Math.PI/180);
	    self.Screen.drawImage(image, -(image.width/2), -(image.height/2));
	    self.Screen.restore(); 
    });
}