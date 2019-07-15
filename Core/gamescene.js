function GameScene()
{
    this.Entities = [];
    this.Enviroment = {
        GravityForce: new Vector(0, 0, 0, 0.1),
        Viscosity: 0.99,
    };
}

GameScene.prototype.Add = function Add(entity) {
    this.Entities.push(entity);
}

GameScene.prototype.Clear = function Clear() {
    this.Entities = [];
    Game.Modules.Renderer.clearRect(0, 0, Game.Modules.Renderer.Width, Game.Modules.Renderer.Height);
}

GameScene.prototype.UpdateScene = function UpdateScene() {
    var self = this;

    Game.Modules.Collisions.DetectCollisions(this);

    this.Entities.forEach(function EntityUpdate(entity) {
	    entity.Move(self.Enviroment);

        if (entity.x < 0 || entity.x > Game.Modules.Renderer.Width)
        {
            if (entity.x < 0)
                entity.x = Game.Modules.Renderer.Width;
            if (entity.x > Game.Modules.Renderer.Width)
                entity.x = 0
        }
        if (entity.y < 0 || entity.y > Game.Modules.Renderer.Height)
        {
            if (entity.y < 0)
                entity.y = Game.Modules.Renderer.Height;
            if (entity.y > Game.Modules.Renderer.Height)
                entity.y = 0
        }

        entity.speed.RecalculateLength();
        entity.acceleration.RecalculateLength();

        entity.Update(self.Enviroment);
    });
}
