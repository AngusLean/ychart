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

var runAfterTimes = function(times, callback) {
    setTimeout(callback, times);
}

export var onreadyCallback = function(ctx, element, callback, blocked) {
    if (element.complete) {
        callback.call(ctx);
        return;
    }
    if (blocked) {
        /*let start = new Date();
        let limit = isNaN(blocked) ? 2000 : blocked;
        while(!element.complete && (new Date() - start < limit)){
        }
        callback.call(ctx);*/
    } else {
        let timer = setInterval(function() {
            if (element.complete) {
                callback.call(ctx)
                clearInterval(timer)
            } else {
                runAfterTimes(5000, function() {
                    clearInterval(timer)
                })
            }
        }, 50)
    }
};
