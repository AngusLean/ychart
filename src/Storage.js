/**
 * 绘图中绘制存储器模块。 负责处理不同绘图层、统一绘图层不同显示级别的关系
 * @module ychart/storage
 *
 */
import {isArr} from "./tool/util";
import Group from "./Group";


/**
 *
 * 存储器
 * @class
 * @classdesc 存储器类。 负责存储整个ychart实例中所有信息。
 * @param yh {module:ychart/Ychart} ychart实例
 * @constructor
 */
var Storage = function (yh) {

    //ycharts实例
    this._yh = yh;

    //保存所有的形状组件
    this._roots = [];
};

/**
 * 添加一个子元素
 * @param element {module:ychart/core/graphic/element} 元素实例
 */
Storage.prototype.addEle = function (element) {
    if (!element || element.id === null) {
        return;
    }
    var index, i;
    for (index = 0; index < this._roots.length; index++) {
        i = this._roots[index];
        if (i.id == element.getId()) {
            return;
        }
    }
    element.__yh = this._yh;
    //group当成一个元素便于管理
    this._roots.push(element);
};

/**
 * 获取所有可绘制的图形列表。 组的所有子元素被提取出来。
 * @returns {Array.<module:ychart/core/graphic/element>}
 */
Storage.prototype.getDisplayableShapeList = function () {
    var list = [];
    var _getList = function (root) {
        if (isArr(root)) {
            for (var i = 0; i < root.length; i++) {
                if (root[i] instanceof Group) {
                    _getList(root[i].children);
                } else if (root[i].ignore === false) {
                    list.push(root[i]);
                }
            }
        } else if (root instanceof Group) {
            _getList(root.children);
        }
    };

    _getList(this._roots);

    return list;
};



/**
 * 清楚存储器
 */
Storage.prototype.clean = function () {
    this._roots = [];
};


export default Storage;
