function Vector(x1, y1, x2, y2, limit) {
    limit = limit || 1;

    this.dX = x2 - x1;
    this.dY = y2 - y1;

    this.LengthSquared = null; //will be assigned after limiting
    this.Length = null; //will be assigned after limiting

    this.Limit(limit);   
}

Vector.prototype.RecalculateLength = function RecalculateLength(){
    this.LengthSquared = this.dX * this.dX + this.dY * this.dY;
    this.Length = Math.sqrt(this.dX * this.dX + this.dY * this.dY);
}

Vector.prototype.Limit = function Limit(limit, resizeWhenSmaller) {
    resizeWhenSmaller = resizeWhenSmaller || false;

    if (this.LengthSquared > limit * limit || resizeWhenSmaller)
    {
        var max = Math.max(Math.abs(this.dX), Math.abs(this.dY));

        this.dX = this.dX * limit / max;
        this.dY = this.dY * limit / max;
    }

    this.RecalculateLength();

    return this;
}

Vector.prototype.Clone = function Clone(limit) {
    return new Vector(0, 0, this.dX, this.dY, limit);
}

Vector.prototype.Add = function Add(vector) {
    var result = this.Clone();

    result.dX += vector.dX;
    result.dY += vector.dY;

    this.RecalculateLength();

    return result;
}

Vector.prototype.Multiply = function Multiply(coeff) {
    var result = this.Clone();

    result.dX *= coeff;
    result.dY *= coeff;

    this.RecalculateLength();
    
    return result;
}