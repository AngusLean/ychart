define(function(require){
    "use strict";

    var baseShape = require("./dep/BaseShape");
    var util = require("../tool/util");
    var debugs = require("../tool/debug");

    var REQUIRED_CHILD = {
        type: "String",
        BuildPath: "Function"
    };

    /**
     * 形状的工厂类。所有形状只需要调用该方法并且传入相应的参数即可。
     * 可以覆盖形状所需的所有属性。 必须覆盖的见REQUIRED_CHILD
     * @param defaults
     * @returns {BaseShape}
     */
    function extend(defaults){
        if(debugs.open){
            for(var item in REQUIRED_CHILD){
                if(!util.isType(REQUIRED_CHILD[item])(defaults[item])){
                    debugs.debug("构造新形状出错，属性名称："+item+" 属性要求的类型： "
                        +REQUIRED_CHILD[item]+" 实际类型: "+(typeof defaults[item]));
                    debugs.printobj(defaults);
                    return null;
                }
            }
        }

        /**
         * 具体形状构造时的参数
         * @param opt
         */
        function sub(opt){

            if(util.isObj(defaults)){
                for(var attr in defaults){
                    this[attr] = defaults[attr];
                }
            }
            //由于基类的构造方法中有依赖于子类实现的数据，所以先设置子类的数据过后再调用父类的构造。
            baseShape.call(this ,opt);
        }

        util.ClassUtil.inherit(sub ,baseShape);

        return sub;
    }


    return {
        extend: extend
    };
});
