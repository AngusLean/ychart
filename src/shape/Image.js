/**
 * 图片
 * @module ychart/shape/Image
 */
import ShapeBuilder from "../core/viewBuilder";
import {
    isArr,
    checkNull
} from "../tool/util";

import {
    onImgReady
} from "../tool/lang";

/**
 * 图形形状类
 * @class Image
 * 该元素可以如下三种构造方法:
 *  <br>(image, dx, dy);
 *  <br>(image, dx, dy, dWidth, dHeight);
 *  <br>(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
 *  分别对应着按照图片的默认尺寸绘制\ 指定目标位置和尺寸\ 指定截取图片上的某一块绘制到目标对象上的某个位置
 * @property {HTMLImage} image 图形的HTMLImage对象， 注意不能是通过DOM获取的对象。 可以通过新建一个Image对象
 * @property {String} imagesrc 图形的src属性， 注意必须和Ychart同源,否则会由于浏览器的安全限制而报错. 与image属性同时存在时Image属性有效
 * @property {number} dx 绘制该图形在画布上的起点X  默认0
 * @property {number} dy 绘制该图形在画布上的起点Y  默认0
 * @property {number} dWidth 绘制该图形在画布上的宽度  默认不指定
 * @property {number} dHeight 绘制该图形在画布上的宽度  默认不指定
 * @property {number} sx 绘制该图形在图像上的起点X  默认不指定
 * @property {number} sy 绘制该图形在图像上的起点Y  默认不指定
 * @property {number} sWidth 绘制该图形在图像上的宽度  默认不指定
 * @property {number} sHeight 绘制该图形在图像上的宽度  默认不指定
 * @property {Object} style 样式.
 * @constructor Image
 * @extends ContextView
 */
export default ShapeBuilder.baseContextViewExtend({

    /**
     * 构造函数 。 在构造函数中指定该图像的中心点
     * @param {object} option  绘制形状的配置
     * @private
     */
    Init: function(config) {
        //由于引入了异步加载图片的机制，获取图片的大小在图片还没有实际加载的时候也就无法执行
        if (typeof config.image != "string") {
            this.image = config.image;
        } else {
            this.image = new Image();
            this.image.src = config.image;
        }
    },

    /**
     * 设置图片放大缩小的中心座标。 由于依赖于已经加载的图片，所以单独列出来
     * @private
     */
    __setOrigin: function(image) {
        var config = this.config;
        var rect = [];
        if (config.dWidth && config.dHeight) {
            this.origin[0] = config.dx || 0 + config.dWidth / 2;
            this.origin[1] = rect[1] - config.dy || 0 + config.dHeight / 2;
        } else {
            this.origin[0] = config.dx || 0 + image.width / 2;
            this.origin[1] = rect[1] - config.dy || 0 + image.height / 2;
        }
    },

    type: "Image",

    /**
     * 绘制图片。 必须注意的图片同其他形状一样默认以左下角为起点。
     * 但是由于这是通过容器canvas大小和目标图像的高度计算得来，在
     * 和其他形状配合使用时遇到变化可能会出现问题。 此时就需要设置
     * coordinate属性为-1，使得绘图片还是以左上角为原点.
     * @private
     */
    BuildPath: function(ctx, config) {
        var buildImagePath1 = function() {
            var image = this.image || config.image;
            if (image) {
                numberOrZero(config, ["dx", "dy", "sx", "sy"]);
                let dy = config.dy;
                let sWidth = config.sWidth || image.width;
                let sHeight = config.sHeight || image.height;
                let dWidth = config.dWidth || image.width;
                let dHeight = config.dHeight || image.height;
                //图片的目标位置应该是图片的左下角, 在笛卡尔坐标系中就应该加上图片的目标高度
                // dy += dHeight;
                ctx.drawImage(image, config.sx, config.sy, sWidth, sHeight, config.dx, dy, dWidth, dHeight);

                this.rect = [config.dx, dy, config.dx + dWidth, dy + dHeight];
                // this.__setOrigin(image);
            }
        };
        onImgReady(this, this.image, [buildImagePath1, function() {
            this.ReBrushAll();
        }]);
    },

    /*eslint-disable*/
    _isPtInPath: function(x,y){
        return true;
    }
    /*eslint-disable */
});

function numberOrZero(obj, fields) {
    if (isArr(fields)) {
        fields.forEach(field => {
            obj[field] = (checkNull(obj[field]) || isNaN(obj[field])) ? 0 : obj[field];
        });
    } else {
        obj[fields] = (checkNull(obj[fields]) || isNaN(obj[fields])) ? 0 : obj[fields];
    }
}
