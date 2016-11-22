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

/**
 * 判断某个元素是否加载完成
 * @param {} ctx 回调函数的上下文
 * @param {HTMLElement} 待加载的元素
 * @param {Function | Array.{Function}} 成功的回调函数或者 [调用当前函数时已经加载的回调,稍后的回调]的回调函数数组
 * @param {Function} 判断这个元素是否加载的函数
 */
var onreadyCallback = function(ctx, element, callback ,loadMethod) {
    var notCompleteCb = isArr(callback) ? callback[1] : noOp;
    var completeCb = isArr(callback) ? callback[0] : noOp;
    if (loadMethod(element)) {
        completeCb.call(ctx);
        return;
    }
    let timer = setInterval(function() {
        if (loadMethod(element)) {
            notCompleteCb.call(ctx);
            clearInterval(timer);
            return;
        }}, 150);
};

export var onImgReady = function(ctx , element , callback){
    var isImageLoaded = function(imgElement){
        return imgElement.complete && imgElement.naturalHeight !== 0;
    };
    onreadyCallback(ctx,element,callback,isImageLoaded);
};
