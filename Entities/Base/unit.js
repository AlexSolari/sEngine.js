function Unit(x, y) {
    this.id = Math.random();
    this.x = x;
    this.y = y;
    this.visualX = x;
    this.visualY = y;
    this.speed = new Vector(0, 0, 0, 0);;
    this.acceleration = new Vector(0, 0, 0, 0);
    this.isAffectedByGravity = false;
    this.mass = 0;  
    this.sprite = "missingTexture" 
    this.angle = 0;
    this.radius = 0;
    this.isCollideable = false;
    this.isFrictionable = false;
}

Unit.prototype.Render = function Render(fps, tickrate) {
    this.visualX += this.speed.dX * (tickrate/fps);
    this.visualY += this.speed.dY * (tickrate/fps);
    Game.Scene.Draw(this.sprite, this.angle, this.visualX, this.visualY);
}

Unit.prototype.Move = function Move() {
    if (this.isAffectedByGravity) {
        this.speed.Add(Game.Scene.GravityForce.Clone().Multiply(this.mass*this.mass))
    }

    if (this.isFrictionable) {
        this.acceleration = this.speed.Clone().Multiply(-0.02);
    }
    this.speed.Add(this.acceleration);

    this.x += this.speed.dX;
    this.y += this.speed.dY;
}

Unit.prototype.Update = function Update() {

    this.visualX = this.x;
    this.visualY = this.y;

    if (this.isCollideable)
    {
        var self = this;

        var Nearest = Game.Scene.Entities.filter(function FindNearest(another) {
            return self.x * 2 > another.x && self.x / 2 < another.x && self.y * 2 > another.y && self.y / 2 < another.y;
        });

        var Intersected = Nearest.filter(function FindIntersected(another) {
            if (!another.isCollideable || another.id == self.id)
                return false;

            var dx = self.x - another.x;
            var dy = self.y - another.y;
            dx = dx * dx + dy * dy;
            dy = self.radius + another.radius;

            return dx < dy * dy;
        });

        Intersected.forEach(function ProceedIntersected(entity) {
            var selfHalfSpeed = self.speed.Clone().Multiply(0.5 * (self.mass/entity.mass));
            var enHalfSpeed = entity.speed.Clone().Multiply(-0.5 * (entity.mass/self.mass));

            if (self.isFrictionable)
                self.speed.Multiply(0.8)
	        if (entity.isFrictionable)
                entity.speed.Multiply(0.8)

            self.speed.Add(enHalfSpeed);
            entity.speed.Add(selfHalfSpeed);

            self.OnCollision();
            entity.OnCollision();
        });
    }
}

Unit.prototype.RemoveSelf = function RemoveSelf() {
    Game.Scene.Entities.splice(Game.Scene.Entities.indexOf(this), 1);
}

Unit.prototype.OnCollision = function OnCollision() {
    
}