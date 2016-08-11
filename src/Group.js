import {ClassUtil, merge} from "./tool/util"
import element from "./core/graphic/Element"

var Group = function (opt) {

    this.children = [];

    merge(this, opt, false, null);
    element.call(this, opt);
};

Group.prototype.type = "group";

Group.prototype.addChild = function (child) {
    if (child == this)
        return;
    //子形状或者group的父类。 继承变换以及样式
    child.parent = this;

    this.children.push(child);
    return this;
};

ClassUtil.inherit(Group, element);


export default Group;
