/**
 * 直线
 * @module ychart/shape/Line
 */
import ShapeBuilder from "../core/viewBuilder";

/**
 * 直线形状类
 * @class Line
 * @property {number} x0 , y0 开始点
 * @property {number} x1 ,y1 结束点
 * @property {number} splitnum  如果是虚线，分成多少段.
 * @constructor Line
 * @extends ContextView
 */
export default ShapeBuilder.baseContextViewExtend({

    type: "Line",

    BuildPath: function(ctx, config) {
        if (config.splitnum) {
            var splitnum = config.splitnum || 1;
            var splitlen_x = (config.x1 - config.x0) / splitnum / 2;
            var splitlen_y = (config.y1 - config.y0) / splitnum / 2;
            for (var i = 0; i < splitnum; i++) {
                ctx.moveTo(config.x0 + i * 2 * splitlen_x, config.y0 + i * 2 * splitlen_y);
                ctx.lineTo(config.x0 + i * 2 * splitlen_x + splitlen_x, config.y0+ i * 2 * splitlen_y + splitlen_y);
            }
        } else {
            ctx.moveTo(config.x0, config.y0);
            ctx.lineTo(config.x1, config.y1);
        }
        this.rect = [config.x0 , config.y0 ,config.x1,config.y1];
    }
});
