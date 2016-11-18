export var throwFunc = function(str) {
    throw str;
};

export var noOp = function() {};

export var bind1Arg = function(handler, context) {
    return function(arg1) {
        return handler.call(context, arg1);
    };
};

import {isArr} from "./util";

export var onreadyCallback = function(ctx, element, callback) {
    var notCompleteCb = isArr(callback) ? callback[1] : noOp;
    var completeCb = isArr(callback) ? callback[0] : noOp;
    if (element.complete) {
        completeCb.call(ctx);
        return;
    }
    let timer = setInterval(function() {
        if (element.complete) {
            completeCb.call(ctx);

            notCompleteCb.call(ctx);
            clearInterval(timer);
            return;
        } else {
            // notCompleteCb.call(ctx);
        }
    }, 150);
};
