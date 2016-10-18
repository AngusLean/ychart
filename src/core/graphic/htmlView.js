/**
 * 独立的HTML元素模块，通常用于某个元素的信息展示
 * @module ychart/core/graphic/htmlVIew
 */

import View from "./view"
import {
    createDOM
} from "../../tool/dom"

class DomContent {
    constructor(config) {
        this.root = createDOM(config.id, "div", "htmlView", config.width,
            config.height, config.left, config.top);
    }
}


/**
 * @classdesc 绘制在HTML结构上的视图类，该类与contextView互不影响，但是通常用于
 * ContextView的数据展示
 * @class
 */
class HtmlView extends View {
    constructor(type = "HtmlView", option = {}) {

        /**
         * 当前元素的实际DOM引用
         * @member {HTMLDOMElement}
         */
        this.dom = null;
    }

    /**
     * 显示当前HtmlView
     * @method
     */
    show() {
        this.dom.style.visibility = "visible";
    }

    /**
     * 隐藏当前HtmlVIew
     * @method
     */
    hide() {
        this.dom.style.display = "hidden";
    }
}
