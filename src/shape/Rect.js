/**
 * 不规则多边形
 * @module ychart/shape/Rect
 */

import ShapeBuilder from "../core/viewBuilder"

var minx = 99999, miny = 99999, maxx = -99999, maxy = -99999;

/**
 * @class Rect
 * @classdesc 不规则多边形. 需指定所有的点坐标
 * @property  {Array.number}  allpt [[0,0],[10,10]]这样的点的数组
 * @property  {boolean} notClose 是否是不闭合的多边形.默认闭合
 * @constructor Rect
 */
export default ShapeBuilder.baseContextViewExtend({

    type: "Rect",

    BuildPath: function (ctx, config) {
        ctx.moveTo(config.allpt[0][0], config.allpt[0][1]);
        for (var i = 1; i < config.allpt.length; i++) {
            ctx.lineTo(config.allpt[i][0], config.allpt[i][1]);
        }
        if (!config.notClose) {
            ctx.closePath();
        }
    },

    GetContainRect: function () {
        var i = 0, tmp;
        for (i = 0; i < this.config.allpt.length; i++) {
            tmp = this.config.allpt[i];
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
        return [minx ,miny ,maxx ,maxy];
    }

});


