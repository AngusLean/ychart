/**
 * 
 * Created by Administrator on 2016/7/28.
 */

define(function (require) {
    var requestAnimFrame = (window !== undefined &&
        (window.requestAnimationFrame 
            || window.webkitRequestAnimationFrame 
            || window.mozRequestAnimationFrame 
            || window.oRequestAnimationFrame 
            || window.msRequestAnimationFrame))
            || function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    var Nop = function () {return true};
    
    var animate = function (option) {
        var onBegin = option.onBegin || Nop,
            onChanging = option.onChanging || Nop,
            onEnd = option.onEnd || Nop,
            beginDelay = option.beginDelay || 0;

        (function frame(beginResult) {
            if(onEnd()){
                return;
            }
            onChanging(beginResult);

            requestAnimFrame(frame);
        })(onBegin())
    };
    
    return {
        requestAnimFrame : requestAnimFrame,
        animate : animate
    };
});
