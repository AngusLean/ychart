/**
 * 默认全局配置
 * @global
 * @module ychart/core/config/style
 */
export var DEFAULT_CONFIG = {
    //正常情况下鼠标样式
    cursor_default: "default",
    cursor_moveable: "move",
    cursor_getable: "pointer",

    //元素在获取焦点时显示信息提示框必须和鼠标当前位置有偏移不然元素本身将不能捕获事件
    tipoffsetX: 10,
    tipoffsetY: 0
};

export var useRectangularCoordinateSystem = 0;
