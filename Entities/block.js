Block.prototype = new Unit(0,0);

Block.prototype.constructor = Block;

function Block(x, y) {
    this.id = Math.random();
    this.x = x;
    this.y = y;
    this.isAffectedByGravity = false;
    this.mass = 10000;  
    this.sprite = "block" 
    this.radius = 10;
    this.isCollideable = true;
}

Block.prototype.OnCollision = function OnCollision() {
    this.RemoveSelf();
}

Block.prototype.Update = function Update() {
    this.visualX = this.x;
    this.visualY = this.y;
}
