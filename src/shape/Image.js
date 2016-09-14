/**
 * 图片
 * @module ychart/shape/Image
 */
import ShapeBuilder from "../core/viewBuilder"

/**
 * 图形形状类
 * @class Image
 * @classdesc 该元素可以有三种调用方法:
 *  ctx.drawImage(image, dx, dy);
 *  ctx.drawImage(image, dx, dy, dWidth, dHeight);
 *  ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
 * @property {HTMLImage} image 开始点  必须有
 * @property {number} dx 绘制该图形在画布上的起点X  默认0
 * @property {number} dy 绘制该图形在画布上的起点Y  默认0
 * @property {number} dWidth 绘制该图形在画布上的宽度  默认不指定
 * @property {number} dHeight 绘制该图形在画布上的宽度  默认不指定
 * @property {number} sx 绘制该图形在图像上的起点X  默认不指定
 * @property {number} sy 绘制该图形在图像上的起点Y  默认不指定
 * @property {number} sWidth 绘制该图形在图像上的宽度  默认不指定
 * @property {number} sHeight 绘制该图形在图像上的宽度  默认不指定
 * @constructor
 */
export default
ShapeBuilder.baseContextViewExtend({

        type: "Image",
        BeforeBrush:function (ctx) {
            var x0 = this.parent.transform[0];
            var x1 = this.parent.transform[1];
            var x2 = this.parent.transform[2];
            var x3 = this.parent.transform[3];
            var x4 = this.parent.transform[4];
            var x5 = this.parent.transform[5];
            ctx.transform(x0,x1,x2,x3,x4,x5);
        },

        BuildPath: function (ctx, config) {
            if(config.dWidth && config.dHeight){
                if(config.sx && config.sy){
                    ctx.drawImage(config.image, config.sx || 0, config.sy || 0, config.sWidth,
                        config.sHeight, config.dx, config.dy, config.dWidth, config.dHeight);
                }else{
                    ctx.drawImage(config.image, config.dx || 0, config.dy || 0, config.dWidth, config.dHeight);
                }
            }else{
                ctx.drawImage(config.image,config.sx || 0 ,config.sy || 0);
            }
        },

    }
)


