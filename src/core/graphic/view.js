/**
 * 绘图基类View模块
 * @module ychart/core/graphic/view
 */

import Element from "./element";
/**
 * @class
 * @classdesc 绘图基类。 页面上所有可以显示的绘图最小单元都必须继承该类
 * @abstract
 */
class View extends Element {

    /**
     * 构造函数
     * @constructor
     * @param {String} type 该类默认为view类型
     * @param {Object} option
     */
    constructor(type = "view", option = {}) {
        super(type);

        /**
         * 该元素是否为脏，为脏的话在下次绘图时需要重新计算和绘制
         * @member {boolean}  默认true
         * @private
         */
        this.__dirty = true;

        /**
         * 当前元素的父元素
         * @member {object} 默认为null
         */
        this.parent = null;

        /**
         * 当前元素是否被忽略。 被忽略的话将不会绘制在页面上
         * @member {boolean}
         */
        this.ignore = option.ignore || false;
    }

    /**
     * 绘图抽象方法。 子类必须实现该方法
     * @abstract
     * @param {Object} option 绘图参数
     * @throws Error  如果子类没有实现该方法将抛出错误
     */
    /* eslint-disable */
    Brush(option) {
        throw new Error("绘图单元必须实现该方法");
    }
    /* eslint-enable */
}

export default View;
