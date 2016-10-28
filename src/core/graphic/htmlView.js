/**
 * 独立的HTML元素模块，通常用于某个元素的信息展示
 * @module ychart/core/graphic/htmlVIew
 */

import View from "./view";
import {
    createDOM
} from "../../tool/dom";

/**
 * @private
 */
class DomContent{
    constructor(config) {
        this._root = createDOM(config.id, "div", "htmlView", config.width,
            config.height, null , {left: config.left , top: config.top});

        this._content = document.createElement("div");

        this.init(config);
    }

    init(config){
        this._root.style.border = "solid 1px #efefef"; this._root.style.backgroundColor = "white";
        this._root.style.padding = "5px";

        if(config.title) this._root.appendChild(this.title);
        this._root.appendChild(this._content);
        if(config.footer) this._root.appendChild(this.footer);
        document.body && document.body.appendChild(this._root);
    }

    get title(){
        return document.createElement("div");
    }
    get content(){
        return this._content.innerHTML;
    }
    set content(html){
        this._content.innerHTML = html;
    }
    get footer(){
        return document.createElement("div");
    }
    show(){
        this.root.style.visibility = "visible";
    }
    hide(){
        this.root.style.visibility = "hidden";
    }
    move(x,y){
        this.root.style.left = x+"px";
        this.root.style.top = y+"px";

    }
}


/**
 * @classdesc 绘制在HTML结构上的视图类，该类与contextView互不影响，但是通常用于
 * ContextView的数据展示
 * @class
 */
export default class HtmlView extends View {
    constructor( option = {}) {
        super("HtmlView",option);

        /**
         * 当前元素DOM结构引用
         * @member {HTMLDOMElement}
         */
        this._domcontent = new DomContent({
            id: this.id+"Parent",
            width: option.width || 0,
            height: option.height || 0,
            left: option.left || 0,
            top: option.top || 0
        });
    }

    /**
     * 显示当前HtmlView
     * @method
     */
    show() {
        this._domcontent.show();
    }

    /**
     * 设置提示框的HTML内容
     * @param info {HTMLString} HTML字符串
     */
    info(info){
        this._domcontent.content = info;
    }

    /**
     * 隐藏当前HtmlVIew
     * @method
     */
    hide() {
        this._domcontent.hide();
    }

    /**
     * 移动当前提示框
     * @param x {number} 目标X座标 绝对定位
     * @param y {number}  目标Y座标 绝对定位
     */
    move(x , y){
        this._domcontent.move(x , y);
    }
}
