define(function(require) {
    "use strict";

    var util = require("./tool/util");
    var element = require("./core/graphic/Element");

    var Group = function(opt) {

        this.children = [];

        util.merge(this, opt, false);
        element.call(this, opt);
    };

    Group.prototype.type = "group";

    Group.prototype.addChild = function(child) {
        if (child == this)
            return;
        //子形状或者group的父类。 继承变换以及样式
        child.parent = this;
        //设置子形状或者group的YH实例。 但此处很可能为空，有可能group在被添加到ychart实例之前添加。
        child.__yh = this.__yh;

        this.children.push(child);
        return this;
    };

    util.ClassUtil.inherit(Group, element);


    return Group;
});
