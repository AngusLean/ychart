(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.YH = factory();
    }
}(this, function () {
//almond, and your modules will be inlined here