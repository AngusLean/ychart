export var callOrApply = function(func, ctx, args) {

};

export var throwFunc = function(str) {
    throw str
};

export var noOp = function() {};

export var bind1Arg = function(handler, context) {
    return function(arg1) {
        return handler.call(context, arg1);
    };
};

var runAfterTimes = function(times,callback){
    setTimeout(callback , times);
}

export var onreadyCallback = function(ctx, element, callback) {
    if (element.complete) {
        callback.call(ctx);
        return;
    }
    var timer = setInterval(function() {
        if (element.complete) {
            callback.call(ctx)
            clearInterval(timer)
        }else{
            console.log("enter time out")
            runAfterTimes(5000, function(){
                console.log("clean intervel")
                clearInterval(timer)
            })
        }
    }, 50)
};
