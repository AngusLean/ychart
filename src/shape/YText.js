/**
 * 文字
 * @module ychart/shape/Text
 */
import {
    checkNull
} from "../tool/util";
import utext from "../core/graphic/helper/text";
import ShapeBuilder from "../core/viewBuilder";
/**
 * 文本
 * 由于文本显示与图像刚好是竖向完全相反的两个方向，所以对文本绘制特殊处理。
 * 某区域文本是直角座标系，但是文字实际上还是默认的座标系，不过Y被改成负数了
 * @class Text
 * @property {string} text 显示的文字
 * @property {Array.number} beginpt 开始座标
 * @constructor YText
 */
export default ShapeBuilder.baseContextViewExtend({
    defaultConfig: {
        coordinate: 1
    },

    type: "Text",

    BuildPath: function(ctx, config) {
        config.style.brushType = "none";
    },

    DrawText: function(ctx, config) {
        if (checkNull(config.text)) {
            return;
        }
        ctx.save();

        //文字颜色
        if (!checkNull(config.style.textColor)) {
            ctx.fillStyle = config.style.textColor;
        }

        var rect = this.getRectByCtx(ctx);

        var y = rect[1] - config.dy;

        if (this.coordinate == -1) {
            y = config.dy;
        }

        var textparams = [config.text, config.dx, y, config.style.font, config.style.textAlign, config.style.textBaseline];

        utext.fillText(ctx, textparams[0], textparams[1], textparams[2], textparams[3], textparams[4], textparams[5]);

        //设置文本的包围圈
        if (this.__dirty || !this.containRect) {
            let textrect = utext.getTextRect(textparams[0], textparams[1], textparams[2], textparams[3], textparams[4], textparams[5]);
            this.containRect = [textrect.x, textrect.y, textrect.x + textrect.width, textrect.y + textrect.height];
        }

        ctx.restore();
    },

    GetContainRect: function() {
        return this.containRect;
    },

    /* IsPtInPath: function(){
        return true;
    } */

});
