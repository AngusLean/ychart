/**
 * 全局事件分发程序，负责绑定事件到canvas元素上以及分发下去
 * @module ychart/Handler
 */

import eventUtil from "./tool/event";
import Draggable from "./core/graphic/mixin/draggable";
import HtmlView from "./core/graphic/htmlView";
import {DEFAULT_CONFIG} from "./core/config/config";

import {
    doc
} from "./tool/dom";
import {
    bind1Arg
} from "./tool/lang";


//所有捕获的事件名称
var ALL_EVENT_NAMES = ["click", "mousedown", "mousemove", "mouseup", "focus"];

//自定义的一些事件处理函数
var SPECIAL_EVENT_HANDLERS = {

    //上一个获取焦点的元素
    _lastHovered: null,

    //全局消息提示组件
    htmlView: null,

    //鼠标移动事件捕获及分发
    mousemove: function(exEvent) {

        var ev = exEvent, obj = exEvent.targetEle;
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

            //处理鼠标在元素上的消息提示
            if(obj.config.tip){
                if(!this.htmlView){
                    this.htmlView = new HtmlView({
                        left: exEvent.clientX+DEFAULT_CONFIG.tipoffsetX,
                        top: exEvent.clientY+DEFAULT_CONFIG.tipoffsetY
                    });
                }else{
                    this.htmlView.move(exEvent.clientX+DEFAULT_CONFIG.tipoffsetX,
                        exEvent.clientY+DEFAULT_CONFIG.tipoffsetY);
                }
                if(this._lastHovered != obj )
                    this.htmlView.info(obj.config.tip);
                this.htmlView.show();
            }else{
                this.htmlView && this.htmlView.hide();
            }
        } else {
            //默认样式
            this.root.style.cursor = this._DEFAULT_CURSOR;
            //隐藏消息提示
            this.htmlView && this.htmlView.hide();
        }
        this._lastHovered = obj;
    },

    mouseout: function(exEvent) {
        var ev = exEvent;
        if (this._lastHovered != null) {
            this.triggerProxy(this._lastHovered, "globalout", ev);
        }
        this._lastHovered = null;
        this.htmlView && this.htmlView.hide();
    }

};

//通用事件处理函数
var COMMON_EVENT_HANDLER = function(name) {
    return function(exEvent) {

        var ev = exEvent,obj = ev.targetEle;

        //某个形状处于焦点中并且可以捕获事件
        if (obj) {
            //分发该元素的获取焦点事件
            this.triggerProxy(obj, name, ev);
        }
    };
};

/**
 * @class
 * @classdesc 管理一个ychart实例的所有事件捕获及其分发
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
    this._handlers = {};

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

    ALL_EVENT_NAMES.forEach(eventName => {
        //具体的事件处理函数
        var eventHandler = SPECIAL_EVENT_HANDLERS[eventName] === undefined ? COMMON_EVENT_HANDLER(eventName) :
            SPECIAL_EVENT_HANDLERS[eventName];
        //绑定事件处理函数的作用域为handler类.
        this._handlers[eventName] = bind1Arg(event => {

            //获取自定义事件
            var exEvent = this.extendAndFixEventPackge(event);

            //调用事件处理函数
            eventHandler.call(this , exEvent);

            //拖动管理。 元素拖动相关的事件由这里面发出去。
            this._dragmanager.trigger(eventName ,exEvent);

        } , this);
        eventUtil.addHandler(this.root, eventName, this._handlers[eventName]);
    });
};

/**
 * 自定义事件对象
 * @param event {Event} 原始事件对象
 * @returns {exEvent}
 */
handlers.prototype.extendAndFixEventPackge = function(event) {
    //座标转换
    event = eventUtil.clientToLocal(this.root, event, event);

    //目标元素
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
    for (let i = shapes.length-1 ; i >=0; i--) {
        let sp = shapes[i];
        if (sp.contain(
                exEvent.ycX,
                exEvent.ycY
            )) {
            return sp;
        }
    }
    return null;
};

handlers.prototype.depose = function () {
    for(let event in this._handlers){
        eventUtil.removeHandler(this.root , event ,this._handlers[event]);
    }
};

export default handlers;
