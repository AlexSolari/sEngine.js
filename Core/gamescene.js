function GameScene(screen)
{
    this.Screen = screen;
    this.Entities = [];
    this.Enviroment = {
        GravityForce: new Vector(0, 0, 0, 0.01),
        Viscosity: 0.99,
    };
}

GameScene.prototype.Add = function Add(entity) {
    this.Entities.push(entity);
}

GameScene.prototype.Clear = function Clear() {
    this.Entities = [];
    this.Screen.clearRect(0, 0, this.Screen.Width, this.Screen.Height);
}

GameScene.prototype.UpdateScene = function UpdateScene() {
    var self = this;

    this.Entities.forEach(function EntityUpdate(entity) {
	    entity.Move(self.Enviroment);

        if (entity.x < 0 || entity.x > self.Screen.Width)
        {
            entity.speed.dX *= -1;
            entity.acceleration.dX *= -1;
        }
        if (entity.y < 0 || entity.y > self.Screen.Height)
        {
            entity.speed.dY *= -1;
            entity.acceleration.dY *= -1;
        }

        entity.speed.RecalculateLength();
        entity.acceleration.RecalculateLength();

        entity.Update(self.Enviroment);
    });
}
