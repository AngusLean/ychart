/**
 * 绘图元素类构造器
 * @module  ychart/graphic/viewBuilder
 */
import ContextView from "./graphic/contextView";
import { isType ,isFunc} from "../tool/util";
import debugs from "../tool/debug";

var REQUIRED_CHILD = {
    type: "String",
    BuildPath: "Function"
};


/**
 * @description 基本canvas视图类创建工厂， 调用该方法并且传入如下参数即创建了一个新的视图元素
 * @param {object} defaults 视图元素构造相关方法
 * @returns {BaseContextView} 视图元素类
 */
var baseContextViewExtend = function (defaults) {
    if (debugs.open) {
        for (var item in REQUIRED_CHILD) {
            if (!isType(REQUIRED_CHILD[item])(defaults[item])) {
                debugs.debug("构造新形状出错，属性名称：" + item + " 属性要求的类型： "
                    + REQUIRED_CHILD[item] + " 实际类型: " + (typeof defaults[item]));
                debugs.printobj(defaults);
                return null;
            }
        }
    }

    /**
     * @class
     * @classdesc ychart形状的构造类.
     */
    class BaseContextView extends ContextView {
        constructor(baseOption) {
            super(defaults.type, baseOption);
            if(isFunc(defaults["Init"])){
                defaults["Init"].call(this,baseOption);
            }
        }
        zoom(x, y){
            super.zoom(x , y);
        }
    }

    for(var prop in defaults){
        BaseContextView.prototype[prop] = defaults[prop];
    }

    return BaseContextView;
};

export default {
    baseContextViewExtend
};
