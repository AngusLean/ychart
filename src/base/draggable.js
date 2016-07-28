/**
 * 元素可以拖动的实现.
 * 所有事件都由handler.js分发下来。 自定义的事件也是在里面定义
 */
define(function(require){
    "use strict";


    var Draggable = function(){
        this.on('mousedown', this._dragStart, this);
        this.on('mousemove', this._dragIng, this);
        this.on('mouseup', this._dragEndByUp, this);
        this.on('globalout', this._dragEndByOut, this);
    };


    Draggable.prototype = {
        constructor: Draggable,

        _dragDelay : 0,

        _lastClickTime: null,

        _dragStart : function (e) {
            var target = e.targetEle;
            this._lastClickTime = new Date();
            if(target){
                this._x = e.offsetX;
                this._y = e.offsetY;
                this._dragingTarget = target;
                // this.trigger(target,'dragStart',e.event);
            }
        },

        _dragIng : function(e){
            var draggingTarget = this._dragingTarget;
            var crt = new Date();
            crt = crt- this._lastClickTime;
            if (draggingTarget && crt >= this._dragDelay) {

                var x = e.offsetX;
                var y = e.offsetY;

                var dx = x - this._x;
                var dy = y - this._y;
                this._x = x;
                this._y = y;
                // draggingTarget.drift(dx, dy);
                console.log("拖动中..."+dx+" , "+dy);
                // this.trigger(draggingTarget, 'draging', e.event);
                
                //更新视图
                // this.__yh && this.__yh.update();
                
               /* var dropTarget = this.findHover(x, y, draggingTarget);
                var lastDropTarget = this._dropTarget;
                this._dropTarget = dropTarget;

                if (draggingTarget !== dropTarget) {
                    if (lastDropTarget && dropTarget !== lastDropTarget) {
                        this._dispatchProxy(lastDropTarget, 'dragleave', e.event);
                    }
                    if (dropTarget && dropTarget !== lastDropTarget) {
                        this._dispatchProxy(dropTarget, 'dragenter', e.event);
                    }
                }*/
            }
        },
        _dragEndByOut : function (e) {
            console.log("global out");
            this._dragEnd(e);
        },
        _dragEndByUp : function (e) {
            console.log("blur");
            this._dragEnd(e);
        },
        _dragEnd : function(e){
            console.log("拖动完成 "+e);
            var draggingTarget = this._draggingTarget;

/*
            if (draggingTarget) {

                draggingTarget.dragging = false;
            }

            this.trigger(draggingTarget, 'dragend', e.event);

            if (this._dropTarget) {
                this.trigger(this._dropTarget, 'drop', e.event);
            }
*/

            this._draggingTarget = null;
            this._dropTarget = null;
            this._x = 0,this._y =0;
        }
    };



    return Draggable;

});