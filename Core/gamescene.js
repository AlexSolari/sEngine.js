function GameScene()
{
    this.Entities = [];
    this.Enviroment = {
        GravityForce: new Vector(0, 0, 0, 0.01),
        Viscosity: 0.9,
    };
}

GameScene.prototype.Add = function Add(entity) {
    this.Entities.push(entity);
}

GameScene.prototype.Clear = function Clear() {
    this.Entities = [];
    this.Screen.clearRect(0, 0, Game.ScreenWidth, Game.ScreenHeight);
}

GameScene.prototype.UpdateScene = function UpdateScene() {
    var self = this;

    this.Entities.forEach(function EntityUpdate(entity) {
	    entity.Move(self.Enviroment);
        entity.Update(self.Enviroment);
    });
}
