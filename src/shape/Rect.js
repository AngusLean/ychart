import ShapeBuilder from "../core/ShapeBuilder"


var minx = 99999, miny = 99999, maxx = -99999, maxy = -99999;

/**
 * 不规则多边形. 需指定所有的点坐标
 * @typedef {Object} ICircleStyle
 * @param allpt {Array} {x:10,y:10} 点的数组
 * @param notClose {boolean} 是否是不闭合的多边形.默认闭合
 * @constructor
 */
export default ShapeBuilder.extend({

    type: "Rect",

    BuildPath: function (ctx, config) {
        ctx.beginPath();
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
        return [[minx, miny], [minx, maxy], [maxx, maxy], [maxx, miny]];
    }

});


