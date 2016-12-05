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
    tipoffsetY: 0,

    //默认的坐标系. 默认为笛卡尔坐标系, 否则就是已左上角为原点的坐标系
    //该值对ViewBuilder类的设置和YText类有直接影响
    coordinateSystem: "Cartesian"
};

