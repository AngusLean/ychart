/**
 * @module ychart/core/graphic/mixin
 */


import {isArr} from "../../../tool/util"

/**
 * 元素移动相关功能实现。 混入类
 * @class
 * @mixin
 */
var Moveable = function () {

};

Moveable.prototype = {
    constructor: Moveable,

    /**
     * 拖动
     * @param {number} dx
     * @param {number} dy
     */
    drift: function (dx, dy) {
        if (!isArr(this.position)) {
            this.position = [0, 0];
        }

        this.position[0] += dx;
        this.position[1] -= dy;

        this.__dirty = true;
    },

    /**
     * 移动。 和drift方法完全一样
     * @param {number} dx
     * @param {number} dy
     */
    move: function (dx, dy) {
        this.drift(dx, dy);
    },

    /**
     * 旋转
     * @param {number}  x 圆心X座标
     * @param {number}  y 圆心y座标
     * @param {number}  angle 旋转弧度
     */
    rotate: function (x, y, angle) {
        if (!isArr(this.origin)) {
            this.origin = [0, 0];
        }
        if(!this.rotation){
            this.rotation = 0;
        }
        this.origin[0] += x;
        this.origin[1] += y;
        this.rotation += angle;

        this.__dirty = true;
    },

    /**
     * 缩放
     * 注意该缩放必须是相对于某个点的. 默认情况下是[0,0] 这个肯定不是想要的结果,
     * 必须在shape指定origin为缩放的原点
     *
     * @param {number}  x X方向放大比例
     * @param {number}  y y方向放大比例
     */
    zoom: function (x, y) {
        this.scale[0] *= x;
        this.scale[1] *= y;
        this.__dirty = true;
    }
};


export default Moveable;
