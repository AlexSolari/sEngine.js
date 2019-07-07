function BallCollider(radius){
    BaseCollider.call(this, "ball");

    this.x = 0;
    this.y = 0;
    this.radius = radius;
}

BallCollider.prototype = Object.create(BaseCollider.prototype);