/**
 * 样式代理类。
 *
 */
import {isObj, merge} from "../../tool/util";
import Style from "./style";

var defaultStyle = Style.style;
var styleMapper = Style.styleMap;

/**
 * 样式代理类 ，在合并样式时会出现覆盖的情况
 * @class
 */
var StyleProxy = function (style) {
    style = style || {};
    this.style = merge(new defaultStyle(), style, true, styleMapper);
    this.brushType = null;
    this.init(style);
};

StyleProxy.prototype.init = function (style) {
    this.brushType = style.brushType ? style.brushType :
        (style.strokeStyle ?
            (style.fillStyle ? "both" : "stroke") :
            (style.fillStyle ? "fill" : "none")    );
};

StyleProxy.prototype.bindContext = function (ctx) {
    var style = this.style;
    for (var prop in this.style) {
        ctx[prop] = this.style[prop];
    }
    // 渐变效果覆盖其他的fillStyle样式
    if (isObj(style.gradient)) {
        var _gradient = ctx.createLinearGradient(style.gradient.beginpt[0], style.gradient.beginpt[1],
            style.gradient.endpt[0], style.gradient.endpt[1]);

        _gradient.addColorStop(0, style.gradient.beginColor);
        _gradient.addColorStop(1, style.gradient.endColor);
        ctx.fillStyle = _gradient;
    }
};

StyleProxy.prototype.update = function (_style) {
    if (_style) {
        merge(this.style, _style, true, styleMapper);
        this.init(_style);
    }
};

StyleProxy.prototype.getBrushType = function () {
    return this.brushType;
};

StyleProxy.prototype.getStyle = function () {
    return this.style;
};


export default StyleProxy;

