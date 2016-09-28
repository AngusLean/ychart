/**
 * 元素容器类
 * @module ychart/Group
 */
import {merge} from "./tool/util"
import {mixin} from "./tool/klass"
import Transform from "./core/graphic/mixin/transform"
import Moveable from "./core/graphic/mixin/moveable.js"
import Element from "./core/graphic/element"

/**
 * @class
 * @classdesc 元素容器类。 该类可以包含任何继承于 {@link ./core/graphic/view} 的类
 */
class Group extends Element{
    constructor(options){
        super("group");

        this.children = [];

        merge(this, options, false, null);

        Transform.call(this);
    }

    /**
     * 添加一个子元素
     * @param child 子元素对象， 可以是shape中的任何元素或者自定义的元素
     * @returns {Group}
     */
    add(child) {
        if (child == this)
            return;
        this.children.forEach(ele => {
            if(child.id === ele.id){
                return this;
            }
        });
        //子形状或者group的父类。 继承变换以及样式
        child.parent = this;

        this.children.push(child);
        return this;
    };
}

mixin(Group ,Transform , true);
mixin(Group ,Moveable, true);


export default Group;
