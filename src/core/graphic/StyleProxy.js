


    import {isObj ,merge} from "../../tool/util"
    import Style from "./style"

    var defaultStyle = Style._style;
    var styleMapper = Style._styleMap;
    /**
     * 在合并样式时会出现覆盖的情况
     */
    var styleProxy = function(style) {
        style = style || {};
        this.style = merge(new defaultStyle() ,style ,true ,styleMapper);
        this.brushType = null;
        this.init(style);
    };

    styleProxy.prototype.init = function(style){
         this.brushType = style.brushType ? style.brushType :
            style.strokeStyle ?
                (style.fillStyle ? 'both' : 'stroke') :
                (style.fillStyle ? "fill" : "none") ;
    };

    styleProxy.prototype.bindContext = function(ctx) {
        var style = this.style;
        for (var prop in style) {
            ctx[prop] = style[prop];
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

    styleProxy.prototype.update = function (_style) {
        if(_style){
            merge(this.style ,_style ,true ,styleMapper);
            this.init(_style);
        }
    };
    
    styleProxy.prototype.getBrushType = function(style) {
        return this.brushType;
    };

    styleProxy.prototype.getStyle = function() {
        return this.style;
    };

    export default styleProxy;

