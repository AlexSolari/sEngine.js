Platform.prototype = new Unit(0,0);

Platform.prototype.constructor = Platform;

function Platform(x, y) {
    this.id = Math.random();
    this.x = x;
    this.y = y;
    this.isAffectedByGravity = false;
    this.mass = 0;  
    this.sprite = "platform" 
    this.radius = 0;
    this.isCollideable = false;
}

Platform.prototype.Update = function Update() {
    this.visualX = this.x;
    this.visualY = this.y;
}
