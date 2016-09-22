export var callOrApply = function (func, ctx, args) {

};

export var throwFunc = function (str) {
    throw str
};

export var noOp = function (){};

export var bind1Arg = function(handler, context) {
    return function(arg1) {
        return handler.call(context, arg1);
    };
}


