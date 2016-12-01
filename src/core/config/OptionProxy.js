/**
 * 配置代理类。 内部依赖 {@link module:ychart/core/config/styleProxy}
 * @module ychart/core/config/optionProxy
 */


import styleProxy from "./StyleProxy";

import { simpleMerge } from "../../tool/util";

/**
 * 每个可绘制元素的配置代理类
 * 每个可绘制元素的配置项管理类。 该类将管理每个元素绘制需要的各项属性，其中，
 * 样式采用styleProxy代理管理。 应该为样式有别名及默认样式。
 *
 * @class
 * @param config
 */
var OptionProxy = function(...options) {
    /**
     * 样式配置代理
     * @member {boolean}
     * @default null
     */
    this.styleProxy = new styleProxy();


    /**
     * 实际配置
     * 每个绘图元素的所有配置项。 其中 style 这个项表示所有样式相关。 独立处理
     * @member {object}
     */
    this.config = {
    };

    var _this = this;
    Object.defineProperty(this.config , "style" ,{
        enumerable : true,
        configurable : false,
        get: function(){
            return _this.styleProxy.getStyle();
        },
        set: function (val) {
            _this.styleProxy.update(val);
        }
    });

    this.update(options);
};


/**
 * 获取所有配置
 * @returns {object} config
 */
OptionProxy.prototype.getConfig = function() {
    return this.config;
};

/**
 * 获取样式
 * @returns {OptionProxy.config.style|{}}
 */
OptionProxy.prototype.getStyle = function() {
    return this.config.style || {};
};

/**
 * 绑定当前样式到指定的上下文
 * @param context
 */
OptionProxy.prototype.bindContext = function(context) {
    this.styleProxy.bindContext(context);
};

/**
 * 获取画刷类型。用于AfterBrush刷新时判断
 * @return {string} 画刷类型, 'both' \  'stroke' \ 'fill' \ 'none'
 */
OptionProxy.prototype.getBrushType = function() {
    return this.styleProxy.getBrushType();
};

/**
 * 更新数据
 * @param option
 */
OptionProxy.prototype.update = function(config) {
    simpleMerge(this.config , config);
};


export default OptionProxy;
