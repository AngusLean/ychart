/**
 * 全局事件处理程序，负责绑定事件到canvas元素上以及分发下去
 */
define(function(require){
    "use strict";
    
    
    var eventUtil = require("./tool/event");
   

    var bind = function(fn ,ctx){
        return function(){
            return fn.apply(ctx ,arguments);
        };
    };

    function bind1Arg(handler ,context) {
        return function (arg1) {
            return handler.call(context, arg1);
        };
    }
    
    function bind2Arg(handler ,context) {
        return function (arg1, arg2) {
            return handler.call(context, arg1, arg2);
        };
    }
    //临时变量
    var ev ,obj;

    //所有的事件名称
    var ALL_HANDLER_NAMES = ["click", "mousedown" ,"mousemove" , "mouseup" ,"focus"];

    //自定义的一些事件处理函数
    var DEFAULT_HANDLERS = {

        //上一个获取焦点的元素
        _lastHovered : null,

        //鼠标移动事件捕获及分发
        mousemove : function (event) {
            ev = eventUtil.getEvent(event);
            ev = eventUtil.clientToLocal(this.root ,ev ,ev);
            obj = this.getHoverElement(ev);
            //判断和之前获取焦点的是否是同一个形状
            if(this._lastHovered != null && this._lastHovered != obj){
                this.triggerProxy(this._lastHovered , "blur" ,ev);
            }
            //某个形状处于焦点中
            if(obj){
                //设置处于焦点时的样式
                this.root.style.cursor = this._DEFAULT_FOCUS_CURSOR;
                //分发该元素的鼠标移动事件
                this.triggerProxy(obj ,"mousemove" ,ev);
                
            }else{
                //默认样式
                this.root.style.cursor = this._DEFAULT_CURSOR;
            }
            this._lastHovered = obj;
        },

        mouseout: function (event) {
            ev = eventUtil.getEvent(event);
            ev = eventUtil.clientToLocal(this.root ,ev ,ev);
            obj = this.getHoverElement(ev);
            if(this._lastHovered != null){
                this.triggerProxy(this._lastHovered ,"globalout" ,ev);
            }
        }

    };

    var extendEventPackge = function(object ,event){
        //目标形状
        event.targetEle = object;
        return event;
    };

    var handlers = function(root ,painter ,storage){

        //实际事件响应容器
        this.root = root;
        //存储器
        this._storage = storage ;
        //绘图器
        this._painter = painter;
        //事件处理程序
        this._handlers = [];

        this._DEFAULT_FOCUS_CURSOR = "pointer";
        this._DEFAULT_CURSOR = "default";
        this.initHandlers();
    };

    /**
     * 初始化事件处理程序及绑定事件。
     * this._handlers保存着所有的事件处理函数
     */
    handlers.prototype.initHandlers = function(){

        var defaultEventProcess  =  function (name) {
            return function (event) {
                ev = eventUtil.getEvent(event);
                ev = eventUtil.clientToLocal(this.root ,ev ,ev);
                obj = this.getHoverElement(ev);

                //某个形状处于焦点中
                if(obj){

                    //分发该元素的获取焦点事件
                    this.triggerProxy(obj ,name ,ev);

                    //todo 此处效率很低
                    this._painter.refresh();
                }
            };
        };

        var _this = this;
        ALL_HANDLER_NAMES.forEach(function (item, index) {
            //设置所有的事件处理函数
            _this._handlers[item] = bind1Arg(
                //如果没有提供事件处理函数，则使用上面定义的默认处理函数
                (DEFAULT_HANDLERS[item] === undefined ? defaultEventProcess(item)
                    : DEFAULT_HANDLERS[item])
            ,_this);
            eventUtil.addHandler(_this.root , item , _this._handlers[item]);
        });

    };


    /**
     * 事件分发。
     * @param element  某个元素
     * @param eventName  事件名称
     * @param event  事件对象
     */
    handlers.prototype.triggerProxy = function(element, eventName ,event){
        element.trigger && element.trigger(eventName, extendEventPackge(element , event));
    };

    /**
     * 获取当前鼠标所在位置覆盖的最上层元素
     * @param event  包含有ycX和ycY属性的事件对象
     */
    handlers.prototype.getHoverElement = function(exEvent){
        var shapes = this._storage.getDisplayableShapeList();
        var sp;
        for(var i=0 ,len = shapes.length ; i<len ;i++){
            sp = shapes[i];
            if(sp.contain({
                x : exEvent.ycX,
                y : exEvent.ycY
            })){
                return sp;
            }
        }
        return null;
    };


    return handlers;
});
