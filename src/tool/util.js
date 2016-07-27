define(function (require) {
    "use strict";

    //确定属性是否只存在于原型中
    var hasPrototypeProperty = function(object ,name){
        return !object.hasOwnProperty(name) && (name in object);
    };

    function parseInt10(val) {
        return parseInt(val, 10);
    }

    var DomUtil = {
        getPosition: function (id) {
            var element = typeof id == "string" ? document.getElementById(id) : id;
            var st = document.defaultView.getComputedStyle(element);

            var rect = element.getBoundingClientRect();
            var scrollTop = document.documentElement.scrollTop ?
                document.documentElement.scrollTop : document.body.scrollTop;
            var scrollLeft = document.documentElement.scrollLeft ?
                document.documentElement.scrollLeft : document.body.scrollLeft;
            return {
                width: (element.clientWidth || parseInt10(st.width) || parseInt10(element.style.width) -
                        (parseInt10(st.paddingLeft) || 0)-
                            (parseInt10(st.paddingRight))) || 0 ,

                height:(element.clientHeight || parseInt10(st.height) || parseInt10(element.style.height) -
                        (parseInt10(st.paddingTop) || 0)-
                            (parseInt10(st.paddingBottom))) || 0 ,
                top: rect.top + scrollTop,
                left: rect.left + scrollLeft
            };
        }
    };

    var ClassUtil = {
        inherit: function (clazz, baseClazz) {
            var clazzPrototype = clazz.prototype;

            function F() {
            }

            F.prototype = baseClazz.prototype;
            clazz.prototype = new F();

            for (var prop in clazzPrototype) {
                clazz.prototype[prop] = clazzPrototype[prop];
            }
            clazz.constructor = clazz;
        },

        //组合两个类。 仅组合原型的属性
        mixin: function(target, source, overlay){
            source = "prototype" in source ? source.prototype : source;
            target = "prototype" in target ? target.prototype : target;
            _over(target, source ,overlay);
            function _over (target, source,  overlay){
                for(var ele in source){
                    if(source.hasOwnProperty(ele) &&
                       (overlay ? (source[ele] !== null) : (target[ele] === null))){
                           target[ele] = source[ele];
                       }
                }
                return target;
            }
        }
    };

    function checkNull(which) {
        return !which || typeof which == 'undefined' || which == 'null';
    }

    function mergeItem(target, source, key, overwrite) {
        if (source.hasOwnProperty(key) && !(source[key] == null)) {
            var targetProp = target[key];
            if (typeof targetProp == 'object') {
                // 如果需要递归覆盖，就递归调用merge
                merge(
                    target[key],
                    source[key],
                    overwrite
                );
            } else if (overwrite || !(key in target)) {
                // 否则只处理overwrite为true，或者在目标对象中没有此属性的情况
                target[key] = source[key];
            }
        }
    }


    /**
     * 合并源对象的属性到目标对象.
     * 该方法会直接更改目标对象
     * @memberOf module:zrender/tool/tool
     * @param {*} target 目标对象
     * @param {*} source 源对象
     * @param {boolean} overwrite 是否覆盖
     * @param {object} map 源对象到目标对象的属性名映射.
     *      映射名是target的属性名需要映射到souece的属性名
     */
    function merge(target, source, overwrite, map) {
        if(checkNull(target)){
            target = {};
        }
        if(!checkNull(map))
            replaceattr(source, map);

        for (var i in source) {
            mergeItem(target, source, i, overwrite);
        }

        return target;
    }

    /**
     * 用指定的map属性名映射替代目标对象的属性名. 仅仅改变属性的名称
     * 该方法会直接更改目标对象
     * @param {object} target    要被替换的对象
     * @param {object} map   对象属性名的映射
     */
    function replaceattr(target, map) {
        if (map && target) {
            for (var tg in target) {
                if (map.hasOwnProperty(tg) && (map[tg] != tg)) {
                    // 将target中的属性名替换为对应的映射后的名字
                    target[map[tg]] = target[tg];
                    target[tg] = null;
                } else {
                    // warn(" MergeItem source item '" + tg + "' not in map '"
                    // + map.constructor.name + "' or it's one name ");
                }
            }
        }
        return target;
    }

    function _isType(type){
        return function(ele){
            return !checkNull(ele) && Object.prototype.toString.call(ele) == "[object "+type+"]";
        };
    }
    
    function forEach(ele ,ctx , cb) {
        if(_isType("Array")(ele)){
            ele.forEach((function(item ,index ){
                cb.call(ctx ,item ,index);
            }));
        }else if(_isType("Object")(ele)){
            var it ,index=0;
            for(it in ele){
                if(ele.hasOwnProperty(it)){
                    cb.call(ctx, it, index++ );
                }
            }
        }
    }
    
    return {
        merge: merge,
        replaceattr: replaceattr,
        checkNull: checkNull,
        ClassUtil: ClassUtil,
        DomUtil: DomUtil,
        isType: _isType,
        isFunc: _isType("Function"),
        isObj: _isType("Object"),
        isArr: _isType("Array"),
        
        forEach : forEach
    };
});
