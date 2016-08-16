/**
 * 绘图基类View模块
 * @module ychart/core/graphic/view
 */

import Element from "./element"
/**
 * @class 绘图基类。 页面上所有可以显示的绘图最小单元都必须继承该类
 */
class View extends Element{

    /**
     * 构造函数
     * @constructor
     * @param {string} type
     * @param {object} option
     */
    constructor(type = "view" ,option={}){
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
     * @param {object} option -- 绘图参数
     * @throws Error
     */
    Brush(option){
        throw new Error("绘图单元必须实现该方法");
    }
}

export default View;