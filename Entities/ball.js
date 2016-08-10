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
    this.radius = 7;
    this.isCollideable = true;
}

Ball.prototype.Update = function Update(){
    this.visualX = this.x;
    this.visualY = this.y;

    if (this.isCollideable)
    {
        this.DefaultCollisionProcessing();
    }

    if (this.y > Game.ScreenHeight - 40)
    {
        if (Math.abs(this.platform.x - this.x) < 80)
        {
            this.speed.dY *= -1; 
            this.speed.dX += this.platform.speed.dX;
            this.speed.Limit(10);
            return;
        }

        alert('You lose!');

        this.RemoveSelf();

        var ball = new Ball(this.platform.x, Game.ScreenHeight - 50, this.platform);
        Game.GetTopScene().Add(ball);
        ball.speed = new Vector(0, 0, -10, -10);
    }
}

Ball.prototype.OnIntersection = function OnIntersection(self, entity) {
    if (self.x > entity.x - entity.radius && self.x < entity.x + entity.radius)
        self.speed.dY *= -1;
    if (self.y > entity.y - entity.radius && self.y < entity.y + entity.radius)
        self.speed.dX *= -1;

    var shiftDirection = new Vector(0, 0, self.x-entity.x, self.y-self.y);
    self.x += shiftDirection.dX;
    self.y += shiftDirection.dY; 

    self.OnCollision();
    entity.OnCollision();
}

Ball.prototype.OnCollision = function OnCollision() {

}