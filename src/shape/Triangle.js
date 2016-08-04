define(function(require){
    "use strict";

    /**
     * 三角形
     * @typedef {Object} ICircleStyle
     * @property {number} beginpt 开始座标
     * @property {number} width  三角形的宽
     * @property {number} height 三角形的高
     * @property {number} direction bottom 为向下。 默认向上
     * @constructor
     */
    return require("../core/ShapeBuilder").extend({

        type: "triangle",

        BuildPath: function (ctx, config) {
            ctx.beginPath();
            ctx.moveTo(config.beginpt[0],config.beginpt[1]);
            ctx.lineTo(config.beginpt[0]+config.width,config.beginpt[1]);
            var pt = [config.beginpt[0]+config.width/2 , config.beginpt[1]+config.height];
            //向下的三角形
            if(config.direction == "bottom"){
                pt[1] = config.beginpt[1] - config.height;
            }
            ctx.lineTo(pt[0],pt[1]);
            ctx.lineTo(config.beginpt[0],config.beginpt[1]);
            config.style.brushType = config.style.brushType || "stroke";
        }
    })


});