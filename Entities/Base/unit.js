function Unit(x, y) {
    this.id = Math.random();
    this.x = x;
    this.y = y;
    this.visualX = x;
    this.visualY = y;
    this.speed = new Vector(0, 0, 0, 0);
    this.maxSpeed = 15;
    this.acceleration = new Vector(0, 0, 0, 0);
    this.isAffectedByGravity = false;
    this.mass = 0;  
    this.sprite = null;//"missingTexture"; 
    this.angle = 0;
    this.isCollideable = false;
    this.isFrictionable = false;
    this.collider = null;
    this.actionQueue = [];
}

Unit.prototype.AttachCollider = function(collider){
    this.collider = collider;
    
    this.collider.x = this.x;
    this.collider.y = this.y;
}

Unit.prototype.MoveInstantly = function(x, y){
    this.x = x;
    this.y = y;

    this.collider.x = this.x;
    this.collider.y = this.y;
};

Unit.prototype.Move = function Move(enviroment) {
    if (this.isAffectedByGravity) {
        this.acceleration = this.acceleration.Add(enviroment.GravityForce.Multiply(this.mass*this.mass))
    }

    this.speed = this.speed.Add(this.acceleration);

    if (this.isFrictionable) {
        var slowdownFactor = ((1 - enviroment.Viscosity) * this.mass ) / 10;
        this.speed = this.speed.Multiply(1 - slowdownFactor);
    }

    this.x += this.speed.dX;
    this.y += this.speed.dY;
    this.collider.x = this.x;
    this.collider.y = this.y;
}

Unit.prototype.Update = function Update(enviroment) {
    this.collider.x = this.x;
    this.collider.y = this.y;

    this.actionQueue.forEach(function ActionQueueRunner(action) {
        action();
    });
    this.actionQueue = [];

    this.visualX = this.x;
    this.visualY = this.y;
}

Unit.prototype.RemoveSelf = function RemoveSelf() {
    Game.GetTopScene().Entities.splice(Game.GetTopScene().Entities.indexOf(this), 1);
}