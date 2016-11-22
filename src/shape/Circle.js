/**
 * 圆形
 * @module ychart/shape/Circle
 */

import ShapeBuilder from "../core/viewBuilder";

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
    Init: function (config) {
        this.origin = [config.x,config.y];
    },

    type: "circle",

    BuildPath: function (ctx, config) {
        ctx.arc(config.x, config.y, config.r, Math.PI * 2,
            config.startangel || 0, config.endangel || Math.PI * 2);
    }

});

