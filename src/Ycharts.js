/**
 * 绘图核心控制模块
 * @module ychart/Ychart
 */
import Storage from "./Storage"
import Painter from "./Painter"
import Handler from "./Handler"


/**
 * @classdesc简单的基于Html5 canvas的绘图库， 使用MVC思想封装绘图代码，使得开发者可以很方便的使用本库
 * 封装的canvas API绘图。
 * @class
 * @param eleid  放置canvas的容器。 不能是canvas元素， 必须设置宽度和高度
 * @param opt
 * @constructor
 */
var i=1000;
var YCharts = function (eleid, opt) {
    //当前实例ID
    // this.id = "Ychart-"+i++;
    //当前实例绑定的页面元素ID
    this.domid = eleid;

    //存储所有绘图相关组件。
    this.__storage = new Storage(this);
    //绘图具体操作类。 与storage交互
    this.__painter = new Painter(this, this.__storage);
    //事件相关操作
    this.__handler = new Handler(this.domid, this.__painter, this.__storage);
};


YCharts.prototype.clear = function () {
    this.__painter.clean();
    this.__storage.clean();
};

YCharts.prototype.cleanPainter = function(){
    this.__painter.cleanPainter();
};

YCharts.prototype.add = function (el) {
    this.__storage.addEle(el);
    return this;
};

YCharts.prototype.BrushAll = function () {
    this.__painter.refresh();
    return this;
};

YCharts.prototype.update = function () {
    this.BrushAll();
};

YCharts.prototype.getWidth = function(){
    return this.__painter.getWidth();
};

YCharts.prototype.getHeight = function(){
    return this.__painter.getHeight();
};

/**
 * ychart全局入口对象。
 * @global
 * @class
 * @type {{}}
 */
var ychart = {};
var instances = {};

/**
 * ycharts外部访问接口。 用于统一管理所有用到的ycharts实例
 * @param id  容器ID
 * @param config 相关配置
 * @returns {YCharts}
 */
ychart.init = function (id, config) {
    var _charts = new YCharts(id, config);
    instances[id] = _charts;
    return _charts;
};

ychart.depose = function (id) {
    if (instances[id]) {
        instances[id].clean();
        instances[id] = null;
    }
};


export default ychart;
