

    import Storage from "./Storage"
    import Painter from "./Painter"
    import Handler from "./Handler"




    /**
     * 简单的基于Htmo5 canvas的绘图库， 使用MVC思想封装绘图代码，使得开发者可以很方便的使用本库
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
        this.storage = new Storage(this);
        //绘图具体操作类。 与storage交互
        this.painter = new Painter(this , this.storage);
        //事件相关操作
        this.handler = new Handler(this.domid, this.painter ,this.storage);
    };


    YCharts.prototype.clear = function() {
        this.painter.clean();
        this.storage.clean();
    };

    YCharts.prototype.add = function(el) {
        this.storage.addEle(el);
        return this;
    };

    YCharts.prototype.BrushAll = function() {
        this.painter.refresh();
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


    export default ycharts;
