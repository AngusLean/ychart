/**
 *@module ychart/tool/util
 */

/**
 * 确定属性是否只存在于原型中
 * @function
 * @param object
 * @param name
 * @returns {boolean}
 */
/* var hasPrototypeProperty = function(object, name) {
    return !object.hasOwnProperty(name) && (name in object);
};

function parseInt10(val) {
    return parseInt(val, 10);
}
 */
export function forEach(ele, ctx, cb) {
    if (isType("Array")(ele)) {
        ele.forEach((function(item, index) {
            cb.call(ctx, item, index);
        }));
    } else if (isType("Object")(ele)) {
        var it, index = 0;
        for (it in ele) {
            if (ele.hasOwnProperty(it)) {
                cb.call(ctx, it, index++);
            }
        }
    }
}

/**
 * 检查一个对象是否为空
 * @function
 * @param which
 * @returns {boolean}
 */
export function checkNull(which) {
    return !which || typeof which == "undefined" || which == "null";
}

/**
 * 按照指定key合并两个对象
 * @param target
 * @param source
 * @param key
 * @param overwrite
 */
export function mergeItem(target, source, key, overwrite) {
    if (source.hasOwnProperty(key) && !(source[key] == null)) {
        var targetProp = target[key];
        if (typeof targetProp == "object") {
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
 * @function
 * @param {*} target 目标对象
 * @param {*} source 源对象
 * @param {boolean} overwrite 是否覆盖
 * @param {object} map 源对象到目标对象的属性名映射.
 *      映射名是target的属性名需要映射到souece的属性名
 */
export function merge(target, source, overwrite, map) {
    if (checkNull(target)) {
        target = {};
    }
    if (isArr(source)) {
        source.forEach(item =>
            merge(target, item, overwrite, map)
        );
    } else {
        map && replaceattr(source, map);
        for (var i in source) {
            mergeItem(target, source, i, overwrite);
        }
    }
    return target;
}

export function simpleMerge(target , source){
    if (isArr(source)) {
        source.forEach(item =>
            simpleMerge(target, item)
        );
    } else {
        for (var item in source) {
            if(item)
                target[item] = source[item];
        }
    }
    return target;
}

/**
 * 用指定的map属性名映射替代目标对象的属性名. 仅仅改变属性的名称
 * 该方法会直接更改目标对象
 * @function
 * @param {object} target    要被替换的对象
 * @param {object} map   对象属性名的映射
 */
export function replaceattr(target, map) {
    if (map && target) {
        for (var tg in target) {
            if (map.hasOwnProperty(tg) && (map[tg] != tg)) {
                // 将target中的属性名替换为对应的映射后的名字
                target[map[tg]] = target[tg];
                target[tg] = null;
            }
        }
    }
    return target;
}

export function isType(type) {
    return function(ele) {
        return !checkNull(ele) && Object.prototype.toString.call(ele) == "[object " + type + "]";
    };
}


export function isArr(obj) {
    return isType("Array")(obj);
}

export var isFunc = isType("Function"),
    isObj = isType("Object"),
    isNum = isType("Number");
