/**
 * 绘图中绘制控制器模块
 * @module ychart/painter
 */
import Layer from "./Layer";
import guid from "./tool/guid";
import Group from "./Group";
import {
    getPosition,
    createDOM
} from "./tool/dom";

/**
 * 绘图组件。
 * 该组件控制所有元素绘制相关的处理，包括各个元素之间的层级关系、属性继承等
 * 具体绘制的层在Layer模块中
 * @class
 * @classdesc 绘图器类
 * @param yh {module:ychart/Ychart} ychart实例
 * @param storage {module:ychart/storage}  存储器实例
 * @constructor
 */
var Painter = function(yh, storage) {
    this.__storage = storage;
    this.__yh = yh;
    this.origindom = document.getElementById(yh.domid);
    var temp = getPosition(this.origindom);
    this.width = temp.width;
    this.height = temp.height;
    this.left = temp.left;
    this.top = temp.top;

    // this.container = createDOM(guid() , "div" , "container" ,this.width , this.height ,"relative");
    this.container = createDOM(guid(), "div", "container", "relative", {
        width: "100%",
        height: "100%"
    });
    this.origindom.appendChild(this.container);
    this.__layer = [];
};

/**
 *刷新ychart实例所管理的所有元素， 该方法调用过后才会实际更改某个元素的属性。
 * 默认情况下通过构造方法或者setOption都只是添加了配置但是没有实际计算及显示
 */
Painter.prototype.refresh = function() {
    var shapeList = this.__storage.getDisplayableShapeList();
    this.updateLayerState(shapeList);
    var i, shape, layer, zlevel, lastZlevel = -1;
    for (i = 0; i < shapeList.length; i++) {
        shape = shapeList[i];
        zlevel = shape.zLevel || 0;
        layer = this.getLayer(zlevel);
        //脏元素所在的layer需要清除画布过后重新绘制
        if (lastZlevel != zlevel && layer.__dirty) {
            layer.clear();
            lastZlevel = zlevel;
            layer.__dirty = false;
        }
        this.preProcessShapeInLayer(shape, layer);
        shape.Brush(layer.getContext());
        this.afterProcessShapeInLayer(shape, layer);
    }
};

/**
 * 更新layer状态。 计算哪些层需要清除
 * @param shapeList {Array.<module:ychart/core/graphic/element>} 需要更新状态的元素列表
 */
Painter.prototype.updateLayerState = function(shapeList) {
    var i, layer, zlevel, shape;
    for (i = 0; i < shapeList.length; i++) {
        shape = shapeList[i];

        zlevel = shape.zLevel;
        layer = this.getLayer(zlevel);

        //如果图像为脏，则需要清除当前画布
        !layer.__dirty && (layer.__dirty = shape.__dirty);
    }
};


/**
 * 处理当前元素的层次结构,把当前形状的父元素与绘图层Layer关联起来
 * @param shape {module:ychart/core/graphic/element} 元素实例
 * @param layer {module:ychart/layer} 绘图层
 */
Painter.prototype.preProcessShapeInLayer = function(shape, layer) {
    layer.updateTransform();
    var _preProcessShapeInLayer = function(_shape) {
        if (_shape.parent == null) {
            _shape.parent = layer;
        } else if (_shape.parent instanceof Group) {
            _groupPreProcess(_shape.parent, layer);
        }
    };

    /**
     * 更新某个元素所属组的parent属性, 用于变换. 每个group都会继承它的parent的变换.
     * 顶层group继承所属Layer的变换.
     * 该方法最主要的目的是由根layer开始向上计算相应的变换矩阵
     * @param gp 当前group
     * @param ly 所属绘图层(Layer)
     * @private
     */
    var _groupPreProcess = function(gp, ly) {
        //第一个是最高级别的group,后面的都是它的子group
        var groupquene = [];
        var _buildGroupQuene = function(_group) {
            if (_group instanceof Group) {
                groupquene.unshift(_group);
            }
            if (_group.parent instanceof Group) {
                _buildGroupQuene(_group.parent);
            }
        };
        _buildGroupQuene(gp);
        var before = groupquene[0];
        groupquene.forEach(function(item, index) {
            if (index === 0) {
                item.parent = ly;
            } else {
                item.parent = before;
            }
            before = item;
            //更新组的变换
            item.updateTransform();
        });
    };


    _preProcessShapeInLayer(shape);
};

/**
 * 处理元素层次结构后的回调
 * @param shape {module:ychart/core/graphic/element} 元素实例
 * @param layer {module:ychart/layer} 绘图层
 */
Painter.prototype.afterProcessShapeInLayer = function(shape) {
    shape.__dirty = false;
};

/**
 * 获取指定zLevel的yaler，如果该zLevel不存在，就创建一个新的Layer实例并添加到绘图器
 * @param zLevel {string} 绘图所在层级， 整数
 * @return {module::ychart/layer} Layer实例
 */
Painter.prototype.getLayer = function(zLevel) {
    var layer = this.__layer[zLevel];
    if (!layer) {
        layer = new Layer(guid() + "-zlevel", zLevel, {
            width: this.getWidth(),
            height: this.getHeight(),
            left: 0,
            top: 0
        });
        this.insertLayer(zLevel, layer);
        this.__layer[zLevel] = layer;
    }
    return layer;
};

/**
 * 获取容器宽度
 * @returns {integer} 容器宽
 */
Painter.prototype.getWidth = function() {
    return this.width;
};

/**
 * 获取容器高度
 * @returns {integer} 容器高
 */
Painter.prototype.getHeight = function() {
    return this.height;
};

/**
 * 清楚当前绘图实例。
 * 该方法将清楚容器中所添加的canvas元素及其他任何DOM元素，如果要再次使用必须重新实例化
 */
Painter.prototype.clean = function() {
    this.width = null;
    this.height = null;

    //删除创建的canvas元素
    this.origindom.innerHTML = "";
    this.origindom = null;
};

/**
 * 清除画布中的内容，不会影响到其他事件或者内容
 */
Painter.prototype.cleanPainter = function() {
    this.__layer.forEach(la => la.clear());
};

/**
 * 改变当前容器的大小,该方法会导致整个ychart控制的容器的实际大小也对应改变
 * 实际实现是通过Layer模块实现
 * 该方法与room方法的不同的是该方法会改变容器即canvas的大小
 * @param {Number} width 目标宽度
 * @param {Number} height 目标高度
 */
Painter.prototype.resize = function(width, height) {
    this.__layer.forEach(la => {
        la.resize(width, height);
    });
    this.width = width;
    this.height = height;
    this.refresh();
};

/**
 * 在文档中插入指定的layer节点
 * @param zLevel {string} 绘图所在层级， 整数
 * @param layer {module::ychart/layer} Layer实例
 */
Painter.prototype.insertLayer = function(zLevel, layer) {
    var dom = layer.dom;
    if (this.__layer.length !== 0) {
        var children = this.container.getElementsByTagName("canvas");
        var i, len, child;
        for (i = 0, len = children.length; i < len; i++) {
            child = children[i];
            if (zLevel < parseInt(child.getAttribute("zLevel"))) {
                child.parentNode.insertBefore(dom, child);
                children = null;
                return;
            }
        }
    }
    this.container.appendChild(dom);
};

export default Painter;
