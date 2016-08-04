function ImageCache()
{
    this.data = {};    
    this.Initialize();
}

ImageCache.prototype.Get = function (url, callback) {
    var result = this.data[url];
    
    if (!result)
    {
        var self = this;
        result = new Image();
        
        result.onload = function () {
            self.data[url] = result;
            
            if (callback)
                callback(result);
        };
        
        result.onerror = function () {
            self.data[url] = self.data["sprites/missingTexture.png"];
            console.log("Error while loading sprite " + url);
            
            if (callback)
                callback(self.data["sprites/missingTexture.png"]);
        };
        
        result.src = url;
        
        return;
    }
    
    if (callback)
        callback(result);
};

ImageCache.prototype.Assets = [
                                "Files/Sprites/missingTexture.png"
                              ];
                                
ImageCache.prototype.Initialize = function () {
    console.log("Loading assets @ " + new Date().getTime());
    for (var i = this.Assets.length - 1; i >= 0; i--) {
        this.Get(this.Assets[i]);
    }
    console.log("Assets loaded @ " + new Date().getTime());        
};