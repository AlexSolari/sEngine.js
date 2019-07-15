function ImageCache()
{
    this.data = {};    
    this.Initialize();
}

ImageCache.prototype.Get = function GetImage(url, callback) {
    var result = this.data[url];
    
    if (!result)
    {
        var self = this;
        result = new Image();
        
        result.onload = function GetImageOnLoad() {
            self.data[url] = result;
            
            if (callback)
                callback(result);
        };
        
        result.onerror = function GetImageOnError() {
            self.data[url] = self.data["sprites/missingTexture.png"];
            Game.Modules.Logger.Log("Error while loading sprite " + url);
            
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
                                
ImageCache.prototype.Initialize = function Intialize() {
    Game.Modules.Logger.Log("Loading assets");
    for (var i = this.Assets.length - 1; i >= 0; i--) {
        this.Get(this.Assets[i]);
    }
    Game.Modules.Logger.Log("Assets loaded");        
};