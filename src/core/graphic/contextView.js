/**
 * 绘制在canvas上的元素基类模块
 * @module ychart/core/graphic/contextview
 */

import View from "./view"
import Transform from "./mixin/transform"
import Eventful from "./mixin/eventful"
import Moveable from "./mixin/moveable"
import OptionProxy from "../config/OptionProxy"
import text from "./helper/text"

import {mixin} from "../../tool/klass"
import {isPtInPath} from "./helper/viewutil"

/**
 * 绘制在canvas上的图形的基类
 * @class
 */
class ContextView extends View{
    constructor(type = "ContextView" ,option={}){
        super(type , option);

        this.configProxy = new OptionProxy(option);

        /**
         * 当前元素的层级。层级决定了当前元素将被绘制在第几层canvas上
         * @member {Number}
         * @default 0
         */
        this.zLevel = 0;

        /**
         * 当前元素是否可以拖动
         * @member {boolean}
         * @default false
         */
        this.draggable = option.draggable == undefined ? true :  option.draggable;

        /**
         * 绘图实例，用于调用实例的刷新方法
         * @member {object}
         * @private
         */
        this.__yh = null;

        // Transform.call(this, option);
        Eventful.call(this);
    }

    /**
     * 绘图元素在把内容绘制到context之前调用的函数
     * @method
     * @param {CanvasRenderingContext2D} ctx
     */
    BeforeBrush(ctx,config) {
        ctx.save();

        this.SetShapeTransform(ctx,config);

        this.configProxy.bindContext(ctx);

        ctx.beginPath();
    }

    /**
     * 设置绘图变换
     * @method
     * @param {CanvasRenderingContext2D} ctx
     */
    SetShapeTransform(ctx,config) {

        this._SetShapeLocalTransform(config);

        this.updateTransform();

        this.setTransform(ctx);
    }


    _SetShapeLocalTransform(config){
        var _this = this;
        var keyWords = ["rotation","position","scale","transform","origin"];
        keyWords.forEach(function (item) {
            !_this[item] && (_this[item] = config[item]);
        })
    }

    /**
     * 绘图元素在把内容绘制到context之后调用的函数
     * @method
     * @param {CanvasRenderingContext2D} ctx
     */
    AfterBrush(ctx) {
        var tp = this.configProxy.getBrushType();
        switch (tp) {
            case "both":
            case "all":
                ctx.fill();
                ctx.stroke();
                break;
            case "stroke":
                ctx.stroke();
                break;
            case "fill":
                ctx.fill();
                break;
            case "none":
                break;
            default :
                ctx.fill();
                break;
        }
        ctx.restore();
    }

    /**
     * 具体绘制路径的接口函数。 具体绘图子类必须实现该方法
     * @abstract
     * @param {CanvasRenderingContext2D} ctx
     * @param {object} config --配置。
     */
    BuildPath(ctx, config) {
        //设置合适的填充方法
        throw new Error(" unsurported operation -- can't build shape path");
    }

    /**
     * 绘制的接口。 绘制该元素必须调用该方法
     * @method
     * @param {CanvasRenderingContext2D} ctx
     */
    Brush(ctx ,width ,height) {
        var config = this.configProxy.getConfig(width,height);

        if (!config.ignore) {
            //设置样式
            this.BeforeBrush(ctx, config);
            //具体图形自己的定制
            this.BuildPath(ctx, config);
            this.DrawText(ctx, config);
            //恢复事故现场
            this.AfterBrush(ctx, config);
        }
    }

    /**
     * 设置元素配置项。 调用该方法会导致该元素被标记为脏，下一次重新页面刷新时将清楚该元素所在层并且重新绘制
     * @param {object} option
     */
    setOption(option) {
        this.configProxy.update(option);
        this.__dirty = true;
    }

    /**
     * 判断点是否在当前元素内
     * @param {object}  point  包含x,y两个属性的点
     */
    contain(point) {
        var local = [point.x, point.y];
        return isPtInPath(this, this.configProxy.getConfig(), local[0], local[1]);
    }

    /**
     * 绘制文字
     * @param {CanvasRenderingContext2D} ctx
     * @param {object} config --绘制配置
     */
    DrawText(ctx, config) {
        if (!config.text) {
            return;
        }

        var beginpt = this.GetContainRect();

        var x = beginpt[0][0];
        var y = beginpt[0][1];
        var height = beginpt[2][1] - beginpt[0][1];
        y = y + height / 2;

        ctx.save();
        var st = this.configProxy.getStyle();
        //文字颜色
        if (!st.textColor) {
            ctx.fillStyle = st.textColor;
        }

        //文字的变换与图形不一样，默认情况下就是正向的，特别处理
        this.updateTransform();
        var m = this.transform;
        ctx.setTransform(m[0], m[1], m[2], -m[3], m[4], m[5]);

        text.fillText(ctx, config.text, x, m[5] - y, st.font,
            st.textAlign, st.textBaseline);

        ctx.restore();
    }
}

mixin(ContextView, Transform, true);
mixin(ContextView, Eventful, true);
mixin(ContextView, Moveable, true);

export default ContextView