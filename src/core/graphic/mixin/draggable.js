/**
 * @module ychart/core/graphic/mixin
 */


import Eventful from "./eventful";
import {mixin} from "../../../tool/klass";
import {DEFAULT_CONFIG} from "../../config/config"

var target;

/**
 * 拖动的实现类。 由于该类仅需要一个实例，所以没有做成混合类
 * @class
 * @constructor
 */
var Draggable = function () {
    Eventful.call(this);

    this.on("mousedown", this._dragStart, this);
    this.on("mousemove", this._dragIng, this);
    this.on("mouseup", this._dragEnd, this);
    this.on("globalout", this._dragEnd, this);
};


Draggable.prototype = {
    constructor: Draggable,

    _dragDelay: 100,

    _lastClickTime: null,

    /**
     * 开始拖动
     * @param {event} exEvent  加入了自定义项的扩展事件对象
     * @private
     */
    _dragStart: function (exEvent) {
        target = exEvent.targetEle;
        this._lastClickTime = new Date();
        if (target) {
            this._x = exEvent.offsetX;
            this._y = exEvent.offsetY;
            this._dragingTarget = target;
            this.trigger(target, "dragStart", exEvent);
        }
    },

    /**
     * 拖动中
     * @param {event} exEvent  加入了自定义项的扩展事件对象
     * @private
     */
    _dragIng: function (exEvent) {
        var ele = exEvent.targetEle;
        target = this._dragingTarget;
        var crt = new Date();
        crt = crt - this._lastClickTime;
        if(ele){
            if(ele.draggable)
                exEvent.target.style.cursor = DEFAULT_CONFIG.cursor_moveable;
            else
                exEvent.target.style.cursor = DEFAULT_CONFIG.cursor_getable;
        }else{
            exEvent.target.style.cursor = DEFAULT_CONFIG.cursor_default;
        }

        if (target && target.draggable && crt >= this._dragDelay) {

            var x = exEvent.offsetX;
            var y = exEvent.offsetY;

            var dx = x - this._x;
            var dy = y - this._y;
            this._x = x;
            this._y = y;
            target.drift(dx, -dy);
            this.trigger(target, "draging", exEvent);
            // 更新视图
            target.RebrushAll();
        }
    },

    /**
     * 拖动完成
     * @param {event} exEvent  加入了自定义项的扩展事件对象
     * @private
     */
    _dragEnd: function (exEvent) {
        exEvent.target.style.cursor =DEFAULT_CONFIG.cursor_default;
        target = this._dragingTarget;
        if (target) {
            target.dragging = false;
            this.trigger(target, "dragend", exEvent);
        }

        this._dragingTarget = null;
    }
};


mixin(Draggable, Eventful, true);

export default Draggable;
