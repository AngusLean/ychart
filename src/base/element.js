define(function (require) {
    "use strict";

    var util = require("../tool/util");
    var guid = require("../tool/guid");

    var Transform = require("./transform");
    var Eventful = require("./eventful");
    var Draggable = require("./draggable");

    var Elements = function (opts) {

        //元素的唯一ID 
        this.id = null;

        //父元素。 在被添加到实例时设置
        this.parent = null;

        this.init();

        Transform.call(this, opts);
        Eventful.call(this);
        // Draggable.call(this);
    };

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
    // util.ClassUtil.mixin(Elements, Draggable, true);
    return Elements;
});
