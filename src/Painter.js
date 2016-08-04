define(function(require){
    "use strict";

    var Layer = require("./Layer");
    var guid = require("./tool/guid");
    var util = require("./tool/util");

    /**
     * 绘图组件。
     * 该组件控制所有元素绘制相关的处理，包括各个元素之间的层级关系、属性继承等
     * 具体绘制的层在Layer模块中
     * @param ych
     * @constructor
     */
    var Painter = function(ych ,storage){
        this._storage = storage;
        this.container = document.getElementById(ych.domid);
        var temp = util.DomUtil.getPosition(this.container);
        this.width = temp.width;
        this.height = temp.height;
        this.left = temp.left;
        this.top = temp.top;
        temp = null;
      
        this.layer =  [];
    };

    Painter.prototype.refresh = function(){
        var shapeList = this._storage.getDisplayableShapeList();

        this.updateLayerState(shapeList);

        var i,shape,layer,zlevel ,lastZlevel=-1;
        for(i=0 ;i<shapeList.length ;i++){
            shape = shapeList[i];
            zlevel = shape.zLevel || 0;
            layer = this.getLayer(zlevel);
            
            //有改变的元素所在的layer需要清除画布过后重新绘制
            if(zlevel != lastZlevel && layer.__needClear){
                layer.clear();
                lastZlevel = zlevel;
                layer.__needClear = false;

                this.preProcessShapeInLayer(shape, layer);

                shape.Brush(layer.getContext());

                this.afterProcessShapeInLayer(shape ,layer);
            }
        }
    };

    /**
     * 更新layer状态。 计算哪些层需要清除
     * @param shapeList
     */
    Painter.prototype.updateLayerState = function (shapeList) {
        var i ,layer,zlevel ,shape;
        for(i=0 ;i<shapeList.length ;i++){
            shape = shapeList[i];
            zlevel = shape.zLevel;
            layer = this.getLayer(zlevel);
            //已经设置过
            if(layer.__needClear){
                continue;
            }
            //如果图像为脏，则需要清除当前画布
            layer.__needClear = shape.__dirty;
        }
    };


    var Group = require("./Group");

    /**
     * 处理当前形状的层次结构,把当前形状的父元素与绘图层Layer关联起来
     * @param shape
     * @param layer
     */
    Painter.prototype.preProcessShapeInLayer = function(shape ,layer){

        var _preProcessShapeInLayer = function(_shape){
            if(util.checkNull(_shape.parent)){
                _shape.parent = layer;
            }else if(_shape.parent instanceof Group){
                _groupPreProcess(_shape.parent ,layer);
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
        var _groupPreProcess = function (gp ,ly) {
            //第一个是最高级别的group,后面的都是它的子group
            var groupquene = [];
            var _buildGroupQuene = function (_group) {
                if(_group instanceof Group){
                    groupquene.unshift(_group);
                }
                if(_group.parent instanceof Group){
                    _buildGroupQuene(_group.parent);
                }
            };
            _buildGroupQuene(gp);
            var before;
            groupquene.forEach(function (item, index) {
                if(index === 0){
                    item.parent = ly;
                } else{
                    item.parent = before;
                }
                before = item;
                //更新组的变换
                item.updateTransform();
            });
        };


        _preProcessShapeInLayer(shape);
    };

    Painter.prototype.afterProcessShapeInLayer = function (shape ,layer) {
        shape.__dirty = false;
    };
    
    Painter.prototype.getLayer = function(zLevel){
        var layer = this.layer[zLevel];
        if(!layer){
            layer = new Layer(guid()+"-zlevel",zLevel ,{
                width: this.getWidth(),
                height: this.getHeight(),
                left: this.left,
                top: this.top
            });
            this.insertLayer(zLevel , layer);
            this.layer[zLevel] = layer;
        }

        return layer;
    };

    Painter.prototype.getWidth = function(){
        return this.width;
    };

    Painter.prototype.getHeight = function(){
        return this.height;
    };

    Painter.prototype.clean = function(){
        this.width = null;
        this.height = null;
        //删除创建的canvas元素
        this.container.innerHTML = "";
        this.container = null;
    };

    /**
     * 在文档中插入指定的layer节点
     */
    Painter.prototype.insertLayer = function(zLevel ,layer){
        var dom = layer.dom;
        if(this.layer.length != 0){
            var children = this.container.getElementsByTagName("canvas");
            var i,len ,child;
            for(i=0 ,len = children.length ; i<len ;i++){
                child = children[i];
                if(zLevel < parseInt(child.getAttribute("zLevel"))){
                    child.parentNode.insertBefore(dom , child);
                    children = null;
                    return;
                }
            }
        }
        this.container.appendChild(dom);
    };

    return Painter;
});
