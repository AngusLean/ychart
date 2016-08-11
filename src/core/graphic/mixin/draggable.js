/**
 * 元素可以拖动的实现.
 * 所有事件都由handler.js分发下来。 自定义的事件也是在里面定义
 */


import EventUtil from "./eventful"
import {ClassUtil} from "../../../tool/util"

var target;
var Draggable = function () {
    EventUtil.call(this);

    this.on('mousedown', this._dragStart, this);
    this.on('mousemove', this._dragIng, this);
    this.on('mouseup', this._dragEnd, this);
    this.on('globalout', this._dragEnd, this);
};


Draggable.prototype = {
    constructor: Draggable,

    _dragDelay: 100,

    _lastClickTime: null,

    _dragStart: function (exEvent) {
        target = exEvent.targetEle;
        this._lastClickTime = new Date();
        if (target) {
            this._x = exEvent.offsetX;
            this._y = exEvent.offsetY;
            this._dragingTarget = target;
            this.trigger(target, 'dragStart', exEvent);
        }
    },

    _dragIng: function (exEvent) {
        target = this._dragingTarget;
        var crt = new Date();
        crt = crt - this._lastClickTime;
        if (target && target.draggable && crt >= this._dragDelay) {
            // exEvent.target.style.cursor = "move";
            var x = exEvent.offsetX;
            var y = exEvent.offsetY;

            var dx = x - this._x;
            var dy = y - this._y;
            this._x = x;
            this._y = y;
            target.drift(dx, -dy);
            this.trigger(target, 'draging', exEvent);
            //更新视图
            target.__yh && target.__yh.update();
        }
    },
    _dragEnd: function (exEvent) {
        // exEvent.target.style.cursor = "default";
        target = this._dragingTarget;
        if (target) {
            target.dragging = false;
            this.trigger(target, 'dragend', exEvent);
        }

        this._dragingTarget = null;
    }
};


ClassUtil.mixin(Draggable, EventUtil, true);

export default Draggable;
