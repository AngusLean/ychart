/**
 * 库的入口接口。 提供所有外部接口
 * @module ychart/index
 */
import ychart from "./Ycharts"
import Bezier from "./shape/Bezier"
import Circle from "./shape/Circle"
import Line from "./shape/Line"
import Rect from "./shape/Rect"
import Triangle from "./shape/Triangle"
import YText from "./shape/YText"
import Image from "./shape/Image"
import Group from "./Group"
import Animation from "./animation/animation"
import ShapeBuilder from "./core/viewBuilder"
import debugs from "./tool/debug"
import textUtil from "./core/graphic/helper/text.js"

ychart.shape = {Bezier ,Circle ,Line ,Rect ,Triangle ,YText,Image};

ychart.Group = Group;

ychart.version = 1.0;

ychart.Animation = Animation;

ychart.textutil = textUtil;

ychart.extendView = function (config) {
    //自定义视图时一定要校验是否传入全部必须的参数
    var isDebug = debugs.open;
    debugs.open = true;
    var customView = ShapeBuilder.baseContextViewExtend(config);
    debugs.open = isDebug;
    return customView;
}

/**
 * @todo  Group在变换时如何清楚已绘制的图形？
 * layer变换时如何清楚已绘制的图形？
 * 三者与元素的绘制能否统一？
 * painter,layer代码能够优化下，变量命令不规范？
 */

export default ychart

