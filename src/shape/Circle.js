define(function(require){
    "use strict";
    var sputil  = require("./dep/shapeutil");

    /**
     * 圆形
     * @typedef {Object} ICircleStyle
     * @property {number} x 圆心x坐标
     * @property {number} y 圆心y坐标
     * @property {number} r 半径
     * @constructor
     */
    return require("./ShapeBuilder").extend({

        type: "circle",

        BuildPath: function (ctx, config) {
            ctx.beginPath();
            ctx.arc(config.x, config.y, config.r, Math.PI * 2,
                    config.startangel || 0, config.endangel || Math.PI * 2);
            config.style.brushType = config.style.brushType || "stroke";
        }
    })


});
