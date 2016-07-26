(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.YH = factory();
    }
}(this, function () {
//almond, and your modules will be inlined here
/**
 * @license almond 0.3.2 Copyright jQuery Foundation and other contributors.
 * Released under MIT license, http://github.com/requirejs/almond/LICENSE
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part, normalizedBaseParts,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name) {
            name = name.split('/');
            lastIndex = name.length - 1;

            // If wanting node ID compatibility, strip .js from end
            // of IDs. Have to do this here, and not in nameToUrl
            // because node allows either .js or non .js to map
            // to same file.
            if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
            }

            // Starts with a '.' so need the baseName
            if (name[0].charAt(0) === '.' && baseParts) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that 'directory' and not name of the baseName's
                //module. For instance, baseName of 'one/two/three', maps to
                //'one/two/three.js', but we want the directory, 'one/two' for
                //this normalization.
                normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                name = normalizedBaseParts.concat(name);
            }

            //start trimDots
            for (i = 0; i < name.length; i++) {
                part = name[i];
                if (part === '.') {
                    name.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    // If at the start, or previous value is still ..,
                    // keep them so that when converted to a path it may
                    // still work when converted to a path, even though
                    // as an ID it is less than ideal. In larger point
                    // releases, may be better to just kick out an error.
                    if (i === 0 || (i === 1 && name[2] === '..') || name[i - 1] === '..') {
                        continue;
                    } else if (i > 0) {
                        name.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
            //end trimDots

            name = name.join('/');
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                    hasProp(waiting, depName) ||
                    hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                    cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {
        if (typeof name !== 'string') {
            throw new Error('See almond README: incorrect module build, no module name');
        }

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());
define("../build/wrap/almond", function(){});

define('tool/util',['require'],function (require) {
    

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
            this._over(target, source ,overlay);
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
        if (source.hasOwnProperty(key)) {
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

    var _ctx = null;
    function createCanvas(){
        return document.createElement("canvas");
    }
    function getContext(){
        if(!_ctx){
            _ctx = createCanvas().getContext("2d");
        }
        return _ctx;
    }

    function _isType(type){
        return function(ele){
            return !checkNull(ele) && Object.prototype.toString.call(ele) == "[object "+type+"]";
        };
    }

    return {
        merge: merge,
        replaceattr: replaceattr,
        checkNull: checkNull,
        ClassUtil: ClassUtil,
        DomUtil: DomUtil,
        isFunc: _isType("Function"),
        isObj: _isType("Object"),
        isArr: _isType("Array"),

        getContext: getContext
    };
});

define('tool/guid',['require','exports','module'],function (require, exports, module) {

    var beginid = 1000;
    var guid = function(){
        return beginid++;
    };

    return guid;
});

define('base/matrix',[],function () {
    var ArrayCtor = typeof Float32Array === 'undefined'
        ? Array
        : Float32Array;
    /**
     * 3x2矩阵操作类
     * @exports zrender/tool/matrix
     */
    var matrix = {
        /**
         * 创建一个单位矩阵
         * @return {Float32Array|Array.<number>}
         */
        create : function() {
            var out = new ArrayCtor(6);
            matrix.identity(out);

            return out;
        },
        /**
         * 设置矩阵为单位矩阵
         * @param {Float32Array|Array.<number>} out
         */
        identity : function(out) {
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            out[4] = 0;
            out[5] = 0;
            return out;
        },
        /**
         * 复制矩阵
         * @param {Float32Array|Array.<number>} out
         * @param {Float32Array|Array.<number>} m
         */
        copy: function(out, m) {
            out[0] = m[0];
            out[1] = m[1];
            out[2] = m[2];
            out[3] = m[3];
            out[4] = m[4];
            out[5] = m[5];
            return out;
        },
        /**
         * 矩阵相乘
         * @param {Float32Array|Array.<number>} out
         * @param {Float32Array|Array.<number>} m1
         * @param {Float32Array|Array.<number>} m2
         */
        mul : function (out, m1, m2) {
            // Consider matrix.mul(m, m2, m);
            // where out is the same as m2.
            // So use temp variable to escape error.
            var out0 = m1[0] * m2[0] + m1[2] * m2[1];
            var out1 = m1[1] * m2[0] + m1[3] * m2[1];
            var out2 = m1[0] * m2[2] + m1[2] * m2[3];
            var out3 = m1[1] * m2[2] + m1[3] * m2[3];
            var out4 = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
            var out5 = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];
            out[0] = out0;
            out[1] = out1;
            out[2] = out2;
            out[3] = out3;
            out[4] = out4;
            out[5] = out5;
            return out;
        },
        /**
         * 平移变换
         * @param {Float32Array|Array.<number>} out
         * @param {Float32Array|Array.<number>} a
         * @param {Float32Array|Array.<number>} v
         */
        translate : function(out, a, v) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            out[4] = a[4] + v[0];
            out[5] = a[5] + v[1];
            return out;
        },
        /**
         * 旋转变换
         * @param {Float32Array|Array.<number>} out
         * @param {Float32Array|Array.<number>} a
         * @param {number} rad
         */
        rotate : function(out, a, rad) {
            var aa = a[0];
            var ac = a[2];
            var atx = a[4];
            var ab = a[1];
            var ad = a[3];
            var aty = a[5];
            var st = Math.sin(rad);
            var ct = Math.cos(rad);

            out[0] = aa * ct + ab * st;
            out[1] = -aa * st + ab * ct;
            out[2] = ac * ct + ad * st;
            out[3] = -ac * st + ct * ad;
            out[4] = ct * atx + st * aty;
            out[5] = ct * aty - st * atx;
            return out;
        },
        /**
         * 缩放变换
         * @param {Float32Array|Array.<number>} out
         * @param {Float32Array|Array.<number>} a
         * @param {Float32Array|Array.<number>} v
         */
        scale : function(out, a, v) {
            var vx = v[0];
            var vy = v[1];
            out[0] = a[0] * vx;
            out[1] = a[1] * vy;
            out[2] = a[2] * vx;
            out[3] = a[3] * vy;
            out[4] = a[4] * vx;
            out[5] = a[5] * vy;
            return out;
        },
        /**
         * 求逆矩阵
         * @param {Float32Array|Array.<number>} out
         * @param {Float32Array|Array.<number>} a
         */
        invert : function(out, a) {

            var aa = a[0];
            var ac = a[2];
            var atx = a[4];
            var ab = a[1];
            var ad = a[3];
            var aty = a[5];

            var det = aa * ad - ab * ac;
            if (!det) {
                return null;
            }
            det = 1.0 / det;

            out[0] = ad * det;
            out[1] = -ab * det;
            out[2] = -ac * det;
            out[3] = aa * det;
            out[4] = (ac * aty - ad * atx) * det;
            out[5] = (ab * atx - aa * aty) * det;
            return out;
        }
    };

    return matrix;
});

define('base/vector',[],function () {
    var ArrayCtor = typeof Float32Array === 'undefined' ? Array : Float32Array;

    /**
     * @typedef {Float32Array|Array.<number>} Vector2
     */
    /**
     * 二维向量类
     * @exports zrender/tool/vector
     */
    var vector = {
        /**
         * 创建一个向量
         * @param {number} [x=0]
         * @param {number} [y=0]
         * @return {Vector2}
         */
        create: function (x, y) {
            var out = new ArrayCtor(2);
            out[0] = x || 0;
            out[1] = y || 0;
            return out;
        },

        /**
         * 复制向量数据
         * @param {Vector2} out
         * @param {Vector2} v
         * @return {Vector2}
         */
        copy: function (out, v) {
            out[0] = v[0];
            out[1] = v[1];
            return out;
        },

        /**
         * 克隆一个向量
         * @param {Vector2} v
         * @return {Vector2}
         */
        clone: function (v) {
            var out = new ArrayCtor(2);
            out[0] = v[0];
            out[1] = v[1];
            return out;
        },

        /**
         * 设置向量的两个项
         * @param {Vector2} out
         * @param {number} a
         * @param {number} b
         * @return {Vector2} 结果
         */
        set: function (out, a, b) {
            out[0] = a;
            out[1] = b;
            return out;
        },

        /**
         * 向量相加
         * @param {Vector2} out
         * @param {Vector2} v1
         * @param {Vector2} v2
         */
        add: function (out, v1, v2) {
            out[0] = v1[0] + v2[0];
            out[1] = v1[1] + v2[1];
            return out;
        },

        /**
         * 向量缩放后相加
         * @param {Vector2} out
         * @param {Vector2} v1
         * @param {Vector2} v2
         * @param {number} a
         */
        scaleAndAdd: function (out, v1, v2, a) {
            out[0] = v1[0] + v2[0] * a;
            out[1] = v1[1] + v2[1] * a;
            return out;
        },

        /**
         * 向量相减
         * @param {Vector2} out
         * @param {Vector2} v1
         * @param {Vector2} v2
         */
        sub: function (out, v1, v2) {
            out[0] = v1[0] - v2[0];
            out[1] = v1[1] - v2[1];
            return out;
        },

        /**
         * 向量长度
         * @param {Vector2} v
         * @return {number}
         */
        len: function (v) {
            return Math.sqrt(this.lenSquare(v));
        },

        /**
         * 向量长度平方
         * @param {Vector2} v
         * @return {number}
         */
        lenSquare: function (v) {
            return v[0] * v[0] + v[1] * v[1];
        },

        /**
         * 向量乘法
         * @param {Vector2} out
         * @param {Vector2} v1
         * @param {Vector2} v2
         */
        mul: function (out, v1, v2) {
            out[0] = v1[0] * v2[0];
            out[1] = v1[1] * v2[1];
            return out;
        },

        /**
         * 向量除法
         * @param {Vector2} out
         * @param {Vector2} v1
         * @param {Vector2} v2
         */
        div: function (out, v1, v2) {
            out[0] = v1[0] / v2[0];
            out[1] = v1[1] / v2[1];
            return out;
        },

        /**
         * 向量点乘
         * @param {Vector2} v1
         * @param {Vector2} v2
         * @return {number}
         */
        dot: function (v1, v2) {
            return v1[0] * v2[0] + v1[1] * v2[1];
        },

        /**
         * 向量缩放
         * @param {Vector2} out
         * @param {Vector2} v
         * @param {number} s
         */
        scale: function (out, v, s) {
            out[0] = v[0] * s;
            out[1] = v[1] * s;
            return out;
        },

        /**
         * 向量归一化
         * @param {Vector2} out
         * @param {Vector2} v
         */
        normalize: function (out, v) {
            var d = vector.len(v);
            if (d === 0) {
                out[0] = 0;
                out[1] = 0;
            }
            else {
                out[0] = v[0] / d;
                out[1] = v[1] / d;
            }
            return out;
        },

        /**
         * 计算向量间距离
         * @param {Vector2} v1
         * @param {Vector2} v2
         * @return {number}
         */
        distance: function (v1, v2) {
            return Math.sqrt(
                (v1[0] - v2[0]) * (v1[0] - v2[0]) + (v1[1] - v2[1]) * (v1[1] - v2[1])
            );
        },

        /**
         * 向量距离平方
         * @param {Vector2} v1
         * @param {Vector2} v2
         * @return {number}
         */
        distanceSquare: function (v1, v2) {
            return (v1[0] - v2[0]) * (v1[0] - v2[0]) + (v1[1] - v2[1]) * (v1[1] - v2[1]);
        },

        /**
         * 求负向量
         * @param {Vector2} out
         * @param {Vector2} v
         */
        negate: function (out, v) {
            out[0] = -v[0];
            out[1] = -v[1];
            return out;
        },

        /**
         * 插值两个点
         * @param {Vector2} out
         * @param {Vector2} v1
         * @param {Vector2} v2
         * @param {number} t
         */
        lerp: function (out, v1, v2, t) {
            out[0] = v1[0] + t * (v2[0] - v1[0]);
            out[1] = v1[1] + t * (v2[1] - v1[1]);
            return out;
        },

        /**
         * 矩阵左乘向量
         * @param {Vector2} out
         * @param {Vector2} v
         * @param {Vector2} m
         */
        applyTransform: function (out, v, m) {
            var x = v[0];
            var y = v[1];
            out[0] = m[0] * x + m[2] * y + m[4];
            out[1] = m[1] * x + m[3] * y + m[5];
            return out;
        },
        /**
         * 求两个向量最小值
         * @param  {Vector2} out
         * @param  {Vector2} v1
         * @param  {Vector2} v2
         */
        min: function (out, v1, v2) {
            out[0] = Math.min(v1[0], v2[0]);
            out[1] = Math.min(v1[1], v2[1]);
            return out;
        },
        /**
         * 求两个向量最大值
         * @param  {Vector2} out
         * @param  {Vector2} v1
         * @param  {Vector2} v2
         */
        max: function (out, v1, v2) {
            out[0] = Math.max(v1[0], v2[0]);
            out[1] = Math.max(v1[1], v2[1]);
            return out;
        }
    };

    vector.length = vector.len;
    vector.lengthSquare = vector.lenSquare;
    vector.dist = vector.distance;
    vector.distSquare = vector.distanceSquare;

    return vector;
});

/**
 * 提供变换扩展
 * @module zrender/mixin/Transformable
 * @author pissang (https://www.github.com/pissang)
 */
define('base/transform',['require','./matrix','./vector'],function(require) {

    

    var matrix = require('./matrix');
    var vector = require('./vector');
    var mIdentity = matrix.identity;

    var EPSILON = 5e-5;

    function isNotAroundZero(val) {
        return val > EPSILON || val < -EPSILON;
    }

    /**
     * @alias module:zrender/mixin/Transformable
     * @constructor
     */
    var Transformable =function (opts) {
        opts = opts || this;
        // If there are no given position, rotation, scale
        if (!opts.position) {
            /**
             * 平移
             * @type {Array.<number>}
             * @default [0, 0]
             */
            this.position = [0, 0];
        }else{
            this.position = opts.position;
        }
        if (!opts.rotation) {
            /**
             * 旋转
             * @type {Array.<number>}
             * @default 0
             */
            this.rotation = 0;
        }else{
            this.rotation = opts.rotation;
        }
        if (!opts.scale) {
            /**
             * 缩放
             * @type {Array.<number>}
             * @default [1, 1]
             */
            this.scale = [1, 1];
        }else{
            this.scale = opts.scale;
        }
        /**
         * 旋转和缩放的原点
         * @type {Array.<number>}
         * @default null
         */
        this.origin = this.origin || null;

    };

    /**
     * 默认的变换矩阵
     */
    Transformable.prototype.transform = null;

    /**
     * 判断是否需要有坐标变换
     * 如果有坐标变换, 则从position, rotation, scale以及父节点的transform计算出自身的transform矩阵
     */
    Transformable.prototype.needLocalTransform = function() {
        return isNotAroundZero(this.rotation) || isNotAroundZero(this.position[0]) ||
            isNotAroundZero(this.position[1]) || isNotAroundZero(this.scale[0] - 1) ||
            isNotAroundZero(this.scale[1] - 1);
    };

    Transformable.prototype.updateTransform = function() {
        var parent = this.parent;
        var parentHasTransform = parent && parent.transform;
        var needLocalTransform = this.needLocalTransform();

        var m = this.transform;
        m = m || [];
        if (!(needLocalTransform || parentHasTransform)) {
            mIdentity(m);
            return;
        }

        m = m || matrix.create();

        if (needLocalTransform) {
            this.getLocalTransform(m);
        } else {
            mIdentity(m);
        }

        // 应用父节点变换
        if (parentHasTransform) {
            if (needLocalTransform) {
                matrix.mul(m, parent.transform, m);
            } else {
                matrix.copy(m, parent.transform);
            }
        }
        // 保存这个变换矩阵
        this.transform = m;

        this.invTransform = this.invTransform || matrix.create();
        matrix.invert(this.invTransform, m);
    };

    Transformable.prototype.getLocalTransform = function(m) {
        m = m || [];
        mIdentity(m);

        var origin = this.origin;

        var scale = this.scale;
        var rotation = this.rotation;
        var position = this.position;
        if (origin) {
            // Translate to origin
            m[4] -= origin[0];
            m[5] -= origin[1];
        }
        if (scale){
            matrix.scale(m, m, scale);
        }
        if (rotation) {
            matrix.rotate(m, m, rotation);
        }
        if (origin) {
            // Translate back from origin
            m[4] += origin[0];
            m[5] += origin[1];
        }

        m[4] += position[0];
        m[5] += position[1];

        return m;
    };

    /**
     * 将自己的transform应用到context上
     * @param {Context2D} ctx
     */
    Transformable.prototype.setTransform = function(ctx) {
        var m = this.transform;
        if (m) {
            ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
        }
    };

    var tmpTransform = [];

    /**
     * 分解`transform`矩阵到`position`, `rotation`, `scale`
     */
    Transformable.prototype.decomposeTransform = function() {
        if (!this.transform) {
            return;
        }
        var parent = this.parent;
        var m = this.transform;
        if (parent && parent.transform) {
            // Get local transform and decompose them to position, scale, rotation
            matrix.mul(tmpTransform, parent.invTransform, m);
            m = tmpTransform;
        }
        var sx = m[0] * m[0] + m[1] * m[1];
        var sy = m[2] * m[2] + m[3] * m[3];
        var position = this.position;
        var scale = this.scale;
        if (isNotAroundZero(sx - 1)) {
            sx = Math.sqrt(sx);
        }
        if (isNotAroundZero(sy - 1)) {
            sy = Math.sqrt(sy);
        }
        if (m[0] < 0) {
            sx = -sx;
        }
        if (m[3] < 0) {
            sy = -sy;
        }
        position[0] = m[4];
        position[1] = m[5];
        scale[0] = sx;
        scale[1] = sy;
        this.rotation = Math.atan2(-m[1] / sy, m[0] / sx);
    };

    /**
     * 变换坐标位置到 shape 的局部坐标空间
     * @method
     * @param {number} x
     * @param {number} y
     * @return {Array.<number>}
     */
    Transformable.prototype.transformCoordToLocal = function(x, y) {
        var v2 = [x, y];
        var invTransform = this.invTransform;
        if (invTransform) {
            vector.applyTransform(v2, v2, invTransform);
        }
        return v2;
    };

    /**
     * 变换局部坐标位置到全局坐标空间
     * @method
     * @param {number} x
     * @param {number} y
     * @return {Array.<number>}
     */
    Transformable.prototype.transformCoordToGlobal = function(x, y) {
        var v2 = [x, y];
        var transform = this.transform;
        if (transform) {
            vector.applyTransform(v2, v2, transform);
        }
        return v2;
    };

    return Transformable;
});

define( 'base/element',['require','../tool/util','../tool/guid','../base/transform'],function (require) {
    

    var util = require("../tool/util");
    var guid = require("../tool/guid");

    var Transform = require("../base/transform");

    var Elements = function(opts){

        //元素的唯一ID
        this.id =null;

        //父元素。 在被添加到实例时设置
        this.parent = null;

        this.init();

        Transform.call(this,opts);
    };

    //元素默认所在的层级
    Elements.prototype.zLevel = 0;

    //元素是否被忽略（不会计算样式，不会显示）
    Elements.prototype.ignore = false;

    //元素类型。 子类应该覆盖该属性
    Elements.prototype.type ="element";

    Elements.prototype.getId = function(){
        return this.id;
    };

    Elements.prototype.getType = function(){
        return this.type;
    };

    Elements.prototype.init = function(){
        this.id = this.type +"--" + guid();
    };


    util.ClassUtil.inherit(Elements, Transform ,true);
    return Elements;
});

define('Group',['require','./tool/util','./base/element'],function(require) {
    

    var util = require("./tool/util");
    var element = require("./base/element");

    var Group = function(opt) {

        this.children = [];

        util.merge(this, opt, false);
        element.call(this, opt);
    };

    Group.prototype.type = "group";

    Group.prototype.addChild = function(child) {
        if (child == this)
            return;
        child.parent = this;
        this.children.push(child);
        return this;
    };

    util.ClassUtil.inherit(Group, element);


    return Group;
});

define('Storage',['require','./tool/util','./Group'],function(require) {
    

    var util = require("./tool/util");

    /**
     * ycharts存储组件。
     * 该组件存储了绘图相关的实例。 负责处理不同绘图层、统一绘图层不同显示级别的关系
     * @param yh
     * @constructor
     */
    var Storage = function(yh) {
        //ycharts实例
        this._yh = yh;

        //保存所有的形状组件
        this._roots = [];
    };

    var Group = require("./Group");
    Storage.prototype.addEle = function(element) {
        if (!element || element.getId() === null) {
            return;
        }
        var index, i;
        for (index = 0; index < this._roots.length; index++) {
            i = this._roots[index];
            if (i.getId() == element.getId()) {
                return;
            }
        }

        //group当成一个元素便于管理
        this._roots.push(element);
    };

    /**
     * 获取所有可绘制的图形列表。 组的所有子元素被提取出来。
     * @returns {Array}
     */
    Storage.prototype.getDisplayableShapeList = function() {
        var list = [];
        var _getList = function(root) {
            if (util.isArr(root)) {
                for (var i = 0; i < root.length; i++) {
                    if (root[i] instanceof Group) {
                        _getList(root[i].children);
                    } else if (root[i].ignore === false) {
                        list.push(root[i]);
                    }
                }
            }else if(root instanceof Group){
                _getList(root.children);
            }
        };

        _getList(this._roots);

        return list;
    };

    Storage.prototype.clean = function () {
        this._roots = [];
    };

    return Storage;
});

define('Layer',['require','./tool/util'],function(require){
    

    var util = require("./tool/util");
    function getContext(drawing) {
        if (drawing && drawing.getContext) {
            return drawing.getContext("2d");
        }
        return null;
    }

    function createDOM(id, type,width ,height ,left, top){
        var newdom = document.createElement(type);

        var st = newdom.style;
        st.position = "absolute";
        st.left = left;
        st.top = top;
        st.width = width+"px";
        st.height = height+"px";
        newdom.width = width;
        newdom.height = height;
        newdom.setAttribute("ychart-layer",id);
        return newdom;
    }

    /**
     * 一个绘图层。 对应DOM上一个canvas元素。
     * 每一个layer都有自己独立和样式。 不同layer之间的前后关系由Storage模块处理。 layer的具体绘制由
     * Painter处理
     * @param id
     * @param opts
     * @constructor
     */
    var Layer = function(id, opts){
        this.id = id;
        this.dom = document.getElementById(id);
        if(util.checkNull(this.dom)){
            this.dom = createDOM(id, "canvas" ,opts.width ,opts.height ,opts.left || 0 ,opts.top || 0);
        }
        this.ctx = getContext(this.dom);
        if (util.checkNull(this.ctx)) {
            alert("浏览器不支持HTML5 canvas绘图,请更新浏览器 " + this.ctx);
            return;
        }

        this.ctxWidth = this.ctx.canvas.width;
        this.ctxHeight = this.ctx.canvas.height;

        //默认变换。即已当前层的左下角为原点的直角座标系
        this.transform = [1,0,0,-1,0,this.ctxHeight];
    };


    Layer.prototype.getContext = function(){
        return this.ctx;
    };



    return Layer;
});

define('Painter',['require','./Layer','./tool/guid','./tool/util','./Group'],function(require){
    

    var Layer = require("./Layer");
    var guid = require("./tool/guid");
    var util = require("./tool/util");

    /**
     * 绘图组件。
     * 该组件控制所有元素绘制相关的处理，包括各个元素之间的层级关系、属性继承等
     * 具体绘制的层在Layer模块中
     * @param ych
     * @constructor
     */
    var Painter = function(ych){

        this.container = document.getElementById(ych.domid);
        var temp = util.DomUtil.getPosition(this.container);
        this.width = temp.width;
        this.height = temp.height;
        this.left = temp.left;
        this.top = temp.top;
        temp = null;

        this.layer =  {};
    };

    Painter.prototype.refresh = function(shapeList){
        var i,shape,layer,zlevel;
        for(i=0 ;i<shapeList.length ;i++){
            shape = shapeList[i];
            zlevel = shape.zLevel || 0;
            layer = this.getLayer(zlevel);

            this.preProcessShapeInLayer(shape, layer);

            shape.Brush(layer.getContext());
        }
    };

    var Group = require("./Group");

    /**
     * 处理当前形状的层次结构,把当前形状的父元素与绘图层Layer关联起来
     * @param shape
     * @param layer
     */
    Painter.prototype.preProcessShapeInLayer = function(shape ,layer){

        var _preProcessSHapeInLayer = function(_shape){
            if(util.checkNull(_shape.parent)){
                _shape.parent = layer;
            }else if(_shape.parent instanceof Group){
                _groupPreProcess(_shape.parent ,layer);
            }
        };

        /**
         * 更新某个元素所属组的parent属性, 用于变换. 每个group都会继承它的parent的变换.
         * 顶层group继承所属Layer的变换.
         * 该方法最主要的目的是由根layer开始向上计算相应的变换矩阵
         * @param gp 当前group
         * @param ly 所属绘图层(Layer)
         * @private
         */
        var _groupPreProcess = function (gp ,ly) {
            //第一个是最高级别的group,后面的都是它的子group
            var groupquene = [];
            var _buildGroupQuene = function (_group) {
                if(_group instanceof Group){
                    groupquene.unshift(_group);
                }
                if(_group.parent instanceof Group){
                    _buildGroupQuene(_group.parent);
                }
            };
            _buildGroupQuene(gp);
            var before;
            groupquene.forEach(function (item, index) {
                if(index === 0){
                    item.parent = ly;
                } else{
                    item.parent = before;
                }
                before = item;
                //更新组的变换
                item.updateTransform();
            });
        };


        _preProcessSHapeInLayer(shape);
    };

    Painter.prototype.getLayer = function(zLevel){
        var layer = this.layer[zLevel];
        if(!layer){
            layer = new Layer(guid()+"-zlevel",{
                width: this.getWidth(),
                height: this.getHeight(),
                left: this.left,
                top: this.top
            });
            this.layer[zLevel] = layer;
            this.insertLayer(layer);
        }

        return layer;
    };

    Painter.prototype.getWidth = function(){
        return this.width;
    };

    Painter.prototype.getHeight = function(){
        return this.height;
    };

    Painter.prototype.clean = function(){
        this.width = null;
        this.height = null;
        //删除创建的canvas元素
        this.container.html("");
        this.container = null;
    };

    /**
     * 在文档中插入指定的layer节点
     * TODO 对不同layer进行排序
     */
    Painter.prototype.insertLayer = function(layer){
        var dom = layer.dom;
        this.container.appendChild(dom);
    };

    return Painter;
});

define('Ycharts',['require','./tool/util','./Storage','./Painter','./Group'],function(require) {
    
    var util = require("./tool/util");
    var Storage = require("./Storage");
    var Painter = require("./Painter");
    var Group = require("./Group");

    function getContext(id) {
        var drawing = document.getElementById(id);
        if (drawing && drawing.getContext) {
            return drawing.getContext("2d");
        }
        return null;
    }


    /**
     * 简单的基于Htmo5 canvas的绘图库， 使用MVC思想封装绘图代码，使得开发者可以很方便的使用本库
     * 封装的canvas API绘图。
     * @param eleid  放置canvas的容器。 不能是canvas元素， 必须设置宽度和高度
     * @param opt
     * @constructor
     */
    var YCharts = function(eleid, opt) {
        //当前实例ID
        this.id = null;
        //当前实例绑定的页面元素ID
        this.domid = eleid;

        //存储所有绘图相关组件。
        this.storage = new Storage(this);
        //绘图具体操作类。 与storage交互
        this.painter = new Painter(this);
    };


    YCharts.prototype.clear = function() {
        this.painter.clean();
        this.storage.clean();
    };

    YCharts.prototype.add = function(el) {
        this.storage.addEle(el);
        return this;
    };

    YCharts.prototype.BrushAll = function() {
        var x= this.storage.getDisplayableShapeList();
        this.painter.refresh(x);
        return this;
    };

    YCharts.prototype.setId = function(id) {
        this.id = id;
    };



    var ycharts = {};
    var instances = {};
    var i = 1000;

    /**
     * ycharts外部访问接口。 用于统一管理所有用到的ycharts实例
     * @param id  容器ID
     * @param config 相关配置
     * @returns {YCharts}
     */
    ycharts.init = function(id, config) {
        var _charts = new YCharts(id, config);
        _charts.setId("ycharts-"+i++);
        instances[id] = _charts;
        return _charts;
    };

    ycharts.depose = function (id) {
        if(instances[id]){
            instances[id].clean();
            instances[id] = null;
        }
    };


    return ycharts;
});

define('tool/debug',['require','./util'],function(require){
    var util = require("./util");

    var dbpre = "DamJs Debug Info :    ";
    var wnpre = "DamJs warn Info :    ";
    var dbprespace = function(){
        var i=0,rs="      ";
        for(i =0 ;i<dbpre.length ;i++){
            rs += " ";
        }
        return rs;
    }();

    var debug = function (info) {
        console.log(dbpre + info);
    };
    var warn = function (info) {
        console.log(wnpre + info);
    };

    var isobj = false;
    var printObj = function(obj){
        function _printObj(obj){
            var ele;
            if(util.isObj(obj)){
                for(ele in obj){
                    if(util.isObj(obj[ele])){
                        debug(ele+" : ");
                        isobj = true;
                        printObj(obj[ele]);
                        isobj = false;
                    }else{
                        if(isobj){
                            console.log(dbprespace+ele+" : "+obj[ele]);
                        }
                        else
                            debug(ele+" : "+obj[ele]);
                    }
                }
            }else if(util.isArr(obj)){
                var len = obj.length;
                for(var i=0 ;i<len ;i++){
                    printObj(obj[i]);
                }
            }
        }
        _printObj(obj);
        isobj = false;
    };

    return {
        printobj: printObj,
        debug: debug,
        warn: warn
    };
});

define('shape/dep/style',['require','../../tool/util'],function(require){
    


    /**
     * 映射配置属性名到canvas属性.
     * 应该包含默认的属性名
     * 新加一个属性在这个映射和下面CONFIG中的style中同时添加
     */
    var styleMap = {

        fillStyle: "fillStyle",
        fillColor: "fillStyle",
        color: "fillStyle",

        strokeStyle: "strokeStyle",
        lineColor: "strokeStyle",
        lineWidth: "lineWidth",
        lineCap: "lineCap",
        lineJoin: "lineJoin",
        font: "font",

        textAlign: "textAlign",
        textBaseline: "textBaseline",

        shadowColor: "shadowColor",
        shadowOffsetX: 'shadowOffsetX',
        shadowOffsetY: 'shadowOffsetY',
        shadowBlur: 'shadowBlur',
        shadowx: "shadowOffsetX",
        shadowy: "shadowOffsetY",

        globalAlpha: "globalAlpha",
        alpha: "globalAlpha",
        globalCompositionOperation: "globalCompositionOperation",
        overlaystyle: "globalCompositionOperation"
    };


    var util = require("../../tool/util");

    /**
     * 全局默认样式。 所有形状或者路劲的样式都基于这个样式。
     * 负责为所有模块提供默认样式及自定义样式名到标准样式名的转换
     * @param opt  初始化样式
     * @private
     */
    var _style = function(opt){
        if(opt){
            util.replaceattr(opt , styleMap);
            for(var attr in opt){
                if(opt[attr]){
                    this[attr] = opt[attr];
                }
            }
        }
    };


    _style.prototype = {
        /**
         * 线条颜色，用于任意路劲绘制中线条样式的控制。
         * 值可以是任意十六进制颜色或者英文单词
         */
        strokeStyle: "blue",

        /**
         * 填充颜色，用于任意路劲中fill方法的填充样式
         * 值可以是任意十六进制颜色或者英文单词
         */
        fillStyle: "#dcd5d9",

        /**
         * 线宽。
         * @type number
         */
        lineWidth: 1,

        /**
         * 线条两端样式
         * @type string
         */
        lineCap: "butt",

        /**
         * bevel,miter线条相交的方式. 园交,斜交还是斜接.
         * @type string
         */
        lineJoin: "round",

        /**
         * 文字
         * @type string
         */
        font: "bold 14px Arial, Helvetica, sans-serif, Times, serif",

        /**
         * 文字颜色。 strokeStyle
         * 该属性不是标准的canvas样式，是ycharts为方便文字控制添加的
         * @type string
         */
        textColor: "black", //文字样式。 非标准canvas属性

        /**
         * 文本对齐方式
         * @type string
         */
        textAlign: "start",

        /**
         * 文本基线
         * @type string
         */
        textBaseline: "bottom",

        /**
         * 默认阴影颜色
         * @type string
         */
        shadowColor: "#EA9090",

        /**
         * 阴影X偏移
         * @type number
         */
        shadowOffsetX: 0,

        /**
         * 阴影Y偏移
         * @type number
         */
        shadowOffsetY: 0,

        /**
         * 像素的模糊数
         * @type number
         */
        shadowBlur: 0,

        /**
         * 透明度。  0为透明
         * @type number
         */
        globalAlpha: 1,

        /**
         * 透明重叠情况
         * @type string
         */
        globalCompositionOperation: "source-over"
    };


    return _style;
});

define('tool/text',['require','../shape/dep/style','./util'],function(require) {
    

    //使用默认样式
    var Style = require("../shape/dep/style");
    var st = new Style();

    var defaultFont = st.font;
    var defaultAlign = st.textAlign;
    var defaultBaseline = st.textBaseline;

    var _ctx = require("./util").getContext();

    var TextUtil = {
        TEXT_CACHE_MAX: 5000,

        _textHeightCache: [],
        _textHeightCacheCounter: 0,

        getTextHeight: function(text, textFont) {
            textFont = textFont || defaultFont;
            var key = text + ':' + textFont;
            if (TextUtil._textHeightCache[key]) {
                return TextUtil._textHeightCache[key];
            }

            _ctx.save();
            if (textFont) {
                _ctx.font = textFont;
            }

            text = (text + '').split('\n');
            // 比较粗暴
            var height = (_ctx.measureText('国').width + 2) * text.length;

            _ctx.restore();

            TextUtil._textHeightCache[key] = height;
            if (++TextUtil._textHeightCacheCounter > TextUtil.TEXT_CACHE_MAX) {
                // 内存释放
                TextUtil._textHeightCacheCounter = 0;
                TextUtil._textHeightCache = {};
            }
            return height;
        },
        _textWidthCache: [],
        _textWidthCacheCounter: 0,

        getTextWidth: function(text, textFont) {

            textFont = textFont || defaultFont;
            var key = text + ':' + textFont;
            if (TextUtil._textWidthCache[key]) {
                return TextUtil._textWidthCache[key];
            }
            _ctx.save();

            if (textFont) {
                _ctx.font = textFont;
            }

            text = (text + '').split('\n');
            var width = 0;
            for (var i = 0, l = text.length; i < l; i++) {
                width = Math.max(
                    _ctx.measureText(text[i]).width,
                    width
                );
            }
            _ctx.restore();

            TextUtil._textWidthCache[key] = width;
            if (++TextUtil._textWidthCacheCounter > TextUtil.TEXT_CACHE_MAX) {
                // 内存释放
                TextUtil._textWidthCacheCounter = 0;
                TextUtil._textWidthCache = {};
            }

            return width;
        },
        /*
         * @param {Canvas} ctx 绘图上下文
         * @param {string} text 要获取矩形范围的文字
         * @param {number} x 绘制文字起始X座标
         * @param {number} y 绘制文字起始Y座标
         * @param {string} textFont 字体
         */
        getTextRect: function(text, x, y, textFont, textAlign, textBaseline) {

            textFont = textFont || defaultFont;
            textAlign = textAlign || defaultAlign;
            textBaseline = textBaseline || defaultBaseline;

            var width = TextUtil.getTextWidth(text, textFont);
            var lineHeight = TextUtil.getTextHeight('国', textFont);

            text = (text + '').split('\n');

            switch (textAlign) {
                case 'end':
                case 'right':
                    x -= width;
                    break;
                case 'center':
                    x -= (width / 2);
                    break;
            }

            switch (textBaseline) {
                case 'top':
                    break;
                case 'bottom':
                    y -= lineHeight * text.length;
                    break;
                default:
                    y -= lineHeight * text.length / 2;
            }

            return {
                x: x,
                y: y,
                width: width,
                height: lineHeight * text.length
            };
        }
    };


    function _fillText(ctx, text, x, y, textFont, textAlign, textBaseline) {
        if (textFont) {
            ctx.font = textFont;
        }
        ctx.textAlign = textAlign;
        ctx.textBaseline = textBaseline;
        var rect = TextUtil.getTextRect(
            text, x, y, textFont, textAlign, textBaseline
        );

        text = (text + "").split("\n");

        var lineHeight = TextUtil.getTextHeight("国", textFont);

        switch (textBaseline) {
            case "top":
                y = rect.y;
                break;
            case "bottom":
                y = rect.y + lineHeight;
                break;
            default:
                y = rect.y + lineHeight / 2;
        }

        for (var i = 0, l = text.length; i < l; i++) {
            ctx.fillText(text[i], x, y);
            y += lineHeight;
        }
    }

    return {
        fillText: _fillText,
        getTextRect: TextUtil.getTextRect,
        getTextWidth: TextUtil.getTextWidth,
        getTextHeight: TextUtil.getTextHeight
    };
});

define('shape/dep/styleProxy',['require','../../tool/util','./style'],function(require) {
    

    var util = require("../../tool/util");

    var Style = require("./style");


    /**
     * 在合并样式时会出现覆盖的情况
     */
    var _styleProxy = function(style) {
        style = style || {};
        this.style = new Style(style);
        this.brushType = null;
        this.init(style);
    };

    _styleProxy.prototype.init = function(style){
         this.brushType = style.brushType ? style.brushType :
            style.strokeStyle ?
                (style.fillStyle ? 'both' : 'stroke') :
                (style.fillStyle ? "fill" : "none") ;
    };

    _styleProxy.prototype.bindContext = function(ctx) {
        var style = this.style;
        for (var prop in style) {
            ctx[prop] = style[prop];
        }
        // 渐变效果覆盖其他的fillStyle样式
        if (util.isObj(style.gradient)) {
            var _gradient = ctx.createLinearGradient(style.gradient.beginpt[0], style.gradient.beginpt[1],
                style.gradient.endpt[0], style.gradient.endpt[1]);

            _gradient.addColorStop(0, style.gradient.beginColor);
            _gradient.addColorStop(1, style.gradient.endColor);
            ctx.fillStyle = _gradient;
        }
    };

    _styleProxy.prototype.getBrushType = function(style) {
        return this.brushType;
    };

    _styleProxy.prototype.getStyle = function() {
        return this.style;
    };

    return _styleProxy;
});

define( 'shape/BaseShape',['require','../tool/util','../tool/debug','../tool/text','../base/element','./dep/styleProxy'],function (require) {
    

    var util = require("../tool/util");
    var debugs = require("../tool/debug");
    var text = require("../tool/text");
    var Elements = require("../base/element");
    var StyleProxy = require("./dep/styleProxy");

    var warn = debugs.warn;

    /**
     * 所有形状的基类。 定义了可以显示的图片的一系列属性
     * @param opts
     */
    var baseShape = function(opts) {
        this.ignore = opts.ignore || false;

        this.styleProxy = new StyleProxy(opts.style);
        this.config = util.merge({}, opts, true);
        Elements.call(this,opts);
    };

    baseShape.prototype.type = "baseshape";

    /**
    *  如果某个形状设置了变换的话这就不满足要求。 目前实现仅仅满足使用直觉座标系时
    *  todo 更改绘制文字时变换的控制。当前实现过于丑陋
    * @param ctx
    * @param config
    * @constructor
    */
    baseShape.prototype.DrawText = function (ctx, config) {
        if(util.checkNull(config.text)){
            return;
        }

        var beginpt = this.GetContainRect();

        var x = beginpt[0][0];
        var y=beginpt[0][1];
        var height = beginpt[2][1] - beginpt[0][1];
        y = y + height/2;

        ctx.save();
        var st = this.styleProxy.getStyle();
        //文字颜色
        if(!util.checkNull(st.textColor)){
            ctx.fillStyle = st.textColor;
        }

        //文字的变换与图形不一样，默认情况下就是正向的，特别处理
        this.updateTransform();
        var m = this.transform;
        ctx.setTransform(m[0], m[1] ,m[2] ,-m[3] ,m[4] ,m[5]);

        text.fillText(ctx, config.text, x, m[5]-y, st.font,
                     st.textAlign, st.textBaseline);

        ctx.restore();
    };

    baseShape.prototype.BeforeBrush = function (ctx, config) {
        ctx.save();

        this.updateTransform();
        this.setTransform(ctx);
        //设置样式
        this.styleProxy.bindContext(ctx);
    };

    baseShape.prototype.AfterBrush = function (ctx, style) {
        var tp = this.styleProxy.getBrushType();
        switch (tp) {
        case "both":
        case "all":
            ctx.fill();
            ctx.stroke();
            break;
        case "stroke":
            ctx.stroke();
            break;
        case "fill":
            ctx.fill();
            break;
        case "none":
            break;
        default :
            ctx.fill();
            warn("error brush type " + style.brushType);
        break;
        }
        ctx.restore();
    };

    /**
    * 绘制图形关键函数. 添加的图形必须覆盖方法,
    * @param ctx
    * @param style
    * @returns {*}
    * @constructor
    */
    baseShape.prototype.BuildPath = function (ctx, config) {
        //设置合适的填充方法
        warn(" unsurported operation -- can't build shape path");
    };

    /**
    * 刷新图形
    * @param ctx
    * @constructor
    */
    baseShape.prototype.Brush = function (ctx) {
        if(!this.config.ignore){
            //设置样式
            this.BeforeBrush(ctx, this.config);
            //考虑到某个具体绘制函数可能需要用到处理过后的样式
            this.config.style = this.styleProxy.getStyle();
            //具体图形自己的定制
            this.BuildPath(ctx, this.config);
            this.DrawText(ctx,this.config);
            //恢复事故现场
            this.AfterBrush(ctx, this.config.style);
        }
    };

    baseShape.prototype.GetContainRect =function(){
        warn(" unsurported operation -- can't GetContainRect");
    };

    util.ClassUtil.inherit(baseShape, Elements ,true);

    return baseShape;
});

define('shape/Bezier',['require','exports','module','./BaseShape','../tool/util','../tool/debug'],function (require, exports, module) {
    var Element = require("./BaseShape");
    var util = require("../tool/util");
    var debugs = require("../tool/debug");
    var warn = debugs.warn;
    var debug = debugs.debug;

    /**
     * 绘制一条曲线路径. 调用此方法后当前的context将包含一条路径.
     * @param {x,y} beginpt 开始点坐标
     * @param {x,y} endpt   结束点坐标
     * @param {0-10的整数} compact 表示该波浪线的紧凑程度,即每个弯曲的距离比例
     * @param {0-4的整数} systole 波浪的起伏程度, 表现为上下波动程度. 1为标准.
     * 小于1就是缩放.1-4就是放大
     */
    function Bezier(opts) {
        Element.call(this, opts);
    }

    Bezier.prototype.type = "BezierPath";

    Bezier.prototype.BuildPath = function (ctx, config) {
        var beginpt = config.beginpt, endpt = config.endpt, compact = config.compact || 5, systole = config.systole;
        var insiderange = function (val, rg1, rg2) {
            return val < rg1 || val > rg2;
        };
        var sqrt = function (val) {
            return Math.sqrt(val);
        };
        var abs = function (val) {
            return Math.abs(val);
        };
        var atan = function (val) {
            return Math.atan(val);
        };
        var sin = function (val) {
            return Math.sin(val);
        };
        var cos = function (val) {
            return Math.cos(val);
        };
        var floor = function (val) {
            return Math.floor(val);
        };
        var radian2angle = function (radian) {
            return radian * 180 / Math.PI;
        };
        var linequadrant = function () {
            if (beginpt[0] < endpt[0] && beginpt[1] >= endpt[1]) return 1;
            if (beginpt[0] >= endpt[0] && beginpt[1] > endpt[1]) return 2;
            if (beginpt[0] > endpt[0] && beginpt[1] <= endpt[1]) return 3;
            if (beginpt[0] <= endpt[0] && beginpt[1] < endpt[1]) return 4;
        }();
        var nextx = function (x, dis) {
            return beginpt[0] <= endpt[0] ? x + dis : x - dis;
        };
        var nexty = function (y, dis) {
            return beginpt[1] <= endpt[1] ? y + dis : y - dis;
        };
        var nexpt_ct = function (pt, dispt, leftorright) {
            var getrs = function (disx, disy) {
                if (leftorright === 0) {
                    return {
                        x: pt[0] + disx,
                        y: pt[1] + disy
                    };
                } else if (leftorright == 1) {
                    return {
                        x: pt[0] - disx,
                        y: pt[1] - disy
                    };
                } else {
                    warn("通过距离获取控制点坐标出错");
                    return null;
                }
            };
            switch (linequadrant) {
                case 1:
                    return getrs(-dispt[0], -dispt[1]);
                case 2:
                    return getrs(-dispt[0], dispt[1]);
                case 3:
                    return getrs(dispt[0], dispt[1]);
                case 4:
                    return getrs(dispt[0], -dispt[1]);
            }
        };
        if (insiderange(compact, 1, 10) || insiderange(systole, 0, 4)) {
            warn("绘制曲线路径中输入的参数错误");
            return;
        }
        var piece = 2 * compact;
        var dispiece = sqrt(this.getDistance(beginpt, endpt) / piece);
        var h = dispiece / 2 * systole;
        var linevert_angleor = atan(abs(endpt[0] - beginpt[0]) / abs(endpt[1] - beginpt[1]));

        var linectx_dis = abs(endpt[0] - beginpt[0]) / piece;
        var linecty_dis = abs(endpt[1] - beginpt[1]) / piece;

        var allctpt = [];
        var allctinlinept = [];
        var alllinectpt = [];
        alllinectpt.push({
            x: beginpt[0],
            y: beginpt[1]
        }, {
            x: nextx(beginpt[0], linectx_dis),
            y: nexty(beginpt[1], linecty_dis)
        });
        allctinlinept.push({
            x: nextx(beginpt[0], linectx_dis / 2),
            y: nexty(beginpt[1], linecty_dis / 2)
        }, {
            x: nextx(nextx(beginpt[0], linectx_dis / 2), linectx_dis),
            y: nexty(nexty(beginpt[1], linecty_dis / 2), linecty_dis)
        });
        var dispt = {
            x: cos(linevert_angleor) * h,
            y: sin(linevert_angleor) * h
        };
        allctpt.push(nexpt_ct(allctinlinept[0], dispt, 0), nexpt_ct(allctinlinept[1], dispt, 1));
        var i;
        for (i = 2; i < piece; i++) {
            allctinlinept.push({
                x: nextx(allctinlinept[i - 1][0], linectx_dis),
                y: nexty(allctinlinept[i - 1][1], linecty_dis)
            });
            alllinectpt.push({
                x: nextx(alllinectpt[i - 1][0], linectx_dis),
                y: nexty(alllinectpt[i - 1][1], linecty_dis)
            });
            allctpt.push(nexpt_ct(allctinlinept[i], dispt, i % 2));
        }
        //最后一个点需要特殊处理
        alllinectpt.push({
            x: nextx(alllinectpt[i - 1][0], linectx_dis),
            y: nexty(alllinectpt[i - 1][1], linecty_dis)
        });

        ctx.beginPath();
        ctx.moveTo(beginpt[0], beginpt[1]);
        for (i = 1; i < allctpt.length; i++) {
            ctx.quadraticCurveTo(allctpt[i - 1][0], allctpt[i - 1][1], alllinectpt[i][0], alllinectpt[i][1]);
        }
        ctx.quadraticCurveTo(allctpt[i - 1][0], allctpt[i - 1][1], alllinectpt[i][0], alllinectpt[i][1]);

        config.style.brushType = "stroke";

    };

    util.ClassUtil.inherit(Bezier, Element); //继承
    return Bezier;

});

define('shape/Circle',['require','exports','module','./BaseShape','../tool/util'],function (require, exports, module) {
    var damJsShape = require("./BaseShape");

    /**
     * 圆形
     * @typedef {Object} ICircleStyle
     * @property {number} x 圆心x坐标
     * @property {number} y 圆心y坐标
     * @property {number} r 半径
     * @constructor
     */
    function Circle(style) {
        damJsShape.call(this, style);//继承
    }

    Circle.prototype.type = "circle";

    Circle.prototype.BuildPath = function (ctx, config) {
        ctx.beginPath();
        ctx.arc(config.x, config.y, config.r, Math.PI * 2, config.startangel || 0, config.endangel || Math.PI * 2);
        config.style.brushType = config.style.brushType || "stroke";
    };

    Circle.prototype.GetContainRect = function(){

    };

    require("../tool/util").ClassUtil.inherit(Circle, damJsShape); //继承

    return Circle;
});

define('shape/Line',['require','exports','module','./BaseShape','../tool/util'],function (require, exports, module) {
    var damJsShape = require("./BaseShape");

    /**
     * 直线
     * @typedef {Object} ICircleStyle
     * @property {Array} beginpt 开始座标
     * @property {Array} endpt 结束座标
     * @property {number} splitnum 从beginpt到endpt共绘制多少条线段。 默认1
     * @constructor
     */
    function Line(style) {
        damJsShape.call(this, style);//继承
    }

    Line.prototype.type = "line";

    Line.prototype.BuildPath = function (ctx, config) {
        ctx.beginPath();
        if(config.splitnum){
            var splitnum = config.splitnum || 1;
            var splitlen_x = (config.endpt[0] - config.beginpt[0])/splitnum/2;
            var splitlen_y = (config.endpt[1] - config.beginpt[1])/splitnum/2;
            for(var i=0 ;i<splitnum ; i++){
                ctx.moveTo(config.beginpt[0]+i*2*splitlen_x ,config.beginpt[1]+i*2*splitlen_y);
                ctx.lineTo(config.beginpt[0]+i*2*splitlen_x+splitlen_x ,config.beginpt[1]+i*2*splitlen_y+splitlen_y);
            }
        }else{
            ctx.moveTo(config.beginpt[0],config.beginpt[1]);
            ctx.lineTo(config.endpt[0],config.endpt[1]);
        }
    };


    require("../tool/util").ClassUtil.inherit(Line, damJsShape); //继承

    return Line;
});

define('shape/Rect',['require','exports','module','./BaseShape','../tool/util'],function (require, exports, module) {
    var damJsShape = require("./BaseShape");

    /**
     * 不规则多边形. 需指定所有的点坐标
     * @typedef {Object} ICircleStyle
     * @param allpt {Array} {x:10,y:10} 点的数组
     * @param notClose {boolean} 是否是不闭合的多边形.默认闭合
     * @constructor
     */
    function Rect(style) {
        damJsShape.call(this, style);//继承
    }

    Rect.prototype.type = "Rect";

    Rect.prototype.BuildPath = function (ctx, config) {
        ctx.beginPath();
        ctx.moveTo(config.allpt[0][0], config.allpt[0][1]);
        for (var i = 1; i < config.allpt.length; i++) {
            ctx.lineTo(config.allpt[i][0], config.allpt[i][1]);
        }
        if (!config.notClose) {
            ctx.closePath();
        }
    };

    Rect.prototype.GetContainRect = function(){
        var minx = 99999,miny = 99999 ,maxx = -99999 ,maxy = -99999;
        var i=0,tmp;
        for(i=0 ;i<this.config.allpt.length ;i++){
            tmp = this.config.allpt[i];
            if(tmp[0] < minx){
                minx = tmp[0];
            }
            if(tmp[1] < miny){
                miny = tmp[1];
            }
            if(tmp[0] > maxx){
                maxx = tmp[0];
            }
            if(tmp[1] > maxy){
                maxy = tmp[1];
            }
        }

        return [[minx,miny] ,[minx,maxy] ,[maxx,maxy] ,[maxx,miny]];
    };


    require("../tool/util").ClassUtil.inherit(Rect, damJsShape); //继承

    return Rect;
});

define('shape/Triangle',['require','exports','module','./BaseShape','../tool/util'],function (require, exports, module) {
    var damJsShape = require("./BaseShape");

    /**
     * 三角形
     * @typedef {Object} ICircleStyle
     * @property {number} beginpt 开始座标
     * @property {number} width  三角形的宽
     * @property {number} height 三角形的高
     * @property {number} direction bottom 为向下。 默认向上
     * @constructor
     */
    function Triangle(style) {
        damJsShape.call(this, style);//继承
    }

    Triangle.prototype.type = "triangle";

    Triangle.prototype.BuildPath = function (ctx, config) {
        ctx.beginPath();
        ctx.moveTo(config.beginpt[0],config.beginpt[1]);
        ctx.lineTo(config.beginpt[0]+config.width,config.beginpt[1]);
        var pt = [config.beginpt[0]+config.width/2 , config.beginpt[1]+config.height];
        //向下的三角形
        if(config.direction == "bottom"){
            pt[1] = config.beginpt[1] - config.height;
        }
        ctx.lineTo(pt[0],pt[1]);
        ctx.lineTo(config.beginpt[0],config.beginpt[1]);
        config.style.brushType = config.style.brushType || "stroke";
    };

    require("../tool/util").ClassUtil.inherit(Triangle, damJsShape); //继承

    return Triangle;
});

define('shape/YText',['require','exports','module','./BaseShape','../tool/util','../tool/text','../tool/util'],function (require, exports, module) {
    var damJsShape = require("./BaseShape");
    var util = require("../tool/util");
    var utext = require("../tool/text");

    /**
     * 文本
     * 由于文本显示与图像刚好是竖向完全相反的两个方向，所以对文本绘制特殊处理。
     * 某区域文本是直角座标系，但是文字实际上还是默认的座标系，不过Y被改成负数了
     * @property {string} text 显示的文字
     * @property {arrar[number]} beginpt 开始座标
     * @constructor
     */
    function yText(opt) {
        damJsShape.call(this, opt);//继承
    }

    yText.prototype.type = "Text";

    yText.prototype.BuildPath = function (ctx, config) {
        config.style.brushType = "none";
    };

    /**
     * 绘制文本
     * @param ctx
     * @param config
     * todo 更改绘制文字时变换的控制。当前实现过于丑陋
     * @constructor
     */
    yText.prototype.DrawText = function (ctx, config) {
        if(util.checkNull(config.text)){
            return;
        }

        var pt = config.beginpt;
        ctx.save();
        //文字颜色
        if(!util.checkNull(config.style.textColor)){
            ctx.fillStyle = config.style.textColor;
        }
        this.updateTransform();
        var m = this.transform;
        ctx.setTransform(m[0], m[1] ,m[2] ,-m[3] ,m[4] ,m[5]);
        utext.fillText(ctx, config.text, pt[0], -pt[1],
                      config.style.font, config.style.textAlign,config.style.textBaseline);
        ctx.restore();

    };

    require("../tool/util").ClassUtil.inherit(yText, damJsShape); //继承

    return yText;
});

/**
 * 水库模型。
 */
define('extend/dam/dam_md',['require','../../tool/util'],function(require){

    var util = require("../../tool/util");

    //basic dam module, any dam can extend from this
    var baseDamEntity = {
        name : "",
        /**
        * 按结构形式分为 重力坝/土石坝/拱坝/支墩坝
        */
        DMTP:{
            DMTPA: "土石坝",
            DMTPB:  "心墙坝",
            DMTPC:  "沥青混凝土心墙"
        },

        //最大坝高
        MAXDMHG : 0,
        //坝顶宽度
        DMTPWD : 0,
        //坝底宽度. 基本上用不到。 使用坝顶和坡度可以计算
        // DMBTWD : 0,
        //坝顶长度
        DMTPLN : 0,
        //坝顶高程
        DMTPEL : 0,

        //上游坝坡
        UPDMSL :{
            //可能有两段坡面
            UPDMSL1: 0,
            UPDMSL2: 0
        },
        //下游坝坡
        DWDMSL :{
            DWDMSL1: 0,
            DWDMSL2: 0
        },

        //心墙
        CDREWALL:{
            //心墙材料
            MT: "沥青混凝土",
            //心墙宽度
            WIDTH: 0,
            //心墙上游坡度
            UPSL:{
                //可能是组合式心墙
                UPSL1: 0,
                UPSL2: 0
            },
            //心墙下游坡度
            DWSL:{
                DWSL1: 0,
                DWSL2: 0
            }
        },

        //水位特征值
        HYCH :{
            //死水位
            DDWL: 0,
            //正常蓄水位
            NRPLLV : 0,
            //汛限水位
            FLSSCNWL: 0,
            //设计洪水位
            DSFLLV: 0,
            //校核洪水位
            CHFLLV :0,

            //当前水位
            Z :0
        }
    };

    var tsb = util.merge({
        DMTP : "土石坝",
        UPDMSL: 0,
        DWDMSL: 0,
        CDREWALL : null,
        HYCH: null
    },baseDamEntity ,false);

    return {
        basedammd: baseDamEntity,
        tsb : tsb
    };
});

define('extend/dam/dam',['require','../../tool/util','../../tool/text','./dam_md','../../Group','../../shape/Rect','../../shape/Line','../../shape/YText','../../tool/debug','../../shape/Triangle'],function(require) {
    

    var util = require("../../tool/util");
    var textutil = require("../../tool/text");
    var dammd = require("./dam_md");

    var Group = require("../../Group");
    var Rect = require("../../shape/Rect");
    var Line = require("../../shape/Line");
    var YText = require("../../shape/YText");

    var debugs = require("../../tool/debug");
    var warn = debugs.warn,
        debug = debugs.debug;

    var damView = function(_dammd) {
        this.dam = {};
        switch (_dammd.type) {
            case "土石坝":
                this.dam = util.merge(_dammd, dammd.tsb, false);
                break;
            default:
                warn("不支持的大坝类型");
                return;
        }
        this.damContainer = new Group();
        this.beginpt = null;
    };

    damView.prototype = {
        constructor: damView,

        setBeginPt: function(pt) {
            if (util.isArr(pt) && pt.length == 2) {
                this.beginpt = pt;
            }
        },

        getData: function(opt) {
            // this.damContainer.position = [120,120];
            this.damContainer.scale = [1,1];
            if (util.checkNull(this.beginpt) || this.beginpt.length != 2) {
                this.beginpt = [2];
                this.beginpt[0] = 0;
                this.beginpt[1] = 0;
            }

            /* var containerWidth = opt.ctwh;
            var containerHeight = opt.ctht; */

            /*
             * 先绘制左边的水位图再绘制大坝
             * 这里处理一次绘制的图与canvas大小的关系
             * 后面在适当缩放或者放大
             */
            this.drawWaterLevel([this.beginpt[0] - 90, this.beginpt[1]], 160);

            //大坝位置的点数组
            var damrect = [];
            //大坝起点位置
            damrect.push(this.beginpt);
            var pt;
            //大坝左上第一个点
            if (util.isObj(this.dam.UPDMSL)) {
                warn("上游坝坡面多折线未实现");
                return;
            } else {
                pt = [];
                pt[0] = this.beginpt[0] + this.dam.UPDMSL * this.dam.MAXDMHG;
                pt[1] = this.beginpt[1] + this.dam.MAXDMHG;
                damrect.push(pt);
            }
            //大坝右上角第一个点
            pt = [];
            pt[0] = this.beginpt[0] + this.dam.UPDMSL * this.dam.MAXDMHG + this.dam.DMTPWD;
            pt[1] = this.beginpt[1] + this.dam.MAXDMHG;
            damrect.push(pt);

            //大坝右下角最后一个点
            if (util.isObj(this.dam.DWDMSL)) {
                warn("下游坝坡面多折线未实现");
                return;
            } else {
                pt = [];
                pt[0] = this.beginpt[0] + this.dam.UPDMSL * this.dam.MAXDMHG + this.dam.DMTPWD + this.dam.DWDMSL * this.dam.MAXDMHG;
                pt[1] = this.beginpt[1];
                damrect.push(pt);
            }
            //大坝自身轮廓
            this.damContainer.addChild(new Rect({
                allpt: damrect,
                style: {
                    lineColor: "red",
                    textColor: "black",
                    fillColor: "#DDBB88",
                    // fillColor: "red",
                    brushType: "fill"
                },
                text: this.dam.name
            }));

            //心墙
            if (util.isObj(this.dam.CDREWALL)) {
                var cdrect = [];
                var tmp = (this.dam.DMTPWD - this.dam.CDREWALL.WTDTH) / 2; //坝顶宽度减去心墙宽度，即心墙左侧位置
                var pt1 = [];
                //心墙第一个点
                pt1[0] = damrect[1][0] + tmp;
                pt1[1] = damrect[0][1];
                if (!util.checkNull(this.dam.CDREWALL.UPSL)) {
                    if (util.isObj(this.dam.CDREWALL.UPSL)) {
                        warn("心墙上游坡面多折线尚未实现");
                        return;
                    } else {
                        //心墙上游坡面向上倾斜。
                        pt1[0] = damrect[1][0] + tmp - this.dam.MAXDMHG * this.dam.CDREWALL.UPSL;
                    }
                }
                cdrect.push(pt1);

                //心墙第二个点
                pt1 = [];
                pt1[0] = damrect[1][0] + tmp;
                pt1[1] = this.beginpt[1] + this.dam.MAXDMHG;
                cdrect.push(pt1);

                //心墙第三个点（右上角）
                pt1 = [];
                pt1[0] = damrect[1][0] + tmp + this.dam.CDREWALL.WTDTH;
                pt1[1] = this.beginpt[1] + this.dam.MAXDMHG;
                cdrect.push(pt1);

                //心墙第四个点(右下角)
                pt1 = [];
                pt1[0] = damrect[1][0] + tmp + this.dam.CDREWALL.WTDTH;
                pt1[1] = damrect[0][1];
                if (!util.checkNull(this.dam.CDREWALL.DWSL)) {
                    if (util.isObj(this.dam.CDREWALL.DWSL)) {
                        warn("心墙下游坡面多折线尚未实现");
                        return;
                    } else {
                        pt1[0] = damrect[1][0] + tmp + this.dam.CDREWALL.WTDTH + this.dam.MAXDMHG * this.dam.CDREWALL.DWSL;
                    }
                }
                cdrect.push(pt1);
                //绘制心墙
                this.damContainer.addChild(new Rect({
                    allpt: cdrect,
                    style: {
                        fillStyle: "#8B7E6C",
                        textColor: "red",
                        brushType: "fill"
                    }
                }));
            }

            return this.damContainer;
        },

        /*
         * @param beginpt [Array] 水位图最左边的点
         * @param maxwaterwidth [number] 水位图的宽度。
         * 上面两个参数结合水库的坝宽可以实现对不同大小的canvas的自适应。
         */
        drawWaterLevel: function(beginpt, maxwaterwidth) {
            if (!util.checkNull(this.dam.HYCH)) {
                var pt = [];
                var hych = this.dam.HYCH;

                if (util.checkNull(beginpt) || beginpt.length != 2) {
                    beginpt = [2];
                    beginpt[0] = 0;
                    beginpt[1] = 0;
                }
                //坝底高程()
                var DMBTEL = util.checkNull(this.dam.DMTPEL) ? 0 : (this.dam.DMTPEL - this.dam.MAXDMHG);
                //当前水位对应的海水
                var crtwl = [];
                var crtz = hych.Z - DMBTEL;

                crtwl.push(beginpt);
                crtwl.push([beginpt[0], beginpt[1] + crtz]);
                crtwl.push([beginpt[0] + maxwaterwidth, beginpt[1] + crtz]);
                crtwl.push([beginpt[0] + maxwaterwidth, beginpt[1]]);
                //当前水对应的海水背景
                this.damContainer.addChild(new Rect({
                    allpt: crtwl,
                    style: {
                        fillColor: '#1C6BA0',
                        brushType: "fill",
                        gradient: {
                            beginpt: [beginpt[0] + maxwaterwidth / 2, beginpt[1] + crtz],
                            endpt: [beginpt[0] + maxwaterwidth / 2, beginpt[1]],
                            beginColor: "#83ADF5",
                            endColor: "#1C6BA0"
                        }
                    }
                }));

                //竖向水尺划分为多少部分
                var splitnum = this.rulersplitnm;
                //水尺宽度
                var rulerwidth = this.rulerwh;
                var eachlen = this.dam.MAXDMHG / splitnum;
                //水尺
                var waterruler = [];
                waterruler.push(beginpt);
                waterruler.push([beginpt[0],
                    [beginpt[1] + this.dam.MAXDMHG]
                ]);
                waterruler.push([beginpt[0] + rulerwidth, [beginpt[1] + this.dam.MAXDMHG]]);
                waterruler.push([beginpt[0] + rulerwidth, beginpt[1]]);
                //水尺本身
                this.damContainer.addChild(new Rect({
                    allpt: waterruler,
                    style: {
                        fillColor: "#4B86AD",
                        // fillColor: "#2E6FE5",
                        brushType: "fill"
                    }
                }));
                //水尺上的横线和数字
                var y, tt;
                for (var i = 0; i < splitnum; i++) {
                    y = beginpt[1] + eachlen * i;
                    //处理水位标识和分段之前的关系
                    tt = DMBTEL + eachlen * (i + 1);
                    this.damContainer.addChild(new Line({
                        beginpt: [beginpt[0], y],
                        endpt: [beginpt[0] + rulerwidth, y],
                        style: {
                            lineColor: "white",
                            brushType: "stroke"
                        }
                    }));
                    this.damContainer.addChild(new YText({
                        beginpt: [beginpt[0] - 25, y + 5],
                        text: tt,
                        style: {
                            textColor: "black"
                        }
                    }));
                }
                // 水位标识
                var nrpllvtext = "正常蓄水位" + hych.NRPLLV ;
                var textrect = textutil.getTextRect(nrpllvtext ,0,0);
                // console.log(textrect);
                this.damContainer.addChild(this.buildWaterLevelLine({
                    beginpt: [beginpt[0] + this.rulerwh + 2, beginpt[1] + hych.NRPLLV - DMBTEL],
                    endpt: [beginpt[0] + this.rulerwh + 120, beginpt[1] + hych.NRPLLV - DMBTEL],
                    text: nrpllvtext ,
                    leftMargin: 10
                }));
                if(hych.NRPLLV - hych.DDWL < textrect.height){
                    console.log("死水位和正常蓄水位之间间距过小");
                }
                this.damContainer.addChild(this.buildWaterLevelLine({
                    beginpt: [beginpt[0] + this.rulerwh + 2, beginpt[1] + hych.DDWL - DMBTEL],
                    endpt: [beginpt[0] + this.rulerwh + 120, beginpt[1] + hych.DDWL - DMBTEL],
                    text: "死水位" + hych.DDWL,
                    leftMargin: 25
                }));
            }
        },
        //三角形的宽度和高度
        triangleWidth: 13,
        triangleHeight: 8,
        //三角形下方对应的水位刻度线最长值
        scalelinewh: 5,
        //刻度线的缩短值
        scalelinepd: 2,
        //刻度线竖向间距
        scalelinetp: 3,
        //水尺的宽度
        rulerwh: 9,
        //水尺分为多少部分
        rulersplitnm: 10,
        //三角形和文字与直线左边起点的距离

        // 建立水位标识
        buildWaterLevelLine: function(param) {
            var Triangle = require("../../shape/Triangle");
            var wlline = new Group();
            var _this = this;
            wlline.addChild(new Line({
                beginpt: param.beginpt,
                endpt: param.endpt,
                splitnum: 20,
                style:{
                    lineColor: "#003d8f"
                }
            }));
            //水位标识中的三角形
            param.leftMargin = param.leftMargin || 0;
            wlline.addChild(new Triangle({
                beginpt: [param.beginpt[0] + param.leftMargin, param.beginpt[1] + _this.triangleHeight],
                width: _this.triangleWidth,
                height: _this.triangleHeight,
                direction: "bottom",
                style: {
                    lineColor: "black"
                }
            }));
            //水位标识中的文字
            wlline.addChild(new YText({
                beginpt: [param.beginpt[0] + param.leftMargin + _this.triangleWidth + 3, param.beginpt[1]],
                text: param.text,
                style: {
                    textColor: "black",
                    textBaseline: "bottom"
                }
            }));
            //水位标识倒三角下方的三条横线
            for (var i = 0; i < 3; i++) {
                wlline.addChild(new Line({
                    beginpt: [param.beginpt[0] + param.leftMargin + i * _this.scalelinepd, param.beginpt[1] - _this.scalelinetp * (i + 1)],
                    endpt: [param.beginpt[0] + param.leftMargin + i * _this.scalelinepd + (3 - i) * _this.scalelinewh,
                        param.beginpt[1] - _this.scalelinetp * (i + 1)
                    ],
                    style: {
                        lineColor: "black"
                    },
                }));
            }
            return wlline;
        }
    };

    return damView;
});

/**
 * 该类的唯一作用是打包时用来引入所有需要打包的组件。
 * 对于依赖于requirejs版本的打包，该文件依赖的组件都会被包含进来。
 * 对于打包成不依赖requirejs的版本，该文件导出的接口就是通过浏览器的YH全局变量访问到的接口。
 * 打包文件详情见 /build/
 */
define(
    'main',["Ycharts","./shape/Bezier","./shape/Circle","./shape/Line","./shape/Rect","./shape/Triangle",
    "./shape/YText","./extend/dam/dam" ,"./Group"],

    function(Ycharts ,Bezier ,Circle ,Line ,Rect ,Triangle ,YText ,Dam
    ,Group){
        function _YCharts(){

        }
        _YCharts.prototype = {
            constructure: _YCharts
        };
        
        _YCharts.ycharts = Ycharts;

        _YCharts.Group = Group;

        _YCharts.shape ={
            Bezier: Bezier,
            Circle: Circle,
            Line: Line,
            Rect: Rect,
            Triangle: Triangle,
            YText: YText,
            Dam: Dam
        };


        return _YCharts;
});//The modules for your project will be inlined above
//this snippet. Ask almond to synchronously require the
//module value for 'main' here and return it as the
//value to use for the public API for the built file.

    return require("main");
}));