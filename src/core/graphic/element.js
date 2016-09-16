/**
 * ychart库页面元素基类模块
 * @module ychart/core/graphic/element
 */
import guid from "../../tool/guid"

/**
 * 基本元素类。 整个库的所有可以独立存在并且彼此区分的单元都继承此类已获取一个独立的ID
 * @class
 */
class Element{
    constructor(type){
        this.type = type;
        this.id =  this.type+"--"+guid();
    }

    /**
     * 获取元素id
     * @returns {string}  该元素的唯一ID
     */
    get id(){
        return this.id
    }
    set id(val){
        throw new Error("can't change element id . the id is :"+this.id);
    }
}

export default Element
