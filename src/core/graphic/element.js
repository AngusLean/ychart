/**
 * ychart库页面元素基类模块
 * @module ychart/core/graphic/element
 */
import guid from "../../tool/guid";

/**
 * @classdesc 基本元素类。 整个库的所有可以独立存在并且彼此区分的单元都继承此类已获取一个独立的ID
 * @class
 */
class Element {
    /**
     * @constructor
     * @param {String} type  元素类型. 该类型为element
     */
    constructor(type = "element") {
        this.type = type;
        this.id = this.type + "_" + guid();
    }

    /**
     * 获取元素id
     * @returns {string}  该元素的唯一ID
     */
    getId() {
        return this.id;
    }

}

export default Element;
