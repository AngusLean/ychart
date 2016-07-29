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
    
    
    return requestAnimFrame;
});
