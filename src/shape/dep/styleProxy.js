define(function(require) {
    "use strict";

    var util = require("../../tool/util");

    var Style = require("./style");


    /**
     * 在合并样式时会出现覆盖的情况
     */
    var _styleProxy = function(style) {
        style = style || {};
        this.style = new Style(style);
        this.brushType = null;
        this.init(style);
    };

    _styleProxy.prototype.init = function(style){
         this.brushType = style.brushType ? style.brushType :
            style.strokeStyle ?
                (style.fillStyle ? 'both' : 'stroke') :
                (style.fillStyle ? "fill" : "none") ;
    };

    _styleProxy.prototype.bindContext = function(ctx) {
        var style = this.style;
        for (var prop in style) {
            ctx[prop] = style[prop];
        }
        // 渐变效果覆盖其他的fillStyle样式
        if (util.isObj(style.gradient)) {
            var _gradient = ctx.createLinearGradient(style.gradient.beginpt[0], style.gradient.beginpt[1],
                style.gradient.endpt[0], style.gradient.endpt[1]);

            _gradient.addColorStop(0, style.gradient.beginColor);
            _gradient.addColorStop(1, style.gradient.endColor);
            ctx.fillStyle = _gradient;
        }
    };

    _styleProxy.prototype.getBrushType = function(style) {
        return this.brushType;
    };

    _styleProxy.prototype.getStyle = function() {
        return this.style;
    };

    return _styleProxy;
});
