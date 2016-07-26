define(function(require) {
    "use strict";

    var util = require("./tool/util");
    var element = require("./base/element");

    var Group = function(opt) {

        this.children = [];

        util.merge(this, opt, false);
        element.call(this, opt);
    };

    Group.prototype.type = "group";

    Group.prototype.addChild = function(child) {
        if (child == this)
            return;
        child.parent = this;
        this.children.push(child);
        return this;
    };

    util.ClassUtil.inherit(Group, element);


    return Group;
});
