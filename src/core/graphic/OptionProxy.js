/**
 * 每个可绘制元素的配置项管理类。 该类将管理每个元素绘制需要的各项属性，其中，
 * 样式采用styleProxy代理管理。 应该为样式有别名及默认样式。
 */


import styleProxy from "./StyleProxy"
import {checkNull} from "../../tool/util"

var optionProxy = function (config) {

    this.styleProxy = null;

    //每个绘图元素的所有配置项。 其中 style 这个项表示所有样式相关。 独立处理
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
optionProxy.prototype.init = function (config) {
    for (item in config) {
        if (!checkNull(config[item])) {
            if (item != "style") {
                this.config[item] = config[item];
            } else {
                this.styleProxy = new styleProxy(config[item]);
            }
        }
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
optionProxy.prototype.getConfig = function () {
    return this.config;
};

/**
 * 获取样式
 * @returns {optionProxy.config.style|{}}
 */
optionProxy.prototype.getStyle = function () {
    return this.config.style || {};
};

/**
 * 绑定当前样式到指定的上下文
 * @param context
 */
optionProxy.prototype.bindContext = function (context) {
    this.styleProxy.bindContext(context);
};

/**
 * 获取画刷类型。 自动基于属性选择是填充还是描边
 * @param context
 */
optionProxy.prototype.getBrushType = function (context) {
    return this.styleProxy.getBrushType();
};

/**
 * 更新数据
 * @param option
 */
optionProxy.prototype.update = function (config) {
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


export default optionProxy;
