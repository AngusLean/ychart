export var inherit = function (clazz, baseClazz) {
    var clazzPrototype = clazz.prototype;

    function F() {
    }

    F.prototype = baseClazz.prototype;
    clazz.prototype = new F();

    for (var prop in clazzPrototype) {
        clazz.prototype[prop] = clazzPrototype[prop];
    }
    clazz.constructor = clazz;
}

//组合两个类。 仅组合原型的属性

export var mixin = function (target, source, overlay) {
    source = "prototype" in source ? source.prototype : source;
    target = "prototype" in target ? target.prototype : target;
    _over(target, source, overlay);
    function _over(target, source, overlay) {
        for (var ele in source) {
            if (source.hasOwnProperty(ele) &&
                (overlay ? (source[ele] !== null) : (target[ele] === null))) {
                target[ele] = source[ele];
            }
        }
        return target;
    }
}

