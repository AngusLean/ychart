/**
 * 配置代理类。 内部依赖 {@link module:ychart/core/config/styleProxy}
 * @module ychart/core/config/optionProxy
 */


import styleProxy from "./StyleProxy"

import {DEFAULT_CONFIG,useRectangularCoordinateSystem} from "./config"

import {checkNull} from "../../tool/util"
/**
 * 每个可绘制元素的配置代理类
 * 每个可绘制元素的配置项管理类。 该类将管理每个元素绘制需要的各项属性，其中，
 * 样式采用styleProxy代理管理。 应该为样式有别名及默认样式。
 *
 * @class
 * @param config
 */
var OptionProxy = function (config) {

    /**
     * 配置代理
     * @member {boolean}
     * @default null
     */
    this.styleProxy = null;

    //每个绘图元素的所有配置项。 其中 style 这个项表示所有样式相关。 独立处理

    /**
     * 实际配置
     * @member {object}
     */
    this.config = {
        style: {}
    };

    this.init(config);
};


var item;

/**
 * 初始化样式管理类。 设置该元素绘制必须的样式
 * @param config
 */
OptionProxy.prototype.init = function (config) {
    var item;
    for (item in config) {
        if (!checkNull(config[item])) {
            if (item != "style") {
                this.config[item] = config[item];
            } else {
                this.styleProxy = new styleProxy(config[item]);
            }
        }
    }
    //设置默认设置
    for (item in DEFAULT_CONFIG){
        this.config[item] = typeof this.config[item] != "undefined" ? this.config[item] :
            DEFAULT_CONFIG[item];
    }
    if (this.styleProxy == null) {
        this.styleProxy = new styleProxy();
    }
    this.config.style = this.styleProxy.getStyle();
};

/**
 * 获取所有配置
 * @returns {object} config
 */
OptionProxy.prototype.getConfig = function (width , height) {
    if(checkNull(this.config["transform"]) && useRectangularCoordinateSystem){
        this.config["transform"] = [1, 0, 0, -1, 0, height]
    }
    return this.config;
};

/**
 * 获取样式
 * @returns {OptionProxy.config.style|{}}
 */
OptionProxy.prototype.getStyle = function () {
    return this.config.style || {};
};

/**
 * 绑定当前样式到指定的上下文
 * @param context
 */
OptionProxy.prototype.bindContext = function (context) {
    this.styleProxy.bindContext(context);
};

/**
 * 获取画刷类型。 自动基于属性选择是填充还是描边
 * @param context
 */
OptionProxy.prototype.getBrushType = function (context) {
    return this.styleProxy.getBrushType();
};

/**
 * 更新数据
 * @param option
 */
OptionProxy.prototype.update = function (config) {
    for (item in config) {
        if (!checkNull(config[item])) {
            if (item != "style") {
                this.config[item] = config[item];
            } else {
                this.styleProxy.update(config[item]);
            }
        }
    }
    this.config.style = this.styleProxy.getStyle();
};


export default OptionProxy;
