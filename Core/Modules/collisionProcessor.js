function CollisionProcessor() {
    this.pendingEntityUpdates = [];
}

CollisionProcessor.prototype.DetectCollisions = function (scene) {
    var self = this;

    scene.Entities.forEach(function (entity) {
        var intersected = scene.Entities.filter(function FindIntersected(another) {
            if (another.id == entity.id)
                return false;

            return self.IsIntersected(entity, another);
        });

        intersected.forEach(function IntersectionProcessing(another) {
            if (entity.isCollideable)
                self.Process(entity, another);
        });

    });

    this.pendingEntityUpdates.forEach(function(updator){
        updator();
    });
    this.pendingEntityUpdates = [];
};

CollisionProcessor.prototype.IsIntersected = function (entity, another) {
    var dx = entity.collider.x - another.collider.x;
    var dy = entity.collider.y - another.collider.y;
    dx = dx * dx + dy * dy;
    dy = entity.collider.radius + another.collider.radius;

    return dx < dy * dy;
}

CollisionProcessor.prototype.Process = function (entity1, entity2) {
    var self = this;
    
    var impulseEntity1 = entity1.speed.Multiply(entity1.mass);
    var impulseEntity2 = entity2.speed.Multiply(entity2.mass);

    var middleVector = impulseEntity1.Add(impulseEntity2);

    var entity1impactFactor = Math.min(entity1.mass / entity2.mass, 1);
    var entity2impactFactor = Math.min(entity2.mass / entity1.mass, 1);

    var entity1result = middleVector.Multiply(0.5 / entity1.mass);
    var entity2result = middleVector.Multiply(0.5 / entity2.mass);

    var entityUpdator = function(){
        entity1.speed = entity1result;
        entity2.speed = entity2result;
    
        do {
            var entity1PushOutVector = new Vector(entity1.x, entity1.y, entity2.x, entity2.y, 0.1);
            var entity2PushOutVector = new Vector(entity2.x, entity2.y, entity1.x, entity1.y, 0.1);
            
            entity1.MoveInstantly(entity1.x - entity1PushOutVector.dX, entity1.y - entity1PushOutVector.dY);
            entity2.MoveInstantly(entity2.x - entity2PushOutVector.dX, entity2.y - entity2PushOutVector.dY);
            
        }
        while (self.IsIntersected(entity1, entity2))
    }

    this.pendingEntityUpdates.push(entityUpdator);
};
