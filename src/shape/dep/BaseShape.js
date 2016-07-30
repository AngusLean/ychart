define( function (require) {
    "use strict";

    var util = require("../../tool/util");
    var debugs = require("../../tool/debug");
    var text = require("../../tool/text");
    var Elements = require("../../base/element");
    var OptionProxy = require("./OptionProxy");

    var warn = debugs.warn;

    /**
     * 所有形状的基类。 定义了可以显示的图片的一系列属性
     * @param opts
     */
    var baseShape = function(opts) {
        
        this.configProxy  = new OptionProxy(opts);

        //是否忽略当前元素
        this.ignore = opts.ignore || false;
        
        //当前形状所属的层
        this.zLevel = opts.zLevel || 0;
        
        //是否可以拖动
        this.draggable = opts.draggable == undefined ? true : opts.draggable;
        
        //当前图像是否发生了变化. 该属性通常是由于运行期间改变了元素的属性设置为true
        this.__dirty = true;
        
        //绘图实例。 在被添加到ychart实例时设置
        this.__yh == null;
        
        Elements.call(this,opts);
    };

    baseShape.prototype.type = "baseshape";
    
    /**
    *  如果某个形状设置了变换的话这就不满足要求。 目前实现仅仅满足使用直觉座标系时
    *  todo 更改绘制文字时变换的控制。当前实现过于丑陋
    * @param ctx
    * @param config
    * @constructor
    */
    baseShape.prototype.DrawText = function (ctx, config) {
        if(util.checkNull(config.text)){
            return;
        }

        var beginpt = this.GetContainRect();

        var x = beginpt[0][0];
        var y=beginpt[0][1];
        var height = beginpt[2][1] - beginpt[0][1];
        y = y + height/2;

        ctx.save();
        var st = this.configProxy.getStyle();
        //文字颜色
        if(!util.checkNull(st.textColor)){
            ctx.fillStyle = st.textColor;
        }

        //文字的变换与图形不一样，默认情况下就是正向的，特别处理
        this.updateTransform();
        var m = this.transform;
        ctx.setTransform(m[0], m[1] ,m[2] ,-m[3] ,m[4] ,m[5]);

        text.fillText(ctx, config.text, x, m[5]-y, st.font,
                     st.textAlign, st.textBaseline);

        ctx.restore();
    };

    baseShape.prototype.BeforeBrush = function (ctx) {
        ctx.save();

        this.SetShapeTransform(ctx);

        this.configProxy.bindContext(ctx);
    };

    baseShape.prototype.SetShapeTransform = function (ctx) {
        this.updateTransform();
        this.setTransform(ctx);
    };
    
    baseShape.prototype.AfterBrush = function (ctx) {
        var tp = this.configProxy.getBrushType();
        switch (tp) {
        case "both":
        case "all":
            ctx.fill();
            ctx.stroke();
            break;
        case "stroke":
            ctx.stroke();
            break;
        case "fill":
            ctx.fill();
            break;
        case "none":
            break;
        default :
            ctx.fill();
        break;
        }
        ctx.restore();
    };

    /**
    * 绘制图形关键函数. 添加的图形必须覆盖方法,
    * @param ctx
    * @param style
    * @returns {*}
    * @constructor
    */
    baseShape.prototype.BuildPath = function (ctx, config) {
        //设置合适的填充方法
        warn(" unsurported operation -- can't build shape path");
    };

    /**
    * 刷新图形
    * @param ctx
    * @constructor
    */
    baseShape.prototype.Brush = function (ctx) {
        var config = this.configProxy.getConfig();
        if(!config.ignore){
            //设置样式
            this.BeforeBrush(ctx, config);
            //具体图形自己的定制
            this.BuildPath(ctx, config);
            this.DrawText(ctx,config);
            //恢复事故现场
            this.AfterBrush(ctx, config);
        }
    };

    baseShape.prototype.setOption = function (option) {
        this.configProxy.update(option);
        this.__dirty = true;
    };


    var isPtInPath = require("./shapeutil").isPtInPath;
    
    baseShape.prototype.contain = function(point){
        // var local = this.transformCoordToLocal(point.x , point.y);
        var local = [point.x ,point.y];
        return isPtInPath(this , this.configProxy.getConfig() , local[0] ,local[1]);
    };
    
    baseShape.prototype.drift = function (dx, dy) {
        if(!util.isArr(this.position)){
            this.position = [0,0];
        }

        this.position[0] += dx;
        this.position[1] += dy;
        
        this.__dirty = true;
    };
    

    util.ClassUtil.inherit(baseShape, Elements ,true);
    
    return baseShape;
});
