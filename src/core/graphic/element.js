define(function (require) {
    "use strict";

    var util = require("../../tool/util");
    var guid = require("../../tool/guid");

    var Transform = require("./mixin/transform");
    var Eventful = require("./mixin/eventful");

    var Elements = function (opts) {
        
        //是否忽略当前元素
        this.ignore = opts.ignore || false;
        
        this.init();

        Transform.call(this, opts);
        Eventful.call(this);
    };
    
    //父元素。 在被添加到实例时设置
    Elements.prototype.parent = null;
    
    //元素的唯一ID
    Elements.prototype.id = null;
    
    //元素默认所在的层级
    Elements.prototype.zLevel = 0;

    //元素是否被忽略（不会计算样式，不会显示）
    Elements.prototype.ignore = false;

    //元素类型。 子类应该覆盖该属性
    Elements.prototype.type = "element";

    Elements.prototype.getId = function () {
        return this.id; 
    };

    Elements.prototype.getType = function () {
        return this.type;
    };

    //调用子类设置的type设置该元素的唯一ID
    Elements.prototype.init = function () { 
        this.id = this.type + "--" + guid();
    };


    util.ClassUtil.mixin(Elements, Transform, true);
    util.ClassUtil.mixin(Elements, Eventful, true);
    return Elements;
});
