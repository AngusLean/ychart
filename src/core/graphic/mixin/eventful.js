/**
 * @module ychart/core/graphic/mixin
 */


/**
 * 事件分发Dispatch。用于页面上不同对象之间事件绑定及分发。
 * 与具体的事件无关系。 就是Reactor模式中的Dispatch
 * @class
 * @mixin
 */
var Eventful = function () {
    this._handlers = {};
};

/**
 * 绑定某个处理函数到某个事件上
 * @param event  事件名称
 * @param handler 处理函数
 * @param context 处理函数调用的上下文
 * @returns {Eventful}
 */
Eventful.prototype.on = function (event, handler, context) {
    var h = this._handlers;
    if (!h || !event || !handler) {
        return this;
    }

    if (!h[event]) {
        h[event] = [];
    }
    h[event].push({
        _h: handler,
        _one: false,
        _ctx: context || this  //调用回调的上下文
    });

    return this;
};

/**
 * 绑定某个处理函数到某个事件上.但是仅触发该事件一次。 trigger后删除。
 * @param event  事件名称
 * @param handler 处理函数
 * @param context 处理函数调用的上下文
 * @returns {Eventful}
 */
Eventful.prototype.once = function (event, handler, context) {
    var _h = this._handlers;

    if (!handler || !event) {
        return this;
    }

    if (!_h[event]) {
        _h[event] = [];
    }

    if (_h[event].indexOf(handler) >= 0) {
        return this;
    }

    _h[event].push({
        _h: handler,
        _one: true,
        _ctx: context || this  //调用回调的上下文
    });

    return this;
};

/**
 * 删除某个事件/某个事件的某个回调
 * @param event 事件。 未指定将删除所有事件及对应的回调
 * @param handler 回调  指定该值和事件，将删除该事件的该回调函数
 * @returns {Eventful}
 */
Eventful.prototype.remove = function (event, handler) {
    if (!event) {
        this._handlers = {};
        return this;
    }

    var hs = this._handlers[event];
    if (handler) {
        var i = 0;
        for (; i < hs.length; i++) {
            if (hs[i]._h === handler) {
                break;
            }
            hs.splice(i, 1);
        }
        if (hs && hs.length == 0) {
            delete this._handlers[event];
        }
    } else {
        delete this._handlers[event];
    }

    return this;
};

var arrySlice = Array.prototype.slice;

/**
 * 事件分发
 * @param eventName 事件名称
 * @returns {Eventful}
 */
Eventful.prototype.trigger = function (eventName) {
    var handles = this._handlers[eventName];
    if (handles) {
        var args = arguments;
        var argLen = args.length;

        if (argLen > 3) {
            args = arrySlice.call(args, 1);
        }
        //来自backbone的黑魔法,效率优化,看起来很厉害的样子
        handles.forEach(function (item, index, array) {
            switch (argLen) {
                case 1:
                    item._h.call(item._ctx);
                    break;
                case 2:
                    item._h.call(item._ctx, args[1]);
                    break;
                case 3:
                    item._h.call(item._ctx, args[1], args[2]);
                    break;
                default:
                    item._h.apply(item._ctx, args);
                    break
            }
            if (item._one) {
                array.splice(index, 1);
            }
        });
    }
    return this;
};


export default Eventful;
