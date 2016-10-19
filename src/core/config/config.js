/**
 * 默认全局配置
 * @global
 * @module ychart/core/config/style
 */
export var DEFAULT_CONFIG = {
    //变换相关属性
    position: [0,0],
    rotation: 0,
    scale:    [1,1],
    origin:   [0,0],
    transform: null,

    //元素在获取焦点时显示信息提示框必须和鼠标当前位置有偏移不然元素本身将不能捕获事件
    tipoffsetX: 10,
    tipoffsetY: 0
};

export var useRectangularCoordinateSystem = 0;
