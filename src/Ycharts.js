/**
 * 绘图核心控制模块
 * @module ychart/Ychart
 */
import Storage from "./Storage"
import Painter from "./Painter"
import Handler from "./Handler"


var i=1000;
/**
 * @classdesc ychart绘图实例的类。在页面上调用YH.init后返回的就是该类的一个实例
 * @class YCharts
 * @param eleid {string}  放置canvas的容器。 不能是canvas元素， 必须设置宽度和高度
 * @constructor
 */
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


/**
 * 清除ychart实例所管理的所有内容。 调用该方法后所有保存的数据以及绘图情况都将被清除
 */
YCharts.prototype.clear = function () {
    this.__painter.clean();
    this.__storage.clean();
};

/**
 * 清除当前的canvas内容，但是将保留其他的配置数据等等。
 * 常用于ychart实例在缩放时需要清除页面上已绘制的数据
 * 的情况下
 */
YCharts.prototype.cleanPainter = function(){
    this.__painter.cleanPainter();
};

/**
 * 添加子元素。 子元素可以是任意的shpae或者Group或者自定义的类型
 */
YCharts.prototype.add = function (el) {
    this.__storage.addEle(el);
    return this;
};

/**
 * 刷新当前实例，调用该方法会导致所有变换被计算并且实际应用到canvas的
 * 上下文中，并且所有可见可绘制的图形都将被绘制
 */
YCharts.prototype.BrushAll = function () {
    this.__painter.refresh();
    return this;
};

/**
 * 更新当前实例，同
 *@see {@link BrushAll}
 */
YCharts.prototype.update = function () {
    this.BrushAll();
};

/**
 * 获取当前ychart容器的宽度
 */
YCharts.prototype.getWidth = function(){
    return this.__painter.getWidth();
};

/**
 * 获取当前canvas容器的高度
 */
YCharts.prototype.getHeight = function(){
    return this.__painter.getHeight();
};

/**
 * ychart全局入口对象。
 * @global
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
