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
     * 每个具体元素类的默认配置。
     * 该配置将覆盖全局系统默认配置，但是会被全局用户自定义配置以及具体元素配置所覆盖
     * @property {Object}  config  元素默认配置
     * @default {style:{}}
     */
    // static defaultConfig = {
    // style:{
    // }
    // }


    /**
     * 是否使用直角座标系，除了图片和文字，其他字体默认都是以
     * 左下角为原点的座标系
     * @property {number} coordinate o为正常形状的直角座标系，1为图片或者文字的直角座标系。 其他值使用默认座标系
     * @default 图片或文字为1，其他元素为0
     */
    get coordinate() {
        return this.configProxy.getConfig().coordinate;
    }

    set coordinate(val) {
        this.configProxy.update({
            coordinate: val
        });
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
    RebrushAll() {
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
    GetContainRect() {
            return this.rect;
        }
        /*eslint-enable */

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
    __SetShapeTransform(ctx) {
        if (this.coordinate === 0) {
            let rct = this.getRectByCtx(ctx);
            //ctx.translate(0, rct[1]);
            //ctx.scale(1, -1);
            //this.rotation = Math.PI / 2;
            //this.position = [0,rct[1]];
            this.position[1] += rct[1];
            this.rotation = Math.PI /2;
        }

        this.updateTransform();

        this.setTransform(ctx);

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
    /* eslint-disable*/
    BuildPath(ctx, config) {
            //设置合适的填充方法
            throw new Error(" unsurported operation -- can't build shape path");
        }
        /* eslint-enable */

    /**
     * 绘制的接口。 绘制该元素必须调用该方法
     * @method
     * @param {CanvasRenderingContext2D} ctx
     */
    Brush(ctx) {
        var config = this.config;

        if (!config.ignore) {
            //设置样式
            this.__BeforeBrush(ctx, config);
            //具体图形自己的定制
            this.BuildPath(ctx, config);
            //恢复事故现场
            this.__AfterBrush(ctx, config);

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
     * 判断点是否在当前元素内
     * @param {Number} x   x座标
     * @param {Number} y   y座标
     */
    contain(x, y) {
        var local = this.transformCoordToLocal(x, y);
        return this.getable &&
            (isPtInRect(this.GetContainRect(), local[0], local[1]) ||
                isPtInPath(this, this.config, x, y));
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
        let textw = text.getTextWidth(config.text, st.font);
        let texth = text.getTextHeight(config.text ,st.font);
        switch (config.textpos) {
            case "top-center":
                x -= textw/2;
                y = crect[1];
                break;
            case "top-left":
            case "left-top":
                x = crect[0];
                y = crect[1];
                break;
            case "top-right":
                x = crect[2] - wh;
                y = crect[1];
                break;
            case "left-center":
                x = crect[0];
                y -= texth/2;
                st.textBaseline = "top";
                break;
            case "left-bottom":
                x = crect[0];
                y = crect[3];
                break;
            case "bottom-center":
                y = crect[3];
                x -= textw/2;
                break;
            case "bottom-right":
                y = crect[3];
                x = crect[2]-textw;
            case "right-center":
                x = crect[2]-textw;
                y -= texth/2;
                st.textBaseline = "top";
                break;
            default:
                x -= textw/2;
                y -= texth/2;
                st.textBaseline = "top";
        }
        /* eslint-disable */
        ctx.save();
        //文字颜色
        if (st.textColor) {
            ctx.fillStyle = st.textColor;
        }
        //this.rotation = Math.PI;
        ctx.setTransform(1,0,0,1,0,0);
        //this.setTransform(1,0,0,-1,0,600);
        //文字的变换与图形不一样，默认情况下就是正向的，特别处理
        //var rect = getRectByCtx(ctx);
        text.fillText(ctx, config.text, x, y, st.font, st.textAlign, st.textBaseline);
        ctx.restore();
    }
}


mixin(ContextView, Transform, true);
mixin(ContextView, Eventful, true);
mixin(ContextView, Moveable, true);

export default ContextView;
