/**
 * 圆形
 * @module ychart/shape/Circle
 */

import ShapeBuilder from "../core/viewBuilder";
/* import {PIx2} from "../tool/math"; */

/**
 * 圆形
 * @class Circle
 * @property {number} x 圆心x坐标
 * @property {number} y 圆心y坐标
 * @property {number} r 半径
 * @constructor Circle
 * */
export default ShapeBuilder.baseContextViewExtend({

    /**
     * 构造函数 。 在构造函数中指定该图像的中心点
     * @param {object} option  绘制形状的配置
     * @private
     */
    // Init: function (config) {
        // this.origin = [config.x,config.y];
    // },

    type: "Circle",

    BuildPath: function (ctx, config) {
        var x = parseFloat(config.x) , y=parseFloat(config.y), radius=parseFloat(config.r);
        // ctx.moveTo(x,y+radius);
        ctx.arc(x,y,radius,0,2*Math.PI,false);
        /* var x = parseFloat(config.x) , y=parseFloat(config.y), r=parseFloat(config.r);
        ctx.moveTo(x,y);
        ctx.arc(0,0,r ,0, Math.PI*2,false);*/
        this.rect = [config.x - config.r,config.y-config.r ,config.x+config.r,config.y+config.r];
    }


});

