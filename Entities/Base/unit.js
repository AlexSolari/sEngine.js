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
    this.sprite = "ball"//"missingTexture"; 
    this.angle = 0;
    this.radius = 0;
    this.isIntersectable = false;
    this.isCollideable = false;
    this.isFrictionable = false;

    this.actionQueue = [];
}

Unit.prototype.Move = function Move(enviroment) {
    if (this.isAffectedByGravity) {
        this.acceleration = this.acceleration.Add(enviroment.GravityForce.Multiply(this.mass*this.mass))
    }

    if (this.isFrictionable) {
        this.speed = this.speed.Multiply(enviroment.Viscosity);
    }

    this.speed = this.speed.Add(this.acceleration);

    this.x += this.speed.dX;
    this.y += this.speed.dY;
}

Unit.prototype.DefaultIntersectionProcessing = function DefaultIntersectionProcessing() {
    var self = this;

    var Intersected = Game.GetTopScene().Entities.filter(function FindIntersected(another) {
        if (!another.isIntersectable || another.id == self.id)
            return false;

        var dx = self.x - another.x;
        var dy = self.y - another.y;
        dx = dx * dx + dy * dy;
        dy = self.radius + another.radius;

        return dx < dy * dy;
    });

    Intersected.forEach(function IntersectionProcessing(entity) {
         self.OnIntersection(entity); 
        } );    
}

Unit.prototype.Update = function Update(enviroment) {
    this.actionQueue.forEach(function ActionQueueRunner(action) {
        action();
    });
    this.actionQueue = [];

    this.visualX = this.x;
    this.visualY = this.y;

    if (this.isIntersectable)
    {
        this.DefaultIntersectionProcessing();
    }
}

Unit.prototype.RemoveSelf = function RemoveSelf() {
    Game.GetTopScene().Entities.splice(Game.GetTopScene().Entities.indexOf(this), 1);
}

Unit.prototype.OnCollision = function OnCollision(entity, forceInvoked) {
    var self = this;

    function IsIntersected(another) {
        var dx = self.x - another.x;
        var dy = self.y - another.y;
        dx = dx * dx + dy * dy;
        dy = self.radius + another.radius;

        return dx < dy * dy;
    }

    forceInvoked = forceInvoked || false;

    var speedX = (this.mass * this.speed.dX + entity.mass * entity.speed.dX) / (this.mass + entity.mass);
    var speedY = (this.mass * this.speed.dY + entity.mass * entity.speed.dY) / (this.mass + entity.mass);
    this.speed = new Vector(0, 0, -speedX, -speedY);

    do
    {
        this.x += this.speed.dX * 0.5;
        this.y += this.speed.dY * 0.5;
    }
    while (IsIntersected(entity))

    if(!forceInvoked)
        entity.OnCollision(this, true);
}

Unit.prototype.OnIntersection = function OnIntersection(entity) {
    if (this.isCollideable)
        this.OnCollision(entity);
}