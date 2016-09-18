/**
 * 全局事件处理程序，负责绑定事件到canvas元素上以及分发下去
 * @module ychart/Handler
 */


import eventUtil from "./tool/event"
import {
    doc
} from "./tool/dom"
import Draggable from "./core/graphic/mixin/draggable"

function bind1Arg(handler, context) {
    return function(arg1) {
        return handler.call(context, arg1);
    };
}

//临时变量
var ev, obj;

//所有的事件名称
var ALL_HANDLER_NAMES = ["click", "mousedown", "mousemove", "mouseup", "focus"];

//自定义的一些事件处理函数
var DEFAULT_HANDLERS = {

    //上一个获取焦点的元素
    _lastHovered: null,

    //鼠标移动事件捕获及分发
    mousemove: function(exEvent) {

        ev = exEvent, obj = exEvent.targetEle;
        //判断和之前获取焦点的是否是同一个形状
        if (this._lastHovered != null && this._lastHovered != obj) {
            this.triggerProxy(this._lastHovered, "blur", ev);
        }
        //某个形状处于焦点中
        if (obj) {

            //设置处于焦点时的样式
            this.root.style.cursor = this._DEFAULT_FOCUS_CURSOR;
            //分发该元素的鼠标移动事件
            this.triggerProxy(obj, "mousemove", ev);
        } else {
            //默认样式
            this.root.style.cursor = this._DEFAULT_CURSOR;
        }
        this._lastHovered = obj;
    },

    mouseout: function(exEvent) {
        ev = exEvent, obj = ev.targetEle;
        if (this._lastHovered != null) {
            this.triggerProxy(this._lastHovered, "globalout", ev);
        }
    }
};

/**
 * @class
 * @classdesc 事件reactor ,管理一个ychart实例的所有事件捕获及其分发
 * @param root {HTMLElement}  实际容器ID
 * @param painter {module:ychart/painter} 绘图器实例
 * @param storage {module:ychart/storage} 存储器实例
 */
var handlers = function(root, painter, storage) {
    //存储器
    this.__storage = storage;

    //绘图器
    this.__painter = painter;

    //实际事件响应容器
    this.root = doc(root);

    //事件处理程序
    this._handlers = [];

    //拖动管理。 只需要调用它的事件分发函数即可
    this._dragmanager = new Draggable();

    this._DEFAULT_FOCUS_CURSOR = "pointer";
    this._DEFAULT_CURSOR = "default";
    this.initHandlers();
};


/**
 * 初始化事件处理程序及绑定事件。
 * this._handlers保存着所有的事件处理函数
 */
handlers.prototype.initHandlers = function() {

    var defaultEventProcess = function(name) {
        return function(exEvent) {
            ev = exEvent;
            obj = ev.targetEle;

            //某个形状处于焦点中并且可以捕获事件
            if (obj) {
                //分发该元素的获取焦点事件
                this.triggerProxy(obj, name, ev);
            }
        };
    };

    var _this = this,
        exEvent;
    ALL_HANDLER_NAMES.forEach(function(item) {
        var eventHandler = DEFAULT_HANDLERS[item] === undefined ? defaultEventProcess(item) :
            DEFAULT_HANDLERS[item];
        //设置所有的事件处理函数
        _this._handlers[item] = eventHandler;
        eventUtil.addHandler(_this.root, item, bind1Arg(function(event) {

            exEvent = this.extendAndFixEventPackge(event);

            //转发标准事件到元素。
            this._handlers[item].call(_this, exEvent);
            //拖动管理。 元素拖动相关的事件由这里面发出去。
            this._dragmanager.trigger(item, exEvent);
        }, _this));
    });

};

/**
 * 自定义事件对象
 * @param event {Event} 原始事件对象
 * @returns {exEvent}
 */
handlers.prototype.extendAndFixEventPackge = function(event) {
    event = eventUtil.clientToLocal(this.root, event, event);
    //目标形状
    event.targetEle = this.getHoverElement(event);
    return event;
};

/**
 * 事件分发代理器。 该方法会把事件分发到某个元素中，然后由元素自身分发到注册的事件处理函数并且调用。
 * @param element {module:ychart/core/graphic/element}  响应事件的元素
 * @param eventName {string}  事件名称
 * @param exEvent  {exEvent} 扩充的事件对象
 */
handlers.prototype.triggerProxy = function(element, eventName, exEvent) {
    element.trigger && element.trigger(eventName, exEvent, element.config);
};

/**
 * 获取当前鼠标所在位置覆盖的最上层元素
 * @param exEvent  {exEvent} 扩充的自定义事件对象
 * @return {module:ychart/core/graphic/element || null} 元素对象或者null
 */
handlers.prototype.getHoverElement = function(exEvent) {
    var shapes = this.__storage.getDisplayableShapeList();
    var sp;
    for (var i = 0, len = shapes.length; i < len; i++) {
        sp = shapes[i];
        if (sp.getable && sp.contain(
                exEvent.ycX,
                exEvent.ycY
            )) {
            return sp;
        }
    }
    return null;
};


export default handlers;
