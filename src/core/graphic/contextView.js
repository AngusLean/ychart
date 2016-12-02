/**
 * 绘制在canvas上的元素基类模块
 * @module ychart/core/graphic/contextview
 */

import View from "./view";
import Transform from "./mixin/transform";
import Eventful from "./mixin/eventful";
import Moveable from "./mixin/moveable";
import OptionProxy from "../config/OptionProxy";
import text from "./helper/text";

import {
    mixin
} from "../../tool/klass";

import {
    isPtInPath,
    isPtInRect
} from "./helper/viewutil";

import {
    getRectByCtx
} from "../../tool/dom.js";

/**
 * @classdesc 绘制在canvas上的CanvasRenderingContext2D图形的绘图处理类,该类提供绘图相关
 * 的方法和控制，但是具体路径的绘制则由具体图形负责。 该类可以说仅仅是一个代
 * 理
 * @class
 * @abstract
 */
class ContextView extends View {

    /**
     * @param {String} type  元素类型. 该类型默认为ContextView
     * @param {Object} option  实例的具体参数
     * @constructor
     */
    constructor(type = "ContextView", option = {}) {
        super(type, option);

        this.configProxy = new OptionProxy(this.defaultConfig, option);

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
     *
     * @property {boolean} Draggable 当前元素是否可以拖动
     * @default true
     */
    get draggable() {
        return this.config.draggable === undefined ? true : this.config.draggable;
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
     * 重绘整个ychart实例. 通常用于元素位置改变\图片加载完成过后
     */
    ReBrushAll() {
        this.__yh && this.__yh.update();
    }

    /**
     * 绘图元素在把内容绘制到context之前调用的函数
     * @method
     * @param {CanvasRenderingContext2D} ctx
     */
    /* eslint-disable */
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
    GetContainRect() { return this.rect; }
    /*eslint-enable */

    /**
     * 通过上下文获取绘图的canvas尺寸
     * @param {CanvasRenderingContext2D} ctx
     */
    getRectByCtx(ctx) {
        return getRectByCtx(ctx);
    }


    /**
     * 绘图元素在把内容绘制到context之前调用的函数
     * @method
     * @private
     * @param {CanvasRenderingContext2D} ctx
     */
    _BeforeBrush(ctx, config) {
        ctx.save();

        this._SetShapeTransform(ctx, config);

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
    _SetShapeTransform(ctx) {
        this.updateTransform();
        this.setTransform(ctx);
    }

    /**
     * 绘图元素在把内容绘制到context之后调用的函数
     * @method
     * @private
     * @param {CanvasRenderingContext2D} ctx
     */
    _AfterBrush(ctx, config) {
        var tp = this.configProxy.getBrushType();
        /* eslint-disable */
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
        /* eslint-enable */
        ctx.restore();
        this.AfterBrush(ctx, config);
    }

    /**
     * 具体绘制路径的接口函数。 具体绘图子类必须实现该方法
     * @abstract
     * @param {CanvasRenderingContext2D} ctx
     * @param {object} config --配置。
     */
    _BuildPath(ctx, config) {
        //子类设置合适的填充方法
        this.BuildPath(ctx, config);
    }


    /**
     * 绘制的接口。 绘制该元素必须调用该方法
     * @method
     * @param {CanvasRenderingContext2D} ctx
     */
    Brush(ctx) {
        var config = this.config;
        if (!config.ignore) {
            //设置样式
            this._BeforeBrush(ctx, config);
            //具体图形自己的定制
            this._BuildPath(ctx, config);
            //恢复事故现场
            this._AfterBrush(ctx, config);

            this.DrawText(ctx, config);
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
     * 判断点是否在当前元素内.该方法会首先通过
     * @see {GetContainRect} 方法判断,然后调用 @see {_isPtInPath} 方法
     * @param {Number} x   x座标
     * @param {Number} y   y座标
     */
    contain(x, y) {
        var local = this.transformCoordToLocal(x, y);
        //当前元素的containRect作为缓存, 鼠标应该首先在该范围内才继续判断
        return this.getable &&
            (isPtInRect(this.GetContainRect(), local[0], local[1]) &&
                this._isPtInPath(x, y));
    }

    /**
     * 通过路径绘制来判断点是否在元素上
     * @param x
     * @param y
     * @private
     */
    _isPtInPath(x,y){
        return isPtInPath(this, this.config, x, y);
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
        var crect = this.GetContainRect();
        if (!crect) {
            return;
        }
        var x = crect[0] + (crect[2] - crect[0]) / 2;
        var y = crect[1] + (crect[3] - crect[1]) / 2;

        var st = this.configProxy.getStyle();
        /* eslint-disable */
        var textw = text.getTextWidth(config.text, st.font);
        var texth = text.getTextHeight(config.text ,st.font);
        var textAlign = st.textAlign , textBaseline = st.textBaseline;
        switch (config.textpos) {
            case "bottom-center":
                y = crect[1];
                textAlign = "center";
                break;
            case "top-left":
            case "left-top":
                x = crect[0];
                y = crect[1];
                break;
            case "bottom-right":
            case "right-bottom":
                x = crect[2] - textw;
                y = crect[1];
                break;
            case "left-center":
                x = crect[0];
                textAlign = "left";
                textBaseline = "middle";
                break;
            case "left-bottom":
            case "bottom-left":
                x = crect[0];
                y = crect[3];
                break;
            case "top-center":
                y = crect[3];
                textAlign = "center";
                textBaseline = "top";
                // x -= textw/2;
                break;
            case "top-right":
            case "right-top":
                y = crect[3];
                x = crect[2]-textw;
                break;
            case "right-center":
                x = crect[2]-textw;
                y -= texth/2;
                break;
            default:
                textAlign = "center";
                textBaseline = "middle";
        }
        /* eslint-disable */
        ctx.save();
        //文字颜色
        if (st.textColor) {
            ctx.fillStyle = st.textColor;
        }
        //文字的变换与图形不一样，默认情况下就是正向的，特别处理
        var globalTextPos = this.transformCoordToGlobal(x,y);
        x = globalTextPos[0] ,y=globalTextPos[1];

        text.fillText(ctx, config.text, x, y, st.font, textAlign, textBaseline);

        ctx.restore();
    }
}


mixin(ContextView, Transform, true);
mixin(ContextView, Eventful, true);
mixin(ContextView, Moveable, true);

export default ContextView;
