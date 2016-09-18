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

    /**
     * 构造函数 。 在构造函数中指定该图像的中心点
     * @param {object} option  绘制形状的配置
     * @method
     */
    Init: function(config) {
        this.origin = this.origin || [];
        var rect = [];
        if (config.dWidth && config.dHeight) {
            this.origin[0] = config.dx || 0 + config.dWidth / 2;
            this.origin[1] = rect[1] - config.dy || 0 + config.dHeight / 2;
        } else {
            this.origin[0] = config.dx || 0 + config.image.width / 2;
            this.origin[1] = rect[1] - config.dy || 0 + config.image.height / 2;
        }

        if (typeof this.coordinate == "undefined")
            this.coordinate = 1;
    },

    type: "Image",

    /**
     * 绘制图片。 必须注意的图片同其他形状一样默认以左下角为起点。
     * 但是由于这是通过容器canvas大小和目标图像的高度计算得来，在
     * 和其他形状配合使用时遇到变化可能会出现问题。 此时就需要设置
     * coordinate属性为-1，使得绘图片还是以左上角为原点.
     */
    BuildPath: function(ctx, config) {
        if (this.coordinate == 1) {
            let rect = this.getRectByCtx(ctx);
            let imgH = config.image.height;
            if (config.dWidth && config.dHeight) {
                if (config.sx && config.sy) {
                    ctx.drawImage(config.image, config.sx || 0, config.sy || 0, config.sWidth,
                        config.sHeight, config.dx, rect[1] - config.dy - config.dHeight, config.dWidth, config.dHeight);
                } else {
                    let dy = rect[1] - config.dHeight - (config.dy || 0);
                    ctx.drawImage(config.image, config.dx || 0, dy, config.dWidth, config.dHeight);
                }
            } else {
                ctx.drawImage(config.image, config.sx || 0, rect[1] - imgH - (config.sy || 0));
            }
        } else {
            if (config.dWidth && config.dHeight) {
                if (config.sx && config.sy) {
                    ctx.drawImage(config.image, config.sx || 0, config.sy || 0, config.sWidth,
                        config.sHeight, config.dx, config.dy, config.dWidth, config.dHeight);
                } else {
                    ctx.drawImage(config.image, config.dx || 0, config.dy || 0, config.dWidth, config.dHeight);
                }
            } else {
                ctx.drawImage(config.image, config.sx || 0, config.sy || 0);
            }
        }
    },

    GetContainRect: function() {
        var config = this.config;
        if (!this.rect) {
            this.rect = [];
            if (config.dWidth && config.dHeight) {
                this.rect[0] = config.dx || 0;
                this.rect[1] = config.dy || 0;
                this.rect[2] = this.rect[0] + config.dWidth;
                this.rect[3] = this.rect[1] + config.dHeight;
            } else {
                this.rect[0] = config.dx || 0;
                this.rect[1] = config.dy || 0;
                this.rect[2] = this.rect[0] + config.image.width;
                this.rect[3] = this.rect[1] + config.image.height;
            }
        }

        return this.rect;
    }
});
