define(function(require){
    "use strict";

    var util = require("./tool/util");
    function getContext(drawing) {
        if (drawing && drawing.getContext) {
            return drawing.getContext("2d");
        }
        return null;
    }

    function createDOM(id, type,width ,height ,left, top){
        var newdom = document.createElement(type);

        var st = newdom.style;
        st.position = "absolute";
        st.left = left;
        st.top = top;
        st.width = width+"px";
        st.height = height+"px";
        newdom.width = width;
        newdom.height = height;
        newdom.setAttribute("ychart-layer",id);
        return newdom;
    }

    /**
     * 一个绘图层。 对应DOM上一个canvas元素。
     * 每一个layer都有自己独立和样式。 不同layer之间的前后关系由Storage模块处理。 layer的具体绘制由
     * Painter处理
     * @param id
     * @param opts
     * @constructor
     */
    var Layer = function(id, opts){
        this.id = id;
        this.dom = document.getElementById(id);
        if(util.checkNull(this.dom)){
            this.dom = createDOM(id, "canvas" ,opts.width ,opts.height ,opts.left || 0 ,opts.top || 0);
        }
        this.ctx = getContext(this.dom);
        if (util.checkNull(this.ctx)) {
            alert("浏览器不支持HTML5 canvas绘图,请更新浏览器 " + this.ctx);
            return;
        }
        
        //画布大小
        this.ctxWidth = this.ctx.canvas.width;
        this.ctxHeight = this.ctx.canvas.height;
        
        //默认变换。即已当前层的左下角为原点的直角座标系
        this.transform = [1,0,0,-1,0,this.ctxHeight];

        //当前画布由于包含的图形有变化需要清除后重新绘制
        this.__needClear = false;
    };

    /**
     * 获取当前绘图层的上下文
     * @returns {context}
     */
    Layer.prototype.getContext = function(){
        return this.ctx;
    };

    /**
     * 清除当前layer
     * @returns {*}
     */
    Layer.prototype.clear = function(){
        this.ctx.clearRect(0 , 0 , this.ctxWidth , this.ctxHeight);
    };

    return Layer;
});
