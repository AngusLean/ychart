/**
 * 图片
 * @module ychart/shape/Image
 */
import ShapeBuilder from "../core/viewBuilder"

/**
 * 图形形状类
 * @class Image
 * @property {HTMLImage} image 开始点
 * @property {number} x 绘制该图形在画布上的起点X
 * @property {number} y 绘制该图形在画布上的起点Y
 * @constructor
 */
export default
ShapeBuilder.baseContextViewExtend({

        type: "Image",

        BuildPath: function (ctx, config) {
            ctx.drawImage(config.image,config.x || 0 ,config.y || 0);
        }
})


