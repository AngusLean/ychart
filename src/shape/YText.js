/**
 * 文字
 * @module ychart/shape/Text
 */

import text from "../core/graphic/helper/text";
import ShapeBuilder from "../core/viewBuilder";
import {DEFAULT_CONFIG} from "../core/config/config";

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
        if (!config.text) {
            return;
        }
        var x = config.dx;
        var y = config.dy;

        var st = this.configProxy.getStyle();
        var textAlign = st.textAlign , textBaseline = st.textBaseline;
        // var textrect = text.getTextRect(config.text , x ,y ,st.textFont ,st.textAlign ,st.textBaseline);

        ctx.save();
        //文字颜色
        if (st.textColor) {
            ctx.fillStyle = st.textColor;
        }
        //由于文字在canvas额默认变换下就是正的, 而ychart很可能是采用的笛卡尔坐标系,
        //所以在这里转换一下
        // y = 400-y;
        var globalTextPos = this.transformCoordToGlobal(x,y);
        x = globalTextPos[0] ,y=globalTextPos[1];
        var rect = text.fillText(ctx, config.text, x, y, st.font, textAlign, textBaseline);
        ctx.restore();

        if(this.__dirty && !this.rect){
            let bottom = rect.bottom,top = rect.top;
            if(DEFAULT_CONFIG.coordinateSystem == "Cartesian"){
                this.decomposeTransform();
                let h = this.position[1];
                bottom = h-bottom , top = top-h ;
            }
            this.rect = [rect.left , bottom ,rect.right , top];
        }
    },


    /*eslint-disable*/
    _isPtInPath: function(x,y){
        return true;
    }
    /*eslint-disable */

});
