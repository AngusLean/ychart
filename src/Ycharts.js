define(function(require) {
    "use strict";
    var util = require("./tool/util");
    var Storage = require("./Storage");
    var Painter = require("./Painter");
    var Handler = require("./Handler");
    var Group = require("./Group");
    
    var doc = function (eleid) {
        return document.getElementById(eleid);
    };
    
    function getContext(id) {
        var drawing = doc(id);
        if (drawing && drawing.getContext) {
            return drawing.getContext("2d");
        }
        return null;
    }


    /**
     * 简单的基于Html5 canvas的绘图库， 使用MVC思想封装绘图代码，使得开发者可以很方便的使用本库
     * 封装的canvas API绘图。
     * @param eleid  放置canvas的容器。 不能是canvas元素， 必须设置宽度和高度
     * @param opt
     * @constructor
     */
    var YCharts = function(eleid, opt) {
        //当前实例ID
        this.id = null;
        //当前实例绑定的页面元素ID
        this.domid = eleid;

        //存储所有绘图相关组件。
        this.__storage = new Storage(this);
        //绘图具体操作类。 与storage交互
        this.__painter = new Painter(this , this.__storage);
        //事件相关操作
        this.__handler = new Handler(doc(this.domid), this.__painter ,this.__storage);
    };


    YCharts.prototype.clear = function() {
        this.__painter.clean();
        this.__storage.clean();
    };

    YCharts.prototype.add = function(el) {
        this.__storage.addEle(el);
        return this;
    };

    YCharts.prototype.BrushAll = function() {
        this.__painter.refresh();
        return this;
    };
    
    YCharts.prototype.update = function() {
        this.BrushAll();
    };

    YCharts.prototype.setId = function(id) {
        this.id = id;
    };



    var ycharts = {};
    var instances = {};
    var i = 1000;

    /**
     * ycharts外部访问接口。 用于统一管理所有用到的ycharts实例
     * @param id  容器ID
     * @param config 相关配置
     * @returns {YCharts}
     */
    ycharts.init = function(id, config) {
        var _charts = new YCharts(id, config);
        _charts.setId("ycharts-"+i++);
        instances[id] = _charts;
        return _charts;
    };

    ycharts.depose = function (id) {
        if(instances[id]){
            instances[id].clean();
            instances[id] = null;
        }
    };


    return ycharts;
});
