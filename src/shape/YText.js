/**
 * 文字
 * @module ychart/shape/Text
 */
import {checkNull} from "../tool/util"
import utext from "../core/graphic/helper/text"
import ShapeBuilder from "../core/viewBuilder"
/**
 * 文本
 * 由于文本显示与图像刚好是竖向完全相反的两个方向，所以对文本绘制特殊处理。
 * 某区域文本是直角座标系，但是文字实际上还是默认的座标系，不过Y被改成负数了
 * @class Text
 * @property {string} text 显示的文字
 * @property {Array.number} beginpt 开始座标
 * @constructor
 */
export default ShapeBuilder.baseContextViewExtend({

    type: "Text",

    BuildPath: function (ctx, config) {
        config.style.brushType = "none";
    },

    DrawText: function (ctx, config) {
        if (checkNull(config.text)) {
            return;
        }


        var pt = config.beginpt;
        ctx.save();
        //文字颜色
        if (!checkNull(config.style.textColor)) {
            ctx.fillStyle = config.style.textColor;
        }
        this.updateTransform();
        var m = this.transform;
        ctx.setTransform(m[0], m[1], m[2], -m[3], m[4], m[5]);
        utext.fillText(ctx, config.text, pt[0], -pt[1],
            config.style.font, config.style.textAlign, config.style.textBaseline);
        ctx.restore();
    }
});

