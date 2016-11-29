/**
 * 不规则多边形
 * @module ychart/shape/Rect
 */

import ShapeBuilder from "../core/viewBuilder";

var minx = 99999,
    miny = 99999,
    maxx = -99999,
    maxy = -99999;

/**
 * @class Rect
 * @classdesc 不规则多边形. 需指定所有的点坐标
 * @property  {Array.number}  allpt [[0,0],[10,10]]这样的点的数组
 * @property  {boolean} notClose 是否是不闭合的多边形.默认闭合
 * @constructor Rect
 */
export default ShapeBuilder.baseContextViewExtend({

    type: "Rect",

    BuildPath: function(ctx, config) {
        ctx.moveTo(config.pts[0][0], config.pts[0][1]);
        for (var i = 1; i < config.pts.length; i++) {
            ctx.lineTo(config.pts[i][0], config.pts[i][1]);
        }
        if (!config.notClose) {
            ctx.closePath();
        }
    },

    GetContainRect: function() {
        if (!this.rect) {

            var i = 0,
                tmp;
            for (i = 0; i < this.config.pts.length; i++) {
                tmp = this.config.pts[i];
                if (tmp[0] < minx) {
                    minx = tmp[0];
                }
                if (tmp[1] < miny) {
                    miny = tmp[1];
                }
                if (tmp[0] > maxx) {
                    maxx = tmp[0];
                }
                if (tmp[1] > maxy) {
                    maxy = tmp[1];
                }
            }
            this.rect = [minx , miny ,maxx ,maxy];
        }
        return this.rect;
    }

});
