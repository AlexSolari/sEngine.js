Ball.prototype = new Unit(0,0);

Ball.prototype.constructor = Ball;

function Ball(x, y) {
    this.id = Math.random();
    this.x = x;
    this.y = y;
    this.isAffectedByGravity = true;
    this.mass = 1;  
    this.sprite = "ball" 
    this.radius = 10;
    this.isCollideable = true;
}
