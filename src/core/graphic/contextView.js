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

import {
    mixin
} from "../../tool/klass"

import {
    isPtInPath,
    isPtInRect
} from "./helper/viewutil"

import {
    noOp
} from "../../tool/lang"

import {
    getRectByCtx
} from "../../tool/dom.js"

/**
 * @classdesc 绘制在canvas上的CanvasRenderingContext2D图形的绘图处理类,该类提供绘图相关
 * 的方法和控制，但是具体路径的绘制则由具体图形负责。 该类可以说仅仅是一个代
 * 理
 * @class
 * @abstract
 */
class ContextView extends View {
    constructor(type = "ContextView", option = {}) {
        super(type, option);

        this.configProxy = new OptionProxy(option);

        /**
         * 绘图实例，用于调用实例的刷新方法
         * 在元素被添加到ychart实例的时候设置
         * @member {object}
         * @private
         */
        this.__yh = null;

        Transform.call(this, option);
        Eventful.call(this);
    }

    /**
     * 是否使用直角座标系，除了图片和文字，其他字体默认都是以
     * 左下角为原点的座标系
     * @property {number} coordinate o为正常形状的直角座标系，1为图片或者文字的直角座标系。 其他值使用默认座标系
     * @default 图片或文字为1，其他元素为0
     */
    get coordinate() {
        return this.configProxy.getConfig().coordinate;
    }

    /**
     *
     * @property {boolean} Draggable 当前元素是否可以拖动
     * @default true
     */
    get draggable() {
        return this.config.draggable === undefined ? true : option.draggable;
    }

    /**
     * 当前元素的层级。层级决定了当前元素将被绘制在第几层canvas上
     * @property {Number} zLevel
     * @default 0
     */
    get zLevel() {
        return this.config.zLevel || 0;
    }

    /**
     * @property {Object} config 获取当前shapa的配置项
     * @returns {Object}
     */
    get config() {
        return this.configProxy.getConfig();
    }

    /**
     * @property {boolean} getable 当前元素是否捕获事件。
     * @default true
     * @return boolean
     */
    get getable() {
        return typeof this.config.getable === "undefined" ? true : this.config.getable;
    }

    /**
     * 绘图元素在把内容绘制到context之前调用的函数
     * @method
     * @param {CanvasRenderingContext2D} ctx
     */
    BeforeBrush(ctx, config) {}

    /**
     * 绘图元素在把内容绘制到context之后调用的函数
     * @method
     * @param {CanvasRenderingContext2D} ctx
     */
    AfterBrush(ctx, config) {}

    /**
     * 获取当前元素的包围圈。
     * @return {Array.<Number>} 返回rect数组
     */
    GetContainRect() {}

    /**
     * 绘图元素在把内容绘制到context之前调用的函数
     * @method
     * @private
     * @param {CanvasRenderingContext2D} ctx
     */
    __BeforeBrush(ctx, config) {
        ctx.save();

        this.__SetShapeTransform(ctx, config);

        this.configProxy.bindContext(ctx);

        this.BeforeBrush(ctx, config);

        ctx.beginPath();
    }

    /**
     * 设置绘图变换
     * @method
     * @private
     * @param {CanvasRenderingContext2D} ctx
     */
    __SetShapeTransform(ctx, config) {

        this.updateTransform();

        this.setTransform(ctx);

        if (this.coordinate === 0) {
            let rct = this.getRectByCtx(ctx);
            ctx.translate(0, rct[1]);
            ctx.scale(1, -1);
        }
    }

    /**
     * 通过上下文获取绘图的canvas尺寸
     * @param {CanvasRenderingContext2D} ctx
     */
    getRectByCtx(ctx) {
        return getRectByCtx(ctx);
    }

    /**
     * 绘图元素在把内容绘制到context之后调用的函数
     * @method
     * @private
     * @param {CanvasRenderingContext2D} ctx
     */
    __AfterBrush(ctx, config) {
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
            default:
                ctx.fill();
                break;
        }
        ctx.restore();

        this.AfterBrush(ctx, config);
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
    Brush(ctx, width, height) {
        var config = this.config;

        if (!config.ignore) {
            //设置样式
            this.__BeforeBrush(ctx, config);
            //具体图形自己的定制
            this.BuildPath(ctx, config);
            this.DrawText(ctx, config);
            //恢复事故现场
            this.__AfterBrush(ctx, config);
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
     * @param {Number} x   x座标
     * @param {Number} y   y座标
     */
    contain(x, y) {
        var local = this.transformCoordToLocal(x, y);
        return isPtInRect(this.GetContainRect(), local[0], local[1]) ||
            isPtInPath(this, this.config, x, y);
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
        var rect = getRectByCtx(ctx);

        text.fillText(ctx, config.text, x, rect[1] - y, st.font,
            st.textAlign, st.textBaseline);

        ctx.restore();
    }

}


mixin(ContextView, Transform, true);
mixin(ContextView, Eventful, true);
mixin(ContextView, Moveable, true);

export default ContextView
