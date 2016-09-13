/**
 * 代表canvas中一个绘图层。 与具体形状的关系仅仅是当前layer所处的zIndex
 * @module ychart/layer
 */
import {checkNull} from "./tool/util"
import {createDOM,getContext} from "./tool/dom"


/**
 *
 * @class
 * @classdesc 一个绘图层。 对应DOM上一个canvas元素。
 *   每一个layer都有自己独立和样式。 不同layer之间的前后关系由Storage模块处理。 layer的具体绘制由Painter处理
 * @param id {string} Layer的ID
 * @param zLevel {string}  所属的zLevel，决定了该层的显示位置
 * @param opts {object}
 * @constructor
 */
var Layer = function (id, zLevel, opts) {
    this.id = id;
    this.dom = document.getElementById(id);
    this.zLevel = zLevel;

    if (checkNull(this.dom)) {
        this.dom = createDOM(id, "canvas", opts.width, opts.height, opts.left || 0, opts.top || 0);
    }

    this.dom.setAttribute("zLevel", zLevel);
    this.ctx = getContext(this.dom);
    if (checkNull(this.ctx)) {
        alert("浏览器不支持HTML5 canvas绘图,请更新浏览器 " + this.ctx);
        return;
    }

    //画布大小
    this.ctxWidth = this.ctx.canvas.width;
    this.ctxHeight = this.ctx.canvas.height;

    //默认变换。即已当前层的左下角为原点的直角座标系
    // this.transform = [1, 0, 0, -1, 0, this.ctxHeight];

    //当前画布由于包含的图形有变化需要清除后重新绘制
    this.__needClear = false;
};


/**
 * 获取当前层的zlevel
 */
Layer.prototype.getZlevel = function () {
    return this.zLevel;
};

/**
 * 获取当前绘图层的上下文
 * @returns {context}
 */
Layer.prototype.getContext = function () {
    return this.ctx;
};

/**
 * 清除当前layer
 * @returns {*}
 */
Layer.prototype.clear = function () {
    this.ctx.clearRect(0, 0, this.ctxWidth, this.ctxHeight);
};

export default Layer;

