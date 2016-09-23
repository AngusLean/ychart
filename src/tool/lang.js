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
}


export var onreadyCallback = function(ctx, element, callback) {
    var timer = setInterval(function() {
        if (element.complete) {
            callback.call(ctx)
            clearInterval(timer)
        }
    }, 50)
}
