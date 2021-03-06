/**
 * 样式名映射
 * @module ychart/core/config/style
 */
var styleMap = {

    fillStyle: "fillStyle",
    fillColor: "fillStyle",
    color: "fillStyle",

    strokeStyle: "strokeStyle",
    lineColor: "strokeStyle",
    lineWidth: "lineWidth",
    lineCap: "lineCap",
    lineJoin: "lineJoin",
    font: "font",

    textAlign: "textAlign",
    textBaseline: "textBaseline",

    shadowColor: "shadowColor",
    shadowOffsetX: "shadowOffsetX",
    shadowOffsetY: "shadowOffsetY",
    shadowBlur: "shadowBlur",
    shadowx: "shadowOffsetX",
    shadowy: "shadowOffsetY",

    globalAlpha: "globalAlpha",
    alpha: "globalAlpha",
    globalCompositionOperation: "globalCompositionOperation",
    overlaystyle: "globalCompositionOperation"
};


/**
 * @classdesc 全局默认样式。 所有形状或者路劲的样式都基于这个样式。
 * 负责为所有模块提供默认样式及自定义样式名到标准样式名的转换
 * 映射配置属性名到canvas属性.
 * 应该包含默认的属性名
 * 新加一个属性在这个映射和下面CONFIG中的style中同时添加
 * @class
 */
var style = function () {
};


style.prototype = {
    /**
     * 线条颜色，用于任意路劲绘制中线条样式的控制。
     * 值可以是任意十六进制颜色或者英文单词
     * 别名 : lineColor
     * @type string
     * @default blue
     */
    strokeStyle: "blue",

    /**
     * 填充颜色，用于任意路劲中fill方法的填充样式
     * 值可以是任意十六进制颜色或者英文单词
     * 别名 ： fillColor  color
     * @type string
     * @default #dcd5d9
     */
    fillStyle: "#dcd5d9",

    /**
     * 线宽。
     * @type number
     * @default 1
     */
    lineWidth: 1,

    /**
     * 线条两端样式. butt、round、square
     * @type string
     * @default round
     */
    lineCap: "round",

    /**
     * bevel,miter线条相交的方式. 园交,斜交还是斜接.
     * @type string
     * @default round
     */
    lineJoin: "round",

    /**
     * 文字
     * @type string
     * @default bold 14px Arial, Helvetica, sans-serif, Times, serif
     */
    font: "bold 14px Arial, Helvetica, sans-serif, Times, serif",

    /**
     * 文字颜色。 strokeStyle
     * 该属性不是标准的canvas样式，是ycharts为方便文字控制添加的
     * @type string
     * @default black
     */
    textColor: "black", //文字样式。 非标准canvas属性

    /**
     * 文本对齐方式
     * @type string
     * @default start
     */
    textAlign: "start",

    /**
     * 文本基线
     * @type string
     * @default bottom
     */
    textBaseline: "bottom",

    /**
     * 默认阴影颜色
     * @type string
     * @default #EA9090
     */
    shadowColor: "#EA9090",

    /**
     * 阴影X偏移
     * @type number
     * @default  shadowOffsetX
     */
    shadowOffsetX: 0,

    /**
     * 阴影Y偏移
     * @type number
     * @default shadowOffsetY
     */
    shadowOffsetY: 0,

    /**
     * 像素的模糊数
     * @type number
     * @default 0
     */
    shadowBlur: 0,

    /**
     * 透明度。  0为透明
     * @type number
     * @default 1
     */
    globalAlpha: 1,

    /**
     * 透明重叠情况
     * @type string
     * @default source-over
     */
    globalCompositionOperation: "source-over"

};


export default {
    style: style,
    styleMap: styleMap
};

