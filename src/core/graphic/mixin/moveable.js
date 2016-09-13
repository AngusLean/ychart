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
        this.origin[0] = x;
        this.origin[1] = y;
        this.rotation = angle;

        this.__dirty = true;
    }
};


export default Moveable;
