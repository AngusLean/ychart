/**
 *动画效果模块
 * @module ychart/animation
 */

var requestAnimFrame = (window !== undefined &&
    (window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.oRequestAnimationFrame
    || window.msRequestAnimationFrame))
    || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
var Nop = function () {
    return true
};

/**
 * @function
 * @description 动画控制函数
 * @param option
 */
var animate = function (option) {
    var onBegin = option.onBegin || Nop,
        onChanging = option.onChanging || Nop,
        onEnd = option.onEnd || Nop,
        beginDelay = option.beginDelay || 0;

    (function frame(beginResult) {
        if (onEnd()) {
            return;
        }
        onChanging(beginResult);

        requestAnimFrame(frame);
    })(onBegin())
};

export default {
    requestAnimFrame: requestAnimFrame,
    animate: animate
};
