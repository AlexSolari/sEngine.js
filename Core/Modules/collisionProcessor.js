function CollisionProcessor(){
    this.pushOutTriesLimit = 15;
}


CollisionProcessor.prototype.IsIntersected = function (entity, another) {
    var dx = entity.x - another.x;
    var dy = entity.y - another.y;
    dx = dx * dx + dy * dy;
    dy = entity.radius + another.radius;

    return dx < dy * dy;
}

CollisionProcessor.prototype.Process = function (entity1, entity2, scene){
    var impulseEntity1 = entity1.speed.Multiply(entity1.mass);
    var impulseEntity2 = entity2.speed.Multiply(entity2.mass);

    var middleVector = impulseEntity1.Add(impulseEntity2);
    
    var entity1result = middleVector.Multiply(0.5/entity1.mass);
    var entity2result = middleVector.Multiply(0.5/entity2.mass);

    entity1.speed = entity1result;
    entity2.speed = entity2result;

    var pushOutTries = this.pushOutTriesLimit;
    do
    {
        var entity1PushOutVector = new Vector(entity1.x, entity1.y, entity2.x, entity2.y, 0.1);
        var entity2PushOutVector = new Vector(entity2.x, entity2.y, entity1.x, entity1.y, 0.1);

        entity1.x -= entity1PushOutVector.dX * (pushOutTries / 10);
        entity1.y -= entity1PushOutVector.dY * (pushOutTries / 10);

        entity2.x -= entity2PushOutVector.dX * (pushOutTries / 10);
        entity2.y -= entity2PushOutVector.dY * (pushOutTries / 10);
    }
    while (this.IsIntersected(entity1, entity2) && pushOutTries > 0)
};
