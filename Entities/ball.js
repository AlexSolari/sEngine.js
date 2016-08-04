Ball.prototype = new Unit(0,0);

Ball.prototype.constructor = Ball;

function Ball(x, y, platform) {
    this.platform = platform;

    this.id = Math.random();
    this.x = x;
    this.y = y;
    this.isAffectedByGravity = false;
    this.mass = 1;  
    this.sprite = "ball" 
    this.radius = 10;
    this.isCollideable = true;
}

Ball.prototype.Update = function Update(){
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
            if (self.x > entity.x - entity.radius && self.x < entity.x + entity.radius)
                self.speed.dY *= -1;
            if (self.y > entity.y - entity.radius && self.y < entity.y + entity.radius)
                self.speed.dX *= -1;
            

            self.OnCollision();
            entity.OnCollision();
        });
    }

    if (this.y > Game.ScreenHeight - 40)
    {
        if (Math.abs(this.platform.x - this.x) < 80)
        {
            self.speed.dY *= -1; 
            return;
        }

        alert('You lose!');

        this.RemoveSelf();

        var ball = new Ball(this.platform.x, Game.ScreenHeight - 50, this.platform);
        Game.Scene.Add(ball);
        ball.speed = new Vector(0, 0, -10, -10);
    }
}