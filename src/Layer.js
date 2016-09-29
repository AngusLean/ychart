/**
 * 代表canvas中一个绘图层。 与具体形状的关系仅仅是当前layer所处的zIndex
 * @module ychart/layer
 */
import {
    checkNull
} from "./tool/util";
import {
    createDOM,
    getContext
} from "./tool/dom";
import Moveable from "./core/graphic/mixin/moveable.js";
import Transform from "./core/graphic/mixin/transform.js";
import {
    mixin
} from "./tool/klass.js";

/**
 *
 * @class
 * @classdesc 一个绘图层。 对应DOM上一个canvas元素。
 *   每一个layer都有自己独立和样式。 不同layer之间的前后关系由Storage模块处理。 layer的具体绘制由Painter处理
 */
class Layer {

    /**
    * @param id {string} Layer的ID
    * @param zLevel {Number}  所属的zLevel，决定了该层的显示位置
    * @param opts {object}
    * @constructor
    */
    constructor(id, zLevel, opts) {
        this.id = id;
        this.dom = document.getElementById(id);
        this.zLevel = zLevel;

        if (checkNull(this.dom)) {
            this.dom = createDOM(id, "canvas", opts.width, opts.height, opts.left || 0, opts.top || 0);
        }

        this.dom.setAttribute("zLevel", zLevel);

        this.ctx = getContext(this.dom);

        this.layerW = opts.width;
        this.layerH = opts.height;

        if (checkNull(this.ctx)) {
            alert("浏览器不支持HTML5 canvas绘图,请更新浏览器 " + this.ctx);
            return;
        }

        //当前画布由于包含的图形有变化需要清除后重新绘制
        this.__dirty = false;

        Transform.call(this);
    }

    /**
     * 获取当前层的zlevel
     * @return {Number} zLevel  所在层级
     */
    getZlevel() {
        return this.zLevel;
    }

    /**
     * 获取当前绘图层的上下文
     * @returns {CanvasRenderingContext2D}
     */
    getContext() {
        return this.ctx;
    }

    /**
     * 清除当前layer所有的绘制的内容
     */
    clear() {
        this.ctx.clearRect(0, 0, this.layerW, this.layerH);
    }

    /**
     * 改变当前layer的大小。 该操作实际上是通过计算目标大小与当前的canvas大小
     * 然后按照对应的比例进行缩放实现的。  同时，也会改变canvas本身的大小
     * @param {Number} width  目标宽度
     * @param {Number} height  目标高度
     */
    resize(width, height) {
        var dx = width / this.layerW,
            dy = height / this.layerH;

        this.zoom(dx, dy);

        //由于layer始终会是最根部的一个元素，所以它的变换需要手动调用。
        //而对于Group的变换，只有在确定了它所处的层级过后才能更新变换
        this.updateTransform();

        this.dom.width = width;
        this.dom.height = height;
        this.layerW = width, this.layerH = height;
    }
}

mixin(Layer, Transform, true);
mixin(Layer, Moveable, true);

export default Layer;
