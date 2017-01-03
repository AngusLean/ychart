/**
 * 绘图元素类构造器
 * @module  ychart/graphic/viewBuilder
 */
import ContextView from "./graphic/contextView";
import { isType ,isFunc} from "../tool/util";
import debugs from "../tool/debug";
import {DEFAULT_CONFIG} from "./config/config";

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

        setDefaultConfig(config){
            //设置全局ychart属性
            this.__yh = config.yh;
            if(DEFAULT_CONFIG.coordinateSystem == "Cartesian")
                //设置笛卡尔坐标系
                this._setDefaultTrasformToCartesian(config.yh.getHeight());
        }

        /* eslint-disable*/
        BuildPath(ctx , config){
            throw new Error(" unsurported operation -- can't build shape path");
        }
        /* eslint-enable */

        /**
         * 设置当前元素的默认坐标系为直角坐标系. 该方法应该在刷新之前调用并且仅仅调用一次.
         * 由于变换要在元素知道被添加到某个具体的 @see{CanvasRenderingContext2D} 的时候
         * 才可以.
         * @private
         * @param position  距离变换
         * @param scale  缩放及方向变换
         */
        _setDefaultTrasformToCartesian(height){
            return
            this.position = [0 , height];
            this.scale = [1,-1];
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
