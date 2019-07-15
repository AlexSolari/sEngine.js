function Logger(){

}

Logger.prototype.Log = function(message){
    console.log("sEngine: " + message + " @ " + new Date().getTime());
}