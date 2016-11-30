(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ychart"] = factory();
	else
		root["ychart"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Ycharts = __webpack_require__(1);
	
	var _Ycharts2 = _interopRequireDefault(_Ycharts);
	
	var _Bezier = __webpack_require__(23);
	
	var _Bezier2 = _interopRequireDefault(_Bezier);
	
	var _Circle = __webpack_require__(32);
	
	var _Circle2 = _interopRequireDefault(_Circle);
	
	var _Line = __webpack_require__(33);
	
	var _Line2 = _interopRequireDefault(_Line);
	
	var _Rect = __webpack_require__(34);
	
	var _Rect2 = _interopRequireDefault(_Rect);
	
	var _Triangle = __webpack_require__(35);
	
	var _Triangle2 = _interopRequireDefault(_Triangle);
	
	var _YText = __webpack_require__(36);
	
	var _YText2 = _interopRequireDefault(_YText);
	
	var _Image = __webpack_require__(37);
	
	var _Image2 = _interopRequireDefault(_Image);
	
	var _Group = __webpack_require__(4);
	
	var _Group2 = _interopRequireDefault(_Group);
	
	var _animation = __webpack_require__(38);
	
	var _animation2 = _interopRequireDefault(_animation);
	
	var _viewBuilder = __webpack_require__(25);
	
	var _viewBuilder2 = _interopRequireDefault(_viewBuilder);
	
	var _debug = __webpack_require__(24);
	
	var _debug2 = _interopRequireDefault(_debug);
	
	var _text = __webpack_require__(30);
	
	var _text2 = _interopRequireDefault(_text);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_Ycharts2.default.shape = { Bezier: _Bezier2.default, Circle: _Circle2.default, Line: _Line2.default, Rect: _Rect2.default, Triangle: _Triangle2.default, YText: _YText2.default, Image: _Image2.default }; /**
	                                                                                                                                                                                                             * 库的入口接口。 提供所有外部接口
	                                                                                                                                                                                                             * @module ychart/index
	                                                                                                                                                                                                             */
	
	
	_Ycharts2.default.Group = _Group2.default;
	
	_Ycharts2.default.version = 1.0;
	
	_Ycharts2.default.Animation = _animation2.default;
	
	_Ycharts2.default.textutil = _text2.default;
	
	_Ycharts2.default.extendView = function (config) {
	  //自定义视图时一定要校验是否传入全部必须的参数
	  var isDebug = _debug2.default.open;
	  _debug2.default.open = true;
	  var customView = _viewBuilder2.default.baseContextViewExtend(config);
	  _debug2.default.open = isDebug;
	  return customView;
	};
	
	/**
	 * @todo  Group在变换时如何清楚已绘制的图形？
	 * layer变换时如何清楚已绘制的图形？
	 * 三者与元素的绘制能否统一？
	 * painter,layer代码能够优化下，变量命令不规范？
	 */

	exports.default = _Ycharts2.default;
	module.exports = exports["default"];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _Storage = __webpack_require__(2);
	
	var _Storage2 = _interopRequireDefault(_Storage);
	
	var _Painter = __webpack_require__(12);
	
	var _Painter2 = _interopRequireDefault(_Painter);
	
	var _Reactor = __webpack_require__(15);
	
	var _Reactor2 = _interopRequireDefault(_Reactor);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * @classdesc ychart绘图实例的类。在页面上调用YH.init后返回的就是该类的一个实例
	 * @class YCharts
	 * @param eleid {string}  放置canvas的容器。 不能是canvas元素， 必须设置宽度和高度
	 * @constructor
	 */
	var YCharts = function YCharts(eleid) {
	    //当前实例绑定的页面元素ID
	    this.domid = eleid;
	
	    //存储所有绘图相关组件。
	    this.__storage = new _Storage2.default(this);
	
	    //绘图具体操作类。 与storage交互
	    this.__painter = new _Painter2.default(this, this.__storage);
	
	    //事件相关操作
	    this.__handler = new _Reactor2.default(this.domid, this.__painter, this.__storage);
	};
	
	/**
	 * 清除ychart实例所管理的所有内容。 调用该方法后所有保存的数据以及绘图情况都将被清除
	 */
	/**
	 * 绘图核心控制模块
	 * @module ychart/Ychart
	 */
	YCharts.prototype.clear = function () {
	    this.__painter.clean();
	    this.__storage.clean();
	    this.__handler.depose();
	};
	
	/**
	 * 清除当前的canvas内容，但是将保留其他的配置数据等等。
	 * 常用于ychart实例在缩放时需要清除页面上已绘制的数据
	 * 的情况下
	 */
	YCharts.prototype.cleanPainter = function () {
	    this.__painter.cleanPainter();
	};
	
	/**
	 * 添加子元素。 子元素可以是任意的shpae或者Group或者自定义的类型
	 */
	YCharts.prototype.add = function (el) {
	    this.__storage.addEle(el);
	    return this;
	};
	
	/**
	 * 刷新当前实例，调用该方法会导致所有变换被计算并且实际应用到canvas的
	 * 上下文中，并且所有可见可绘制的图形都将被绘制
	 */
	YCharts.prototype.BrushAll = function () {
	    this.__painter.refresh();
	    return this;
	};
	
	/**
	 * 更新当前实例，同
	 *@see {@link BrushAll}
	 */
	YCharts.prototype.update = function () {
	    this.BrushAll();
	};
	
	YCharts.prototype.resize = function (wh, ht) {
	    this.__painter.resize(wh, ht);
	};
	
	/**
	 * 获取当前ychart容器的宽度
	 */
	YCharts.prototype.getWidth = function () {
	    return this.__painter.getWidth();
	};
	
	/**
	 * 获取当前canvas容器的高度
	 */
	YCharts.prototype.getHeight = function () {
	    return this.__painter.getHeight();
	};
	
	var instances = {};
	
	/**
	 * ychart全局入口对象。
	 * @global
	 * @class
	 */
	var ychart = {
	    /**
	     * ycharts外部访问接口。 用于统一管理所有用到的ycharts实例
	     * @param id  容器ID
	     * @param config 相关配置
	     * @returns {YCharts}
	     */
	    init: function init(id, config) {
	        document.getElementById(id).innerHTML = "";
	        var _charts = new YCharts(id, config);
	        instances[id] = _charts;
	        return _charts;
	    },
	    /**
	     * 销毁指定的ychart实例
	     * @param {number} id ychart实例ID
	     */
	    depose: function depose(id) {
	        if (instances[id]) {
	            instances[id].clean();
	            instances[id] = null;
	        }
	    }
	};
	
	exports.default = ychart;
	module.exports = exports["default"];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _util = __webpack_require__(3);
	
	var _Group = __webpack_require__(4);
	
	var _Group2 = _interopRequireDefault(_Group);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 *
	 * 存储器
	 * @class
	 * @classdesc 存储器类。 负责存储整个ychart实例中所有信息。
	 * @param yh {module:ychart/Ychart} ychart实例
	 * @constructor
	 */
	/**
	 * 绘图中绘制存储器模块。 负责处理不同绘图层、统一绘图层不同显示级别的关系
	 * @module ychart/storage
	 *
	 */
	var Storage = function Storage(yh) {
	
	    //ycharts实例
	    this._yh = yh;
	
	    //保存所有的形状组件
	    this._roots = [];
	};
	
	/**
	 * 添加一个子元素
	 * @param element {module:ychart/core/graphic/element} 元素实例
	 */
	Storage.prototype.addEle = function (element) {
	    if (!element || element.id === null) {
	        return;
	    }
	    var index, i;
	    for (index = 0; index < this._roots.length; index++) {
	        i = this._roots[index];
	        if (i.id == element.getId()) {
	            return;
	        }
	    }
	    element.setDefaultConfig({
	        yh: this._yh,
	        height: this._yh.getHeight()
	    });
	
	    //group当成一个元素便于管理
	    this._roots.push(element);
	};
	
	/**
	 * 获取所有可绘制的图形列表。 组的所有子元素被提取出来。
	 * @returns {Array.<module:ychart/core/graphic/element>}
	 */
	Storage.prototype.getDisplayableShapeList = function () {
	    var list = [];
	    var _getList = function _getList(root) {
	        if ((0, _util.isArr)(root)) {
	            for (var i = 0; i < root.length; i++) {
	                if (root[i] instanceof _Group2.default) {
	                    _getList(root[i].children);
	                } else if (root[i].ignore === false) {
	                    list.push(root[i]);
	                }
	            }
	        } else if (root instanceof _Group2.default) {
	            _getList(root.children);
	        }
	    };
	
	    _getList(this._roots);
	
	    return list;
	};
	
	/**
	 * 清楚存储器
	 */
	Storage.prototype.clean = function () {
	    this._roots = [];
	};
	
	exports.default = Storage;
	module.exports = exports["default"];

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	exports.isType = isType;
	exports.forEach = forEach;
	exports.checkNull = checkNull;
	exports.mergeItem = mergeItem;
	exports.merge = merge;
	exports.replaceattr = replaceattr;
	exports.isArr = isArr;
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
	function isType(type) {
	    return function (ele) {
	        return !checkNull(ele) && Object.prototype.toString.call(ele) == "[object " + type + "]";
	    };
	}
	
	function forEach(ele, ctx, cb) {
	    if (isType("Array")(ele)) {
	        ele.forEach(function (item, index) {
	            cb.call(ctx, item, index);
	        });
	    } else if (isType("Object")(ele)) {
	        var it,
	            index = 0;
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
	function checkNull(which) {
	    return !which || typeof which == "undefined" || which == "null";
	}
	
	/**
	 * 按照指定key合并两个对象
	 * @param target
	 * @param source
	 * @param key
	 * @param overwrite
	 */
	function mergeItem(target, source, key, overwrite) {
	    if (source.hasOwnProperty(key) && !(source[key] == null)) {
	        var targetProp = target[key];
	        if ((typeof targetProp === "undefined" ? "undefined" : _typeof(targetProp)) == "object") {
	            // 如果需要递归覆盖，就递归调用merge
	            merge(target[key], source[key], overwrite);
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
	function merge(target, source, overwrite, map) {
	    if (checkNull(target)) {
	        target = {};
	    }
	    if (isArr(source)) {
	        source.forEach(function (item) {
	            return merge(target, item, overwrite, map);
	        });
	    } else {
	        map && replaceattr(source, map);
	
	        for (var i in source) {
	            mergeItem(target, source, i, overwrite);
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
	function replaceattr(target, map) {
	    if (map && target) {
	        for (var tg in target) {
	            if (map.hasOwnProperty(tg) && map[tg] != tg) {
	                // 将target中的属性名替换为对应的映射后的名字
	                target[map[tg]] = target[tg];
	                target[tg] = null;
	            }
	        }
	    }
	    return target;
	}
	
	function isArr(obj) {
	    return isType("Array")(obj);
	}
	
	var isFunc = exports.isFunc = isType("Function"),
	    isObj = exports.isObj = isType("Object");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _util = __webpack_require__(3);
	
	var _klass = __webpack_require__(5);
	
	var _transform = __webpack_require__(6);
	
	var _transform2 = _interopRequireDefault(_transform);
	
	var _moveable = __webpack_require__(9);
	
	var _moveable2 = _interopRequireDefault(_moveable);
	
	var _element = __webpack_require__(10);
	
	var _element2 = _interopRequireDefault(_element);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 元素容器类
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ychart/Group
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */
	
	
	/**
	 * @class
	 * @classdesc 元素容器类。 该类可以包含任何继承于 {@link ./core/graphic/view} 的类
	 */
	var Group = function (_Element) {
	    _inherits(Group, _Element);
	
	    /**
	     * @constructor
	     * @param {Object} options  组的配置
	     */
	    function Group(options) {
	        _classCallCheck(this, Group);
	
	        var _this = _possibleConstructorReturn(this, (Group.__proto__ || Object.getPrototypeOf(Group)).call(this, "group"));
	
	        _this.children = [];
	
	        (0, _util.merge)(_this, options, false, null);
	
	        _transform2.default.call(_this);
	        return _this;
	    }
	
	    /**
	     * 添加一个子元素
	     * @param {Element} child 子元素对象， 可以是shape中的任何元素或者自定义的元素
	     * @returns {Group}
	     */
	
	
	    _createClass(Group, [{
	        key: "add",
	        value: function add(child) {
	            var _this2 = this;
	
	            if (child == this) return;
	            this.children.forEach(function (ele) {
	                if (child.id === ele.id) {
	                    return _this2;
	                }
	            });
	            //子形状或者group的父类。 继承变换以及样式
	            child.parent = this;
	
	            this.children.push(child);
	            return this;
	        }
	    }, {
	        key: "setDefaultConfig",
	        value: function setDefaultConfig(config) {}
	    }]);
	
	    return Group;
	}(_element2.default);
	
	(0, _klass.mixin)(Group, _transform2.default, true);
	(0, _klass.mixin)(Group, _moveable2.default, true);
	
	exports.default = Group;
	module.exports = exports["default"];

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var inherit = exports.inherit = function inherit(clazz, baseClazz) {
	    var clazzPrototype = clazz.prototype;
	
	    function F() {}
	
	    F.prototype = baseClazz.prototype;
	    clazz.prototype = new F();
	
	    for (var prop in clazzPrototype) {
	        clazz.prototype[prop] = clazzPrototype[prop];
	    }
	    clazz.constructor = clazz;
	};
	
	//组合两个类。 仅组合原型的属性
	
	var mixin = exports.mixin = function mixin(target, source, overlay) {
	    source = "prototype" in source ? source.prototype : source;
	    target = "prototype" in target ? target.prototype : target;
	    _over(target, source, overlay);
	    function _over(target, source, overlay) {
	        for (var ele in source) {
	            if (ele != "constructor" && source.hasOwnProperty(ele) && (overlay ? source[ele] !== null : target[ele] === null)) {
	                target[ele] = source[ele];
	            }
	        }
	        return target;
	    }
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _matrix = __webpack_require__(7);
	
	var _matrix2 = _interopRequireDefault(_matrix);
	
	var _vector = __webpack_require__(8);
	
	var _vector2 = _interopRequireDefault(_vector);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * 元素的事件分发、变换模块.
	 * 所有事件都由handler.js分发下来。 自定义的事件也是在里面定义
	 * @module ychart/core/graphic/mixin
	 */
	
	var mIdentity = _matrix2.default.identity;
	
	var EPSILON = 5e-5;
	
	function isNotAroundZero(val) {
	    return val > EPSILON || val < -EPSILON;
	}
	
	/**
	 * 元素变换相关功能实现。 混入类
	 * @class
	 * @mixin
	 */
	var Transformable = function Transformable(opts) {
	    opts = opts || this;
	    // If there are no given position, rotation, scale
	    if (!opts.position) {
	        /**
	         * 平移
	         * @type {Array.<number>}
	         * @default [0, 0]
	         */
	        this.position = [0, 0];
	    } else {
	        this.position = opts.position;
	    }
	    if (!opts.rotation) {
	        /**
	         * 旋转
	         * @type {Array.<number>}
	         * @default 0
	         */
	        this.rotation = 0;
	    } else {
	        this.rotation = opts.rotation;
	    }
	    if (!opts.scale) {
	        /**
	         * 缩放
	         * @type {Array.<number>}
	         * @default [1, 1]
	         */
	        this.scale = [1, 1];
	    } else {
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
	Transformable.prototype.needLocalTransform = function () {
	    return isNotAroundZero(this.rotation) || isNotAroundZero(this.position[0]) || isNotAroundZero(this.position[1]) || isNotAroundZero(this.scale[0] - 1) || isNotAroundZero(this.scale[1] - 1);
	};
	
	Transformable.prototype.updateTransform = function () {
	    var parent = this.parent;
	    var parentHasTransform = parent && parent.transform;
	    var needLocalTransform = this.needLocalTransform();
	
	    var m = this.transform;
	    m = m || [];
	    if (!(needLocalTransform || parentHasTransform)) {
	        mIdentity(m);
	        return;
	    }
	
	    m = m || _matrix2.default.create();
	
	    if (needLocalTransform) {
	        this.getLocalTransform(m);
	    } else {
	        mIdentity(m);
	    }
	
	    // 应用父节点变换
	    if (parentHasTransform) {
	        if (needLocalTransform) {
	            _matrix2.default.mul(m, parent.transform, m);
	        } else {
	            _matrix2.default.copy(m, parent.transform);
	        }
	    }
	    // 保存这个变换矩阵
	    this.transform = m;
	
	    this.invTransform = this.invTransform || _matrix2.default.create();
	    _matrix2.default.invert(this.invTransform, m);
	};
	
	Transformable.prototype.getLocalTransform = function (m) {
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
	    if (scale) {
	        _matrix2.default.scale(m, m, scale);
	    }
	    if (rotation) {
	        _matrix2.default.rotate(m, m, rotation);
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
	Transformable.prototype.setTransform = function (ctx) {
	    var m = this.transform;
	    if (m) {
	        ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
	    }
	};
	
	var tmpTransform = [];
	
	/**
	 * 分解`transform`矩阵到`position`, `rotation`, `scale`
	 */
	Transformable.prototype.decomposeTransform = function () {
	    if (!this.transform) {
	        return;
	    }
	    var parent = this.parent;
	    var m = this.transform;
	    if (parent && parent.transform) {
	        // Get local transform and decompose them to position, scale, rotation
	        _matrix2.default.mul(tmpTransform, parent.invTransform, m);
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
	Transformable.prototype.transformCoordToLocal = function (x, y) {
	    var v2 = [x, y];
	    var invTransform = this.invTransform;
	    if (invTransform) {
	        _vector2.default.applyTransform(v2, v2, invTransform);
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
	Transformable.prototype.transformCoordToGlobal = function (x, y) {
	    var v2 = [x, y];
	    var transform = this.transform;
	    if (transform) {
	        _vector2.default.applyTransform(v2, v2, transform);
	    }
	    return v2;
	};
	
	exports.default = Transformable;
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * @module ychart/core/graphic/mixin/helper
	 * @see {@link ychart/core/graphic/mixin} 工具类
	 */
	
	var ArrayCtor = typeof Float32Array === 'undefined' ? Array : Float32Array;
	/**
	 * 3x2矩阵操作类
	 */
	var matrix = {
	    /**
	     * 创建一个单位矩阵
	     * @return {Float32Array|Array.<number>}
	     */
	    create: function create() {
	        var out = new ArrayCtor(6);
	        matrix.identity(out);
	
	        return out;
	    },
	    /**
	     * 设置矩阵为单位矩阵
	     * @param {Float32Array|Array.<number>} out
	     */
	    identity: function identity(out) {
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
	    copy: function copy(out, m) {
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
	    mul: function mul(out, m1, m2) {
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
	    translate: function translate(out, a, v) {
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
	    rotate: function rotate(out, a, rad) {
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
	    scale: function scale(out, a, v) {
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
	    invert: function invert(out, a) {
	
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
	
	exports.default = matrix;
	module.exports = exports['default'];

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * @module ychart/core/graphic/mixin/helper
	 * @see {@link ychart/core/graphic/mixin} 工具类
	 */
	
	/**
	 * @typedef {Float32Array|Array.<number>} Vector2
	 */
	var ArrayCtor = typeof Float32Array === 'undefined' ? Array : Float32Array;
	
	/**
	 * 二维向量类
	 */
	var vector = {
	    /**
	     * 创建一个向量
	     * @param {number} [x=0]
	     * @param {number} [y=0]
	     * @return {Vector2}
	     */
	    create: function create(x, y) {
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
	    copy: function copy(out, v) {
	        out[0] = v[0];
	        out[1] = v[1];
	        return out;
	    },
	
	    /**
	     * 克隆一个向量
	     * @param {Vector2} v
	     * @return {Vector2}
	     */
	    clone: function clone(v) {
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
	    set: function set(out, a, b) {
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
	    add: function add(out, v1, v2) {
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
	    scaleAndAdd: function scaleAndAdd(out, v1, v2, a) {
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
	    sub: function sub(out, v1, v2) {
	        out[0] = v1[0] - v2[0];
	        out[1] = v1[1] - v2[1];
	        return out;
	    },
	
	    /**
	     * 向量长度
	     * @param {Vector2} v
	     * @return {number}
	     */
	    len: function len(v) {
	        return Math.sqrt(this.lenSquare(v));
	    },
	
	    /**
	     * 向量长度平方
	     * @param {Vector2} v
	     * @return {number}
	     */
	    lenSquare: function lenSquare(v) {
	        return v[0] * v[0] + v[1] * v[1];
	    },
	
	    /**
	     * 向量乘法
	     * @param {Vector2} out
	     * @param {Vector2} v1
	     * @param {Vector2} v2
	     */
	    mul: function mul(out, v1, v2) {
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
	    div: function div(out, v1, v2) {
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
	    dot: function dot(v1, v2) {
	        return v1[0] * v2[0] + v1[1] * v2[1];
	    },
	
	    /**
	     * 向量缩放
	     * @param {Vector2} out
	     * @param {Vector2} v
	     * @param {number} s
	     */
	    scale: function scale(out, v, s) {
	        out[0] = v[0] * s;
	        out[1] = v[1] * s;
	        return out;
	    },
	
	    /**
	     * 向量归一化
	     * @param {Vector2} out
	     * @param {Vector2} v
	     */
	    normalize: function normalize(out, v) {
	        var d = vector.len(v);
	        if (d === 0) {
	            out[0] = 0;
	            out[1] = 0;
	        } else {
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
	    distance: function distance(v1, v2) {
	        return Math.sqrt((v1[0] - v2[0]) * (v1[0] - v2[0]) + (v1[1] - v2[1]) * (v1[1] - v2[1]));
	    },
	
	    /**
	     * 向量距离平方
	     * @param {Vector2} v1
	     * @param {Vector2} v2
	     * @return {number}
	     */
	    distanceSquare: function distanceSquare(v1, v2) {
	        return (v1[0] - v2[0]) * (v1[0] - v2[0]) + (v1[1] - v2[1]) * (v1[1] - v2[1]);
	    },
	
	    /**
	     * 求负向量
	     * @param {Vector2} out
	     * @param {Vector2} v
	     */
	    negate: function negate(out, v) {
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
	    lerp: function lerp(out, v1, v2, t) {
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
	    applyTransform: function applyTransform(out, v, m) {
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
	    min: function min(out, v1, v2) {
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
	    max: function max(out, v1, v2) {
	        out[0] = Math.max(v1[0], v2[0]);
	        out[1] = Math.max(v1[1], v2[1]);
	        return out;
	    }
	};
	
	vector.length = vector.len;
	vector.lengthSquare = vector.lenSquare;
	vector.dist = vector.distance;
	vector.distSquare = vector.distanceSquare;
	
	exports.default = vector;
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _util = __webpack_require__(3);
	
	/**
	 * 元素移动相关功能实现。 混入类
	 * @class
	 * @mixin
	 */
	var Moveable = function Moveable() {}; /**
	                                        * @module ychart/core/graphic/mixin
	                                        */
	
	Moveable.prototype = {
	
	    /**
	     * 拖动
	     * @param {number} dx
	     * @param {number} dy
	     */
	    drift: function drift(dx, dy) {
	        // if (!isArr(this.position)) {
	        // this.position = [0, 0];
	        // }
	
	        this.position[0] += dx;
	        this.position[1] -= dy;
	        this.__dirty = true;
	    },
	
	    /**
	     * 移动。 和drift方法完全一样
	     * @param {number} dx
	     * @param {number} dy
	     */
	    move: function move(dx, dy) {
	        this.drift(dx, dy);
	    },
	
	    /**
	     * 旋转
	     * @param {number}  x 圆心X座标
	     * @param {number}  y 圆心y座标
	     * @param {number}  angle 旋转弧度
	     */
	    rotate: function rotate(x, y, angle) {
	        // if (!isArr(this.origin)) {
	        // this.origin = [0, 0];
	        // }
	        if (!this.rotation) {
	            this.rotation = 0;
	        }
	        this.origin[0] += x;
	        this.origin[1] += y;
	        this.rotation += angle;
	
	        this.__dirty = true;
	    },
	
	    /**
	     * 缩放
	     * 注意该缩放必须是相对于某个点的. 默认情况下是[0,0] 这个肯定不是想要的结果,
	     * 必须在shape指定origin为缩放的原点
	     *
	     * @param {number}  x X方向放大比例
	     * @param {number}  y y方向放大比例
	     */
	    zoom: function zoom(x, y) {
	        this.scale[0] *= x;
	        this.scale[1] *= y;
	        this.__dirty = true;
	    }
	};
	
	exports.default = Moveable;
	module.exports = exports["default"];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * ychart库页面元素基类模块
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @module ychart/core/graphic/element
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */
	
	
	var _guid = __webpack_require__(11);
	
	var _guid2 = _interopRequireDefault(_guid);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * @classdesc 基本元素类。 整个库的所有可以独立存在并且彼此区分的单元都继承此类已获取一个独立的ID
	 * @class
	 */
	var Element = function () {
	  /**
	   * @constructor
	   * @param {String} type  元素类型. 该类型为element
	   */
	  function Element() {
	    var type = arguments.length <= 0 || arguments[0] === undefined ? "element" : arguments[0];
	
	    _classCallCheck(this, Element);
	
	    this.type = type;
	    this.id = this.type + "_" + (0, _guid2.default)();
	  }
	
	  /**
	   * 获取元素id
	   * @returns {string}  该元素的唯一ID
	   */
	
	
	  _createClass(Element, [{
	    key: "getId",
	    value: function getId() {
	      return this.id;
	    }
	  }]);
	
	  return Element;
	}();
	
	exports.default = Element;
	module.exports = exports["default"];

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var beginid = 1000;
	var guid = function guid() {
	    return beginid++;
	};
	
	exports.default = guid;
	module.exports = exports["default"];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _Layer = __webpack_require__(13);
	
	var _Layer2 = _interopRequireDefault(_Layer);
	
	var _guid = __webpack_require__(11);
	
	var _guid2 = _interopRequireDefault(_guid);
	
	var _Group = __webpack_require__(4);
	
	var _Group2 = _interopRequireDefault(_Group);
	
	var _dom = __webpack_require__(14);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * 绘图组件。
	 * 该组件控制所有元素绘制相关的处理，包括各个元素之间的层级关系、属性继承等
	 * 具体绘制的层在Layer模块中
	 * @class
	 * @classdesc 绘图器类
	 * @param yh {module:ychart/Ychart} ychart实例
	 * @param storage {module:ychart/storage}  存储器实例
	 * @constructor
	 */
	/**
	 * 绘图中绘制控制器模块
	 * @module ychart/painter
	 */
	var Painter = function Painter(yh, storage) {
	    this.__storage = storage;
	    this.__yh = yh;
	    this.origindom = document.getElementById(yh.domid);
	    var temp = (0, _dom.getPosition)(this.origindom);
	    this.width = temp.width;
	    this.height = temp.height;
	    this.left = temp.left;
	    this.top = temp.top;
	
	    // this.container = createDOM(guid() , "div" , "container" ,this.width , this.height ,"relative");
	    this.container = (0, _dom.createDOM)((0, _guid2.default)(), "div", "container", "relative", {
	        width: "100%",
	        height: "100%"
	    });
	    this.origindom.appendChild(this.container);
	    this.__layer = [];
	};
	
	/**
	 *刷新ychart实例所管理的所有元素， 该方法调用过后才会实际更改某个元素的属性。
	 * 默认情况下通过构造方法或者setOption都只是添加了配置但是没有实际计算及显示
	 */
	Painter.prototype.refresh = function () {
	    var shapeList = this.__storage.getDisplayableShapeList();
	    this.updateLayerState(shapeList);
	    var i,
	        shape,
	        layer,
	        zlevel,
	        lastZlevel = -1;
	    for (i = 0; i < shapeList.length; i++) {
	        shape = shapeList[i];
	        zlevel = shape.zLevel || 0;
	        layer = this.getLayer(zlevel);
	        //脏元素所在的layer需要清除画布过后重新绘制
	        if (lastZlevel != zlevel && layer.__dirty) {
	            layer.clear();
	            lastZlevel = zlevel;
	            layer.__dirty = false;
	        }
	        this.preProcessShapeInLayer(shape, layer);
	        shape.Brush(layer.getContext());
	        this.afterProcessShapeInLayer(shape, layer);
	    }
	};
	
	/**
	 * 更新layer状态。 计算哪些层需要清除
	 * @param shapeList {Array.<module:ychart/core/graphic/element>} 需要更新状态的元素列表
	 */
	Painter.prototype.updateLayerState = function (shapeList) {
	    var i, layer, zlevel, shape;
	    for (i = 0; i < shapeList.length; i++) {
	        shape = shapeList[i];
	        //对于每个形状来说要到具体绘制的时候才知道所属的ychart实例，所以在这里添加
	        !shape.__yh && (shape.__yh = this.__yh);
	
	        zlevel = shape.zLevel;
	        layer = this.getLayer(zlevel);
	        //已经设置过
	
	        //如果图像为脏，则需要清除当前画布
	        !layer.__dirty && (layer.__dirty = shape.__dirty);
	    }
	};
	
	/**
	 * 处理当前元素的层次结构,把当前形状的父元素与绘图层Layer关联起来
	 * @param shape {module:ychart/core/graphic/element} 元素实例
	 * @param layer {module:ychart/layer} 绘图层
	 */
	Painter.prototype.preProcessShapeInLayer = function (shape, layer) {
	    var _preProcessShapeInLayer = function _preProcessShapeInLayer(_shape) {
	        if (_shape.parent == null) {
	            _shape.parent = layer;
	        } else if (_shape.parent instanceof _Group2.default) {
	            _groupPreProcess(_shape.parent, layer);
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
	    var _groupPreProcess = function _groupPreProcess(gp, ly) {
	        //第一个是最高级别的group,后面的都是它的子group
	        var groupquene = [];
	        var _buildGroupQuene = function _buildGroupQuene(_group) {
	            if (_group instanceof _Group2.default) {
	                groupquene.unshift(_group);
	            }
	            if (_group.parent instanceof _Group2.default) {
	                _buildGroupQuene(_group.parent);
	            }
	        };
	        _buildGroupQuene(gp);
	        var before = groupquene[0];
	        groupquene.forEach(function (item, index) {
	            if (index === 0) {
	                item.parent = ly;
	            } else {
	                item.parent = before;
	            }
	            before = item;
	            //更新组的变换
	            item.updateTransform();
	        });
	    };
	
	    _preProcessShapeInLayer(shape);
	};
	
	/**
	 * 处理元素层次结构后的回调
	 * @param shape {module:ychart/core/graphic/element} 元素实例
	 * @param layer {module:ychart/layer} 绘图层
	 */
	Painter.prototype.afterProcessShapeInLayer = function (shape) {
	    shape.__dirty = false;
	};
	
	/**
	 * 获取指定zLevel的yaler，如果该zLevel不存在，就创建一个新的Layer实例并添加到绘图器
	 * @param zLevel {string} 绘图所在层级， 整数
	 * @return {module::ychart/layer} Layer实例
	 */
	Painter.prototype.getLayer = function (zLevel) {
	    var layer = this.__layer[zLevel];
	    if (!layer) {
	        layer = new _Layer2.default((0, _guid2.default)() + "-zlevel", zLevel, {
	            width: this.getWidth(),
	            height: this.getHeight(),
	            left: 0,
	            top: 0
	        });
	        this.insertLayer(zLevel, layer);
	        this.__layer[zLevel] = layer;
	    }
	    return layer;
	};
	
	/**
	 * 获取容器宽度
	 * @returns {integer} 容器宽
	 */
	Painter.prototype.getWidth = function () {
	    return this.width;
	};
	
	/**
	 * 获取容器高度
	 * @returns {integer} 容器高
	 */
	Painter.prototype.getHeight = function () {
	    return this.height;
	};
	
	/**
	 * 清楚当前绘图实例。
	 * 该方法将清楚容器中所添加的canvas元素及其他任何DOM元素，如果要再次使用必须重新实例化
	 */
	Painter.prototype.clean = function () {
	    this.width = null;
	    this.height = null;
	
	    //删除创建的canvas元素
	    this.origindom.innerHTML = "";
	    this.origindom = null;
	};
	
	/**
	 * 清除画布中的内容，不会影响到其他事件或者内容
	 */
	Painter.prototype.cleanPainter = function () {
	    this.__layer.forEach(function (la) {
	        return la.clear();
	    });
	};
	
	/**
	 * 改变当前容器的大小,该方法会导致整个ychart控制的容器的实际大小也对应改变
	 * 实际实现是通过Layer模块实现
	 * 该方法与room方法的不同的是该方法会改变容器即canvas的大小
	 * @param {Number} width 目标宽度
	 * @param {Number} height 目标高度
	 */
	Painter.prototype.resize = function (width, height) {
	    this.__layer.forEach(function (la) {
	        la.resize(width, height);
	    });
	    this.width = width;
	    this.height = height;
	    this.refresh();
	};
	
	/**
	 * 在文档中插入指定的layer节点
	 * @param zLevel {string} 绘图所在层级， 整数
	 * @param layer {module::ychart/layer} Layer实例
	 */
	Painter.prototype.insertLayer = function (zLevel, layer) {
	    var dom = layer.dom;
	    if (this.__layer.length !== 0) {
	        var children = this.container.getElementsByTagName("canvas");
	        var i, len, child;
	        for (i = 0, len = children.length; i < len; i++) {
	            child = children[i];
	            if (zLevel < parseInt(child.getAttribute("zLevel"))) {
	                child.parentNode.insertBefore(dom, child);
	                children = null;
	                return;
	            }
	        }
	    }
	    this.container.appendChild(dom);
	};
	
	exports.default = Painter;
	module.exports = exports["default"];

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 代表canvas中一个绘图层。 与具体形状的关系仅仅是当前layer所处的zIndex
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @module ychart/layer
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */
	
	
	var _util = __webpack_require__(3);
	
	var _dom = __webpack_require__(14);
	
	var _moveable = __webpack_require__(9);
	
	var _moveable2 = _interopRequireDefault(_moveable);
	
	var _transform = __webpack_require__(6);
	
	var _transform2 = _interopRequireDefault(_transform);
	
	var _klass = __webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 *
	 * @class
	 * @classdesc 一个绘图层。 对应DOM上一个canvas元素。
	 *   每一个layer都有自己独立和样式。 不同layer之间的前后关系由Storage模块处理。 layer的具体绘制由Painter处理
	 */
	var Layer = function () {
	
	    /**
	    * @param id {string} Layer的ID
	    * @param zLevel {Number}  所属的zLevel，决定了该层的显示位置
	    * @param opts {object}
	    * @constructor
	    */
	    function Layer(id, zLevel, opts) {
	        _classCallCheck(this, Layer);
	
	        //当前层的ID
	        this.id = id;
	        //当前层的实际DOM. 也就是一个canvas元素实例
	        this.dom = document.getElementById(id);
	        //当前层的前后顺序.
	        this.zLevel = zLevel;
	
	        if ((0, _util.checkNull)(this.dom)) {
	            this.dom = (0, _dom.createDOM)(id, "canvas", "layer", "absolute", { left: opts.left || 0, top: opts.top || 0 }, { width: opts.width, height: opts.height });
	        }
	
	        this.dom.setAttribute("zLevel", zLevel);
	
	        this.ctx = (0, _dom.getContext)(this.dom);
	
	        this.layerW = opts.width;
	        this.layerH = opts.height;
	
	        if ((0, _util.checkNull)(this.ctx)) {
	            alert("浏览器不支持HTML5 canvas,初始化ychart失败 . 请更新浏览器 ");
	            return;
	        }
	
	        //当前画布由于包含的图形有变化需要清除后重新绘制
	        this.__dirty = false;
	
	        _transform2.default.call(this);
	    }
	
	    /**
	     * 获取当前层的zlevel
	     * @return {Number} zLevel  所在层级
	     */
	
	
	    _createClass(Layer, [{
	        key: "getZlevel",
	        value: function getZlevel() {
	            return this.zLevel;
	        }
	
	        /**
	         * 获取当前绘图层的上下文
	         * @returns {CanvasRenderingContext2D}
	         */
	
	    }, {
	        key: "getContext",
	        value: function getContext() {
	            return this.ctx;
	        }
	
	        /**
	         * 清除当前layer所有的绘制的内容
	         */
	
	    }, {
	        key: "clear",
	        value: function clear() {
	            this.ctx.clearRect(0, 0, this.layerW, this.layerH);
	        }
	
	        /**
	         * 改变当前layer的大小。 该操作实际上是通过计算目标大小与当前的canvas大小
	         * 然后按照对应的比例进行缩放实现的。  同时，也会改变canvas本身的大小
	         * @param {Number} width  目标宽度
	         * @param {Number} height  目标高度
	         */
	
	    }, {
	        key: "resize",
	        value: function resize(width, height) {
	            var dx = width / this.layerW,
	                dy = height / this.layerH;
	
	            this.zoom(dx, dy);
	
	            //由于layer始终会是最根部的一个元素，所以它的变换需要手动调用。
	            //而对于Group的变换，只有在确定了它所处的层级过后才能更新变换
	            this.updateTransform();
	
	            this.dom.width = width;
	            this.dom.height = height;
	            this.layerW = width, this.layerH = height;
	        }
	    }]);
	
	    return Layer;
	}();
	
	(0, _klass.mixin)(Layer, _transform2.default, true);
	(0, _klass.mixin)(Layer, _moveable2.default, true);
	
	exports.default = Layer;
	module.exports = exports["default"];

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	function parseInt10(val) {
	    return parseInt(val, 10);
	}
	var getPosition = exports.getPosition = function getPosition(id) {
	    var element = typeof id == "string" ? document.getElementById(id) : id;
	    var st = document.defaultView.getComputedStyle(element);
	
	    var rect = element.getBoundingClientRect();
	    var scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
	    var scrollLeft = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft;
	    return {
	        width: element.clientWidth || parseInt10(st.width) || parseInt10(element.style.width) - (parseInt10(st.paddingLeft) || 0) - parseInt10(st.paddingRight) || 0,
	
	        height: element.clientHeight || parseInt10(st.height) || parseInt10(element.style.height) - (parseInt10(st.paddingTop) || 0) - parseInt10(st.paddingBottom) || 0,
	        top: rect.top + scrollTop,
	        left: rect.left + scrollLeft
	    };
	};
	
	var CACHE = {};
	
	var getRectByCtx = exports.getRectByCtx = function getRectByCtx(context) {
	    var canvas = context.canvas;
	    if (CACHE[canvas]) {
	        return CACHE[canvas];
	    }
	    CACHE[canvas] = [canvas.width, canvas.height];
	    return CACHE[canvas];
	};
	
	var doc = exports.doc = function doc(id) {
	    return document.getElementById(id);
	};
	
	/* eslint-disable */
	var createDOM = exports.createDOM = function createDOM(id, type, desc, pos, style, attr) {
	    var newdom = document.createElement(type);
	    var st = newdom.style;
	    st.position = typeof pos === "undefined" ? "absolute" : pos;
	    if (style) {
	        for (var item in style) {
	            if (isNaN(style[item])) {
	                st[item] = style[item];
	            } else {
	                st[item] = style[item] + "px";
	            }
	        }
	    }
	    if (attr) {
	        for (var _item in attr) {
	            newdom[_item] = attr[_item];
	        }
	    }
	    newdom.setAttribute("ychart-" + desc, id);
	    return newdom;
	};
	
	var getContext = exports.getContext = function getContext(drawing) {
	    if (drawing && drawing.getContext) {
	        return drawing.getContext("2d");
	    }
	    return null;
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _event = __webpack_require__(16);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _draggable = __webpack_require__(17);
	
	var _draggable2 = _interopRequireDefault(_draggable);
	
	var _htmlView = __webpack_require__(19);
	
	var _htmlView2 = _interopRequireDefault(_htmlView);
	
	var _config = __webpack_require__(21);
	
	var _dom = __webpack_require__(14);
	
	var _lang = __webpack_require__(22);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	//所有捕获的事件名称
	/**
	 * 全局事件分发程序，负责绑定事件到canvas元素上以及分发下去
	 * @module ychart/Handler
	 */
	
	var ALL_EVENT_NAMES = ["click", "mousedown", "mousemove", "mouseup", "focus"];
	
	//自定义的一些事件处理函数
	var SPECIAL_EVENT_HANDLERS = {
	
	    //上一个获取焦点的元素
	    _lastHovered: null,
	
	    //全局消息提示组件
	    htmlView: null,
	
	    //鼠标移动事件捕获及分发
	    mousemove: function mousemove(exEvent) {
	
	        var ev = exEvent,
	            obj = exEvent.targetEle;
	        //判断和之前获取焦点的是否是同一个形状
	        if (this._lastHovered != null && this._lastHovered != obj) {
	            this.triggerProxy(this._lastHovered, "blur", ev);
	        }
	        //某个形状处于焦点中
	        if (obj) {
	            //分发该元素的鼠标移动事件
	            this.triggerProxy(obj, "mousemove", ev);
	
	            //处理鼠标在元素上的消息提示
	            if (obj.config.tip) {
	                if (!this.htmlView) {
	                    this.htmlView = new _htmlView2.default({
	                        left: exEvent.clientX + _config.DEFAULT_CONFIG.tipoffsetX,
	                        top: exEvent.clientY + _config.DEFAULT_CONFIG.tipoffsetY
	                    });
	                } else {
	                    this.htmlView.move(exEvent.clientX + _config.DEFAULT_CONFIG.tipoffsetX, exEvent.clientY + _config.DEFAULT_CONFIG.tipoffsetY);
	                }
	                if (this._lastHovered != obj) this.htmlView.info(obj.config.tip);
	                this.htmlView.show();
	            } else {
	                this.htmlView && this.htmlView.hide();
	            }
	        } else {
	            //隐藏消息提示
	            this.htmlView && this.htmlView.hide();
	        }
	        this._lastHovered = obj;
	    },
	
	    mouseout: function mouseout(exEvent) {
	        var ev = exEvent;
	        if (this._lastHovered != null) {
	            this.triggerProxy(this._lastHovered, "globalout", ev);
	        }
	        this._lastHovered = null;
	        this.htmlView && this.htmlView.hide();
	    }
	
	};
	
	//通用事件处理函数
	var COMMON_EVENT_HANDLER = function COMMON_EVENT_HANDLER(name) {
	    return function (exEvent) {
	
	        var ev = exEvent,
	            obj = ev.targetEle;
	
	        //某个形状处于焦点中并且可以捕获事件
	        if (obj) {
	            //分发该元素的获取焦点事件
	            this.triggerProxy(obj, name, ev);
	        }
	    };
	};
	
	/**
	 * @class
	 * @classdesc 管理一个ychart实例的所有事件捕获及其分发
	 * @param root {HTMLElement}  实际容器ID
	 * @param painter {module:ychart/painter} 绘图器实例
	 * @param storage {module:ychart/storage} 存储器实例
	 */
	var handlers = function handlers(root, painter, storage) {
	    //存储器
	    this.__storage = storage;
	
	    //绘图器
	    this.__painter = painter;
	
	    //实际事件响应容器
	    this.root = (0, _dom.doc)(root);
	
	    //事件处理程序
	    this._handlers = {};
	
	    //拖动管理。 只需要调用它的事件分发函数即可
	    this._dragmanager = new _draggable2.default();
	
	    this.initHandlers();
	};
	
	/**
	 * 初始化事件处理程序及绑定事件。
	 * this._handlers保存着所有的事件处理函数
	 */
	handlers.prototype.initHandlers = function () {
	    var _this = this;
	
	    ALL_EVENT_NAMES.forEach(function (eventName) {
	        //具体的事件处理函数
	        var eventHandler = SPECIAL_EVENT_HANDLERS[eventName] === undefined ? COMMON_EVENT_HANDLER(eventName) : SPECIAL_EVENT_HANDLERS[eventName];
	        //绑定事件处理函数的作用域为handler类.
	        _this._handlers[eventName] = (0, _lang.bind1Arg)(function (event) {
	
	            //获取自定义事件
	            var exEvent = _this.extendAndFixEventPackge(event);
	
	            //调用事件处理函数
	            eventHandler.call(_this, exEvent);
	
	            //拖动管理。 元素拖动相关的事件由这里面发出去。
	            _this._dragmanager.trigger(eventName, exEvent);
	        }, _this);
	        _event2.default.addHandler(_this.root, eventName, _this._handlers[eventName]);
	    });
	};
	
	/**
	 * 自定义事件对象
	 * @param event {Event} 原始事件对象
	 * @returns {exEvent}
	 */
	handlers.prototype.extendAndFixEventPackge = function (event) {
	    //座标转换
	    event = _event2.default.clientToLocal(this.root, event, event);
	
	    //目标元素
	    event.targetEle = this.getHoverElement(event);
	
	    return event;
	};
	
	/**
	 * 事件分发代理器。 该方法会把事件分发到某个元素中，然后由元素自身分发到注册的事件处理函数并且调用。
	 * @param element {module:ychart/core/graphic/element}  响应事件的元素
	 * @param eventName {string}  事件名称
	 * @param exEvent  {exEvent} 扩充的事件对象
	 */
	handlers.prototype.triggerProxy = function (element, eventName, exEvent) {
	    element.trigger && element.trigger(eventName, exEvent, element.config);
	};
	
	/**
	 * 获取当前鼠标所在位置覆盖的最上层元素
	 * @param exEvent  {exEvent} 扩充的自定义事件对象
	 * @return {module:ychart/core/graphic/element || null} 元素对象或者null
	 */
	handlers.prototype.getHoverElement = function (exEvent) {
	    var shapes = this.__storage.getDisplayableShapeList();
	    for (var i = shapes.length - 1; i >= 0; i--) {
	        var sp = shapes[i];
	        if (sp.contain(exEvent.ycX, exEvent.ycY)) {
	            return sp;
	        }
	    }
	    return null;
	};
	
	handlers.prototype.depose = function () {
	    for (var event in this._handlers) {
	        _event2.default.removeHandler(this.root, event, this._handlers[event]);
	    }
	};
	
	exports.default = handlers;
	module.exports = exports["default"];

/***/ },
/* 16 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var ClientToLocal = function ClientToLocal(el, e, out) {
	    out = out || {};
	    var box = el.getBoundingClientRect();
	    out.ycX = e.clientX - box.left;
	    out.ycY = e.clientY - box.top;
	
	    return out;
	};
	
	exports.default = {
	    addHandler: function addHandler(element, type, handler) {
	        element.addEventListener(type, handler, false);
	    },
	    removeHandler: function removeHandler(element, type, handler) {
	        element.removeEventListener(type, handler);
	    },
	    getEvent: function getEvent(event) {
	        return event ? event : window.event;
	    },
	    getTarget: function getTarget(event) {
	        return event.target || event.srcElement;
	    },
	    preventDefault: function preventDefault(event) {
	        if (event.preventDefault) {
	            event.preventDefault();
	        } else {
	            event.returnValue = false;
	        }
	    },
	    stopPropagation: function stopPropagation(event) {
	        if (event.stopPropagation) {
	            event.stopPropagation();
	        } else {
	            event.cancelBubble = true;
	        }
	    },
	    stop: function stop(event) {
	        this.preventDefault(event);
	        this.stopPropagation(event);
	    },
	    clientToLocal: ClientToLocal
	};
	module.exports = exports["default"];

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _eventful = __webpack_require__(18);
	
	var _eventful2 = _interopRequireDefault(_eventful);
	
	var _klass = __webpack_require__(5);
	
	var _config = __webpack_require__(21);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var target;
	
	/**
	 * 拖动的实现类。 由于该类仅需要一个实例，所以没有做成混合类
	 * @class
	 * @constructor
	 */
	/**
	 * @module ychart/core/graphic/mixin
	 */
	
	var Draggable = function Draggable() {
	    _eventful2.default.call(this);
	
	    this.on("mousedown", this._dragStart, this);
	    this.on("mousemove", this._dragIng, this);
	    this.on("mouseup", this._dragEnd, this);
	    this.on("globalout", this._dragEnd, this);
	};
	
	Draggable.prototype = {
	    constructor: Draggable,
	
	    _dragDelay: 100,
	
	    _lastClickTime: null,
	
	    /**
	     * 开始拖动
	     * @param {event} exEvent  加入了自定义项的扩展事件对象
	     * @private
	     */
	    _dragStart: function _dragStart(exEvent) {
	        target = exEvent.targetEle;
	        this._lastClickTime = new Date();
	        if (target) {
	            this._x = exEvent.offsetX;
	            this._y = exEvent.offsetY;
	            this._dragingTarget = target;
	            this.trigger(target, "dragStart", exEvent);
	        }
	    },
	
	    /**
	     * 拖动中
	     * @param {event} exEvent  加入了自定义项的扩展事件对象
	     * @private
	     */
	    _dragIng: function _dragIng(exEvent) {
	        var ele = exEvent.targetEle;
	        target = this._dragingTarget;
	        var crt = new Date();
	        crt = crt - this._lastClickTime;
	        if (ele) {
	            if (ele.draggable) exEvent.target.style.cursor = _config.DEFAULT_CONFIG.cursor_moveable;else exEvent.target.style.cursor = _config.DEFAULT_CONFIG.cursor_getable;
	        } else {
	            exEvent.target.style.cursor = _config.DEFAULT_CONFIG.cursor_default;
	        }
	
	        if (target && target.draggable && crt >= this._dragDelay) {
	
	            var x = exEvent.offsetX;
	            var y = exEvent.offsetY;
	
	            var dx = x - this._x;
	            var dy = y - this._y;
	            this._x = x;
	            this._y = y;
	            target.drift(dx, -dy);
	            this.trigger(target, "draging", exEvent);
	            // 更新视图
	            target.RebrushAll();
	        }
	    },
	
	    /**
	     * 拖动完成
	     * @param {event} exEvent  加入了自定义项的扩展事件对象
	     * @private
	     */
	    _dragEnd: function _dragEnd(exEvent) {
	        exEvent.target.style.cursor = _config.DEFAULT_CONFIG.cursor_default;
	        target = this._dragingTarget;
	        if (target) {
	            target.dragging = false;
	            this.trigger(target, "dragend", exEvent);
	        }
	
	        this._dragingTarget = null;
	    }
	};
	
	(0, _klass.mixin)(Draggable, _eventful2.default, true);
	
	exports.default = Draggable;
	module.exports = exports["default"];

/***/ },
/* 18 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * @module ychart/core/graphic/mixin
	 */
	
	/**
	 * 事件分发Dispatch。用于页面上不同对象之间事件绑定及分发。
	 * 与具体的事件无关系。 就是Reactor模式中的Dispatch
	 * @class
	 * @mixin
	 */
	var Eventful = function Eventful() {
	    this._handlers = {};
	};
	
	/**
	 * 绑定某个处理函数到某个事件上
	 * @param event  事件名称
	 * @param handler 处理函数
	 * @param context 处理函数调用的上下文
	 * @returns {Eventful}
	 */
	Eventful.prototype.on = function (event, handler, context) {
	    var h = this._handlers;
	    if (!h || !event || !handler) {
	        return this;
	    }
	
	    if (!h[event]) {
	        h[event] = [];
	    }
	    h[event].push({
	        _h: handler,
	        _one: false,
	        _ctx: context || this //调用回调的上下文
	    });
	
	    return this;
	};
	
	/**
	 * 绑定某个处理函数到某个事件上.但是仅触发该事件一次。 trigger后删除。
	 * @param event  事件名称
	 * @param handler 处理函数
	 * @param context 处理函数调用的上下文
	 * @returns {Eventful}
	 */
	Eventful.prototype.once = function (event, handler, context) {
	    var _h = this._handlers;
	
	    if (!handler || !event) {
	        return this;
	    }
	
	    if (!_h[event]) {
	        _h[event] = [];
	    }
	
	    if (_h[event].indexOf(handler) >= 0) {
	        return this;
	    }
	
	    _h[event].push({
	        _h: handler,
	        _one: true,
	        _ctx: context || this //调用回调的上下文
	    });
	
	    return this;
	};
	
	/**
	 * 删除某个事件/某个事件的某个回调
	 * @param event 事件。 未指定将删除所有事件及对应的回调
	 * @param handler 回调  指定该值和事件，将删除该事件的该回调函数
	 * @returns {Eventful}
	 */
	Eventful.prototype.remove = function (event, handler) {
	    if (!event) {
	        this._handlers = {};
	        return this;
	    }
	
	    var hs = this._handlers[event];
	    if (handler) {
	        var i = 0;
	        for (; i < hs.length; i++) {
	            if (hs[i]._h === handler) {
	                break;
	            }
	            hs.splice(i, 1);
	        }
	        if (hs && hs.length == 0) {
	            delete this._handlers[event];
	        }
	    } else {
	        delete this._handlers[event];
	    }
	
	    return this;
	};
	
	var arrySlice = Array.prototype.slice;
	
	/**
	 * 事件分发
	 * @param eventName 事件名称
	 * @returns {Eventful}
	 */
	Eventful.prototype.trigger = function (eventName) {
	    var handles = this._handlers[eventName];
	    if (handles) {
	        var args = arguments;
	        var argLen = args.length;
	
	        if (argLen > 3) {
	            args = arrySlice.call(args, 1);
	        }
	        //来自backbone的黑魔法,效率优化,看起来很厉害的样子
	        handles.forEach(function (item, index, array) {
	            switch (argLen) {
	                case 1:
	                    item._h.call(item._ctx);
	                    break;
	                case 2:
	                    item._h.call(item._ctx, args[1]);
	                    break;
	                case 3:
	                    item._h.call(item._ctx, args[1], args[2]);
	                    break;
	                default:
	                    item._h.apply(item._ctx, args);
	                    break;
	            }
	            if (item._one) {
	                array.splice(index, 1);
	            }
	        });
	    }
	    return this;
	};
	
	exports.default = Eventful;
	module.exports = exports["default"];

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 独立的HTML元素模块，通常用于某个元素的信息展示
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @module ychart/core/graphic/htmlVIew
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */
	
	var _view = __webpack_require__(20);
	
	var _view2 = _interopRequireDefault(_view);
	
	var _dom = __webpack_require__(14);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * @private
	 */
	var DomContent = function () {
	    function DomContent(config) {
	        _classCallCheck(this, DomContent);
	
	        this._root = (0, _dom.createDOM)(config.id, "div", "htmlView", "absolute", { left: config.left, top: config.top }, { width: config.width, height: config.height });
	        this._content = document.createElement("div");
	
	        this.init(config);
	    }
	
	    _createClass(DomContent, [{
	        key: "init",
	        value: function init(config) {
	            this._root.style.border = "solid 1px #efefef";this._root.style.backgroundColor = "white";
	            this._root.style.padding = "5px";
	
	            if (config.title) this._root.appendChild(this.title);
	
	            this._root.appendChild(this._content);
	
	            if (config.footer) this._root.appendChild(this.footer);
	
	            document.body && document.body.appendChild(this._root);
	        }
	    }, {
	        key: "show",
	        value: function show() {
	            this._root.style.visibility = "visible";
	        }
	    }, {
	        key: "hide",
	        value: function hide() {
	            this._root.style.visibility = "hidden";
	        }
	    }, {
	        key: "move",
	        value: function move(x, y) {
	            this._root.style.left = x + "px";
	            this._root.style.top = y + "px";
	        }
	    }, {
	        key: "title",
	        get: function get() {
	            return document.createElement("div");
	        }
	    }, {
	        key: "content",
	        get: function get() {
	            return this._content.innerHTML;
	        },
	        set: function set(html) {
	            this._content.innerHTML = html;
	        }
	    }, {
	        key: "footer",
	        get: function get() {
	            return document.createElement("div");
	        }
	    }]);
	
	    return DomContent;
	}();
	
	/**
	 * @classdesc 绘制在HTML结构上的视图类，该类与contextView互不影响，但是通常用于
	 * ContextView的数据展示
	 * @class
	 */
	
	
	var HtmlView = function (_View) {
	    _inherits(HtmlView, _View);
	
	    function HtmlView() {
	        var option = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	        _classCallCheck(this, HtmlView);
	
	        /**
	         * 当前元素DOM结构引用
	         * @member {HTMLDOMElement}
	         */
	        var _this = _possibleConstructorReturn(this, (HtmlView.__proto__ || Object.getPrototypeOf(HtmlView)).call(this, "HtmlView", option));
	
	        _this._domcontent = new DomContent({
	            id: _this.id + "Parent",
	            width: option.width || 0,
	            height: option.height || 0,
	            left: option.left || 0,
	            top: option.top || 0
	        });
	        return _this;
	    }
	
	    /**
	     * 显示当前HtmlView
	     * @method
	     */
	
	
	    _createClass(HtmlView, [{
	        key: "show",
	        value: function show() {
	            this._domcontent.show();
	        }
	
	        /**
	         * 设置提示框的HTML内容
	         * @param info {HTMLString} HTML字符串
	         */
	
	    }, {
	        key: "info",
	        value: function info(_info) {
	            this._domcontent.content = _info;
	        }
	
	        /**
	         * 隐藏当前HtmlVIew
	         * @method
	         */
	
	    }, {
	        key: "hide",
	        value: function hide() {
	            this._domcontent.hide();
	        }
	
	        /**
	         * 移动当前提示框
	         * @param x {number} 目标X座标 绝对定位
	         * @param y {number}  目标Y座标 绝对定位
	         */
	
	    }, {
	        key: "move",
	        value: function move(x, y) {
	            this._domcontent.move(x, y);
	        }
	    }]);
	
	    return HtmlView;
	}(_view2.default);
	
	exports.default = HtmlView;
	module.exports = exports["default"];

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _element = __webpack_require__(10);
	
	var _element2 = _interopRequireDefault(_element);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 绘图基类View模块
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ychart/core/graphic/view
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */
	
	/**
	 * @class
	 * @classdesc 绘图基类。 页面上所有可以显示的绘图最小单元都必须继承该类
	 * @abstract
	 */
	var View = function (_Element) {
	  _inherits(View, _Element);
	
	  /**
	   * 构造函数
	   * @constructor
	   * @param {String} type 该类默认为view类型
	   * @param {Object} option
	   */
	  function View() {
	    var type = arguments.length <= 0 || arguments[0] === undefined ? "view" : arguments[0];
	    var option = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	    _classCallCheck(this, View);
	
	    /**
	     * 该元素是否为脏，为脏的话在下次绘图时需要重新计算和绘制
	     * @member {boolean}  默认true
	     * @private
	     */
	    var _this = _possibleConstructorReturn(this, (View.__proto__ || Object.getPrototypeOf(View)).call(this, type));
	
	    _this.__dirty = true;
	
	    /**
	     * 当前元素的父元素
	     * @member {object} 默认为null
	     */
	    _this.parent = null;
	
	    /**
	     * 当前元素是否被忽略。 被忽略的话将不会绘制在页面上
	     * @member {boolean}
	     */
	    _this.ignore = option.ignore || false;
	    return _this;
	  }
	
	  /**
	   * 绘图抽象方法。 子类必须实现该方法
	   * @abstract
	   * @param {Object} option 绘图参数
	   * @throws Error  如果子类没有实现该方法将抛出错误
	   */
	  /* eslint-disable */
	
	
	  _createClass(View, [{
	    key: "Brush",
	    value: function Brush(option) {
	      throw new Error("绘图单元必须实现该方法");
	    }
	    /* eslint-enable */
	
	  }]);
	
	  return View;
	}(_element2.default);
	
	exports.default = View;
	module.exports = exports["default"];

/***/ },
/* 21 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * 默认全局配置
	 * @global
	 * @module ychart/core/config/style
	 */
	var DEFAULT_CONFIG = exports.DEFAULT_CONFIG = {
	    //正常情况下鼠标样式
	    cursor_default: "default",
	    cursor_moveable: "move",
	    cursor_getable: "pointer",
	
	    //元素在获取焦点时显示信息提示框必须和鼠标当前位置有偏移不然元素本身将不能捕获事件
	    tipoffsetX: 10,
	    tipoffsetY: 0
	};
	
	var useRectangularCoordinateSystem = exports.useRectangularCoordinateSystem = 0;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.onImgReady = exports.bind1Arg = exports.noOp = exports.throwFunc = undefined;
	
	var _util = __webpack_require__(3);
	
	var throwFunc = exports.throwFunc = function throwFunc(str) {
	    throw str;
	};
	
	var noOp = exports.noOp = function noOp() {};
	
	var bind1Arg = exports.bind1Arg = function bind1Arg(handler, context) {
	    return function (arg1) {
	        return handler.call(context, arg1);
	    };
	};
	
	/**
	 * 判断某个元素是否加载完成
	 * @param {} ctx 回调函数的上下文
	 * @param {HTMLElement} 待加载的元素
	 * @param {Function | Array.{Function}} 成功的回调函数或者 [调用当前函数时已经加载的回调,稍后的回调]的回调函数数组
	 * @param {Function} 判断这个元素是否加载的函数
	 */
	var onreadyCallback = function onreadyCallback(ctx, element, callback, loadMethod) {
	    var notCompleteCb = (0, _util.isArr)(callback) ? callback[1] : noOp;
	    var completeCb = (0, _util.isArr)(callback) ? callback[0] : noOp;
	    if (loadMethod(element)) {
	        completeCb.call(ctx);
	        return;
	    }
	    var timer = setInterval(function () {
	        if (loadMethod(element)) {
	            notCompleteCb.call(ctx);
	            clearInterval(timer);
	            return;
	        }
	    }, 150);
	};
	
	var onImgReady = exports.onImgReady = function onImgReady(ctx, element, callback) {
	    var isImageLoaded = function isImageLoaded(imgElement) {
	        return imgElement.complete && imgElement.naturalHeight !== 0;
	    };
	    onreadyCallback(ctx, element, callback, isImageLoaded);
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _debug = __webpack_require__(24);
	
	var _debug2 = _interopRequireDefault(_debug);
	
	var _viewBuilder = __webpack_require__(25);
	
	var _viewBuilder2 = _interopRequireDefault(_viewBuilder);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * 贝塞尔曲线
	 * @module ychart/shape/Besier
	 */
	var warn = _debug2.default.warn;
	var insiderange = function insiderange(val, rg1, rg2) {
	    return val < rg1 || val > rg2;
	};
	var sqrt = function sqrt(val) {
	    return Math.sqrt(val);
	};
	var abs = function abs(val) {
	    return Math.abs(val);
	};
	var atan = function atan(val) {
	    return Math.atan(val);
	};
	var sin = function sin(val) {
	    return Math.sin(val);
	};
	var cos = function cos(val) {
	    return Math.cos(val);
	};
	var floor = function floor(val) {
	    return Math.floor(val);
	};
	var radian2angle = function radian2angle(radian) {
	    return radian * 180 / Math.PI;
	};
	
	/**
	 *
	 * @class Bezier
	 * @classdesc 绘制一条曲线路径. 调用此方法后当前的context将包含一条路径.
	 * @property {Array.number} beginpt x,y  开始点坐标
	 * @property {Array.number} endpt    x,y 结束点坐标
	 * @property {number} compact 0-10  表示该波浪线的紧凑程度,即每个弯曲的距离比例
	 * @property {number} systole 0-4 波浪的起伏程度, 表现为上下波动程度. 1为标准.小于1就是缩放.1-4就是放大
	 * @constructor Bezier
	 */
	exports.default = _viewBuilder2.default.baseContextViewExtend({
	
	    type: "BezierPath",
	
	    BuildPath: function BuildPath(ctx, config) {
	        var beginpt = config.beginpt,
	            endpt = config.endpt,
	            compact = config.compact || 5,
	            systole = config.systole;
	
	        var linequadrant = function () {
	            if (beginpt[0] < endpt[0] && beginpt[1] >= endpt[1]) return 1;
	            if (beginpt[0] >= endpt[0] && beginpt[1] > endpt[1]) return 2;
	            if (beginpt[0] > endpt[0] && beginpt[1] <= endpt[1]) return 3;
	            if (beginpt[0] <= endpt[0] && beginpt[1] < endpt[1]) return 4;
	        }();
	        var nextx = function nextx(x, dis) {
	            return beginpt[0] <= endpt[0] ? x + dis : x - dis;
	        };
	        var nexty = function nexty(y, dis) {
	            return beginpt[1] <= endpt[1] ? y + dis : y - dis;
	        };
	        var nexpt_ct = function nexpt_ct(pt, dispt, leftorright) {
	            var getrs = function getrs(disx, disy) {
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
	
	        ctx.moveTo(beginpt[0], beginpt[1]);
	        for (i = 1; i < allctpt.length; i++) {
	            ctx.quadraticCurveTo(allctpt[i - 1][0], allctpt[i - 1][1], alllinectpt[i][0], alllinectpt[i][1]);
	        }
	        ctx.quadraticCurveTo(allctpt[i - 1][0], allctpt[i - 1][1], alllinectpt[i][0], alllinectpt[i][1]);
	
	        config.style.brushType = "stroke";
	    }
	});
	module.exports = exports["default"];

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _util = __webpack_require__(3);
	
	var dbpre = "DamJs Debug Info :    ";
	var wnpre = "DamJs warn Info :    ";
	var dbprespace = function () {
	    var i = 0,
	        rs = "      ";
	    for (i = 0; i < dbpre.length; i++) {
	        rs += " ";
	    }
	    return rs;
	}();
	
	var debug = function debug(info) {
	    console.log(dbpre + info);
	};
	
	var warn = function warn(info) {
	    console.log(wnpre + info);
	};
	
	var isobj = false;
	var printobj = function printobj(obj) {
	    function _printObj(obj) {
	        var ele;
	        if ((0, _util.isObj)(obj)) {
	            for (ele in obj) {
	                if ((0, _util.isObj)(obj[ele])) {
	                    debug(ele + " : ");
	                    isobj = true;
	                    printobj(obj[ele]);
	                    isobj = false;
	                } else {
	                    if (isobj) {
	                        console.log(dbprespace + ele + " : " + obj[ele]);
	                    } else debug(ele + " : " + obj[ele]);
	                }
	            }
	        } else if ((0, _util.isArr)(obj)) {
	            var len = obj.length;
	            for (var i = 0; i < len; i++) {
	                printobj(obj[i]);
	            }
	        }
	    }
	
	    _printObj(obj);
	    isobj = false;
	};
	
	exports.default = {
	    printobj: printobj,
	    debug: debug,
	    warn: warn
	};
	module.exports = exports["default"];

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
	                                                                                                                                                                                                                                                   * 绘图元素类构造器
	                                                                                                                                                                                                                                                   * @module  ychart/graphic/viewBuilder
	                                                                                                                                                                                                                                                   */
	
	
	var _contextView = __webpack_require__(26);
	
	var _contextView2 = _interopRequireDefault(_contextView);
	
	var _util = __webpack_require__(3);
	
	var _debug = __webpack_require__(24);
	
	var _debug2 = _interopRequireDefault(_debug);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var REQUIRED_CHILD = {
	    type: "String",
	    BuildPath: "Function"
	};
	
	/**
	 * @description 基本canvas视图类创建工厂， 调用该方法并且传入如下参数即创建了一个新的视图元素
	 * @param {object} defaults 视图元素构造相关方法
	 * @returns {BaseContextView} 视图元素类
	 */
	var baseContextViewExtend = function baseContextViewExtend(defaults) {
	    if (_debug2.default.open) {
	        for (var item in REQUIRED_CHILD) {
	            if (!(0, _util.isType)(REQUIRED_CHILD[item])(defaults[item])) {
	                _debug2.default.debug("构造新形状出错，属性名称：" + item + " 属性要求的类型： " + REQUIRED_CHILD[item] + " 实际类型: " + _typeof(defaults[item]));
	                _debug2.default.printobj(defaults);
	                return null;
	            }
	        }
	    }
	
	    /**
	     * @class
	     * @classdesc ychart形状的构造类.
	     */
	
	    var BaseContextView = function (_ContextView) {
	        _inherits(BaseContextView, _ContextView);
	
	        function BaseContextView(baseOption) {
	            _classCallCheck(this, BaseContextView);
	
	            var _this = _possibleConstructorReturn(this, (BaseContextView.__proto__ || Object.getPrototypeOf(BaseContextView)).call(this, defaults.type, baseOption));
	
	            if ((0, _util.isFunc)(defaults["Init"])) {
	                defaults["Init"].call(_this, baseOption);
	            }
	            return _this;
	        }
	
	        _createClass(BaseContextView, [{
	            key: "zoom",
	            value: function zoom(x, y) {
	                _get(BaseContextView.prototype.__proto__ || Object.getPrototypeOf(BaseContextView.prototype), "zoom", this).call(this, x, y);
	            }
	        }, {
	            key: "setDefaultConfig",
	            value: function setDefaultConfig(config) {
	                //设置全局ychart属性
	                this.__yh = config.yh;
	                //设置笛卡尔坐标系
	                this._setDefaultTrasformToCartesian(config.height);
	            }
	
	            /**
	             * 设置当前元素的默认坐标系为直角坐标系. 该方法应该在刷新之前调用并且仅仅调用一次.
	             * 由于变换要在元素知道被添加到某个具体的 @see{CanvasRenderingContext2D} 的时候
	             * 才可以.
	             * @private
	             * @param position  距离变换
	             * @param scale  缩放及方向变换
	             */
	
	        }, {
	            key: "_setDefaultTrasformToCartesian",
	            value: function _setDefaultTrasformToCartesian(height) {
	                this.position = [0, height];
	                this.scale = [1, -1];
	            }
	        }]);
	
	        return BaseContextView;
	    }(_contextView2.default);
	
	    for (var prop in defaults) {
	        BaseContextView.prototype[prop] = defaults[prop];
	    }
	
	    return BaseContextView;
	};
	
	exports.default = {
	    baseContextViewExtend: baseContextViewExtend
	};
	module.exports = exports["default"];

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _view = __webpack_require__(20);
	
	var _view2 = _interopRequireDefault(_view);
	
	var _transform = __webpack_require__(6);
	
	var _transform2 = _interopRequireDefault(_transform);
	
	var _eventful = __webpack_require__(18);
	
	var _eventful2 = _interopRequireDefault(_eventful);
	
	var _moveable = __webpack_require__(9);
	
	var _moveable2 = _interopRequireDefault(_moveable);
	
	var _OptionProxy = __webpack_require__(27);
	
	var _OptionProxy2 = _interopRequireDefault(_OptionProxy);
	
	var _text = __webpack_require__(30);
	
	var _text2 = _interopRequireDefault(_text);
	
	var _klass = __webpack_require__(5);
	
	var _viewutil = __webpack_require__(31);
	
	var _dom = __webpack_require__(14);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 绘制在canvas上的元素基类模块
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ychart/core/graphic/contextview
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */
	
	/**
	 * @classdesc 绘制在canvas上的CanvasRenderingContext2D图形的绘图处理类,该类提供绘图相关
	 * 的方法和控制，但是具体路径的绘制则由具体图形负责。 该类可以说仅仅是一个代
	 * 理
	 * @class
	 * @abstract
	 */
	var ContextView = function (_View) {
	    _inherits(ContextView, _View);
	
	    /**
	     * @param {String} type  元素类型. 该类型默认为ContextView
	     * @param {Object} option  实例的具体参数
	     * @constructor
	     */
	    function ContextView() {
	        var type = arguments.length <= 0 || arguments[0] === undefined ? "ContextView" : arguments[0];
	        var option = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	        _classCallCheck(this, ContextView);
	
	        var _this = _possibleConstructorReturn(this, (ContextView.__proto__ || Object.getPrototypeOf(ContextView)).call(this, type, option));
	
	        _this.configProxy = new _OptionProxy2.default(_this.defaultConfig, option);
	
	        /**
	         * 绘图实例，用于调用实例的刷新方法
	         * 在元素被添加到ychart实例的时候设置
	         * @member {object}
	         * @private
	         */
	        _this.__yh = null;
	
	        _transform2.default.call(_this, option);
	        _eventful2.default.call(_this);
	        return _this;
	    }
	
	    /**
	     * 每个具体元素类的默认配置。
	     * 该配置将覆盖全局系统默认配置，但是会被全局用户自定义配置以及具体元素配置所覆盖
	     * @property {Object}  config  元素默认配置
	     * @default {style:{}}
	     */
	    // static defaultConfig = {
	    // style:{
	    // }
	    // }
	
	
	    /**
	     * 是否使用直角座标系，除了图片和文字，其他字体默认都是以
	     * 左下角为原点的座标系
	     * @property {number} coordinate o为正常形状的直角座标系，1为图片或者文字的直角座标系。 其他值使用默认座标系
	     * @default 图片或文字为1，其他元素为0
	     */
	    /*
	        get coordinate() {
	            return this.configProxy.getConfig().coordinate;
	        }
	    */
	
	    _createClass(ContextView, [{
	        key: "RebrushAll",
	
	
	        /**
	         * 重绘整个ychart实例. 通常用于元素位置改变\图片加载完成过后
	         */
	        value: function RebrushAll() {
	            this.__yh && this.__yh.update();
	        }
	
	        /**
	         * 绘图元素在把内容绘制到context之前调用的函数
	         * @method
	         * @param {CanvasRenderingContext2D} ctx
	         */
	        /* eslint-disable */
	
	    }, {
	        key: "BeforeBrush",
	        value: function BeforeBrush(ctx, config) {}
	
	        /**
	         * 绘图元素在把内容绘制到context之后调用的函数
	         * @method
	         * @param {CanvasRenderingContext2D} ctx
	         */
	
	    }, {
	        key: "AfterBrush",
	        value: function AfterBrush(ctx, config) {}
	
	        /**
	         * 获取当前元素的包围圈。
	         * @return {Array.<Number>} 返回rect数组
	         */
	
	    }, {
	        key: "GetContainRect",
	        value: function GetContainRect() {
	            return this.rect;
	        }
	        /*eslint-enable */
	
	        /**
	         * 绘图元素在把内容绘制到context之前调用的函数
	         * @method
	         * @private
	         * @param {CanvasRenderingContext2D} ctx
	         */
	
	    }, {
	        key: "_BeforeBrush",
	        value: function _BeforeBrush(ctx, config) {
	            ctx.save();
	
	            this._SetShapeTransform(ctx, config);
	
	            this.configProxy.bindContext(ctx);
	
	            this.BeforeBrush(ctx, config);
	
	            ctx.beginPath();
	        }
	
	        /**
	         * 设置绘图变换
	         * @method
	         * @private
	         * @param {CanvasRenderingContext2D} ctx
	         */
	
	    }, {
	        key: "_SetShapeTransform",
	        value: function _SetShapeTransform(ctx) {
	
	            this.updateTransform();
	
	            this.setTransform(ctx);
	        }
	
	        /**
	         * 通过上下文获取绘图的canvas尺寸
	         * @param {CanvasRenderingContext2D} ctx
	         */
	
	    }, {
	        key: "getRectByCtx",
	        value: function getRectByCtx(ctx) {
	            return (0, _dom.getRectByCtx)(ctx);
	        }
	
	        /**
	         * 绘图元素在把内容绘制到context之后调用的函数
	         * @method
	         * @private
	         * @param {CanvasRenderingContext2D} ctx
	         */
	
	    }, {
	        key: "_AfterBrush",
	        value: function _AfterBrush(ctx, config) {
	            var tp = this.configProxy.getBrushType();
	            /* eslint-disable */
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
	                default:
	                    ctx.fill();
	                    break;
	            }
	            /* eslint-enable */
	            ctx.restore();
	
	            this.AfterBrush(ctx, config);
	        }
	
	        /**
	         * 具体绘制路径的接口函数。 具体绘图子类必须实现该方法
	         * @abstract
	         * @param {CanvasRenderingContext2D} ctx
	         * @param {object} config --配置。
	         */
	        /* eslint-disable*/
	
	    }, {
	        key: "BuildPath",
	        value: function BuildPath(ctx, config) {
	            //设置合适的填充方法
	            throw new Error(" unsurported operation -- can't build shape path");
	        }
	        /* eslint-enable */
	
	        /**
	         * 绘制的接口。 绘制该元素必须调用该方法
	         * @method
	         * @param {CanvasRenderingContext2D} ctx
	         */
	
	    }, {
	        key: "Brush",
	        value: function Brush(ctx) {
	            var config = this.config;
	            if (!config.ignore) {
	                //设置样式
	                this._BeforeBrush(ctx, config);
	                //具体图形自己的定制
	                this.BuildPath(ctx, config);
	                //恢复事故现场
	                this._AfterBrush(ctx, config);
	
	                this.DrawText(ctx, config);
	            }
	        }
	
	        /**
	         * 设置元素配置项。 调用该方法会导致该元素被标记为脏，下一次重新页面刷新时将清楚该元素所在层并且重新绘制
	         * @param {object} option
	         */
	
	    }, {
	        key: "setOption",
	        value: function setOption(option) {
	            this.configProxy.update(option);
	            this.__dirty = true;
	        }
	
	        /**
	         * 判断点是否在当前元素内.该方法会首先通过
	         * @see {GetContainRect} 方法判断,然后调用 @see {_isPtInPath} 方法
	         * @param {Number} x   x座标
	         * @param {Number} y   y座标
	         */
	
	    }, {
	        key: "contain",
	        value: function contain(x, y) {
	            var local = this.transformCoordToLocal(x, y);
	            //当前元素的containRect作为缓存, 鼠标应该首先在该范围内才继续判断
	            return this.getable && (0, _viewutil.isPtInRect)(this.GetContainRect(), local[0], local[1]) && this._isPtInPath(x, y);
	        }
	
	        /**
	         * 通过路径绘制来判断点是否在元素上
	         * @param x
	         * @param y
	         * @private
	         */
	
	    }, {
	        key: "_isPtInPath",
	        value: function _isPtInPath(x, y) {
	            return (0, _viewutil.isPtInPath)(this, this.config, x, y);
	        }
	
	        /**
	         * 绘制文字
	         * @param {CanvasRenderingContext2D} ctx
	         * @param {object} config --绘制配置
	         */
	
	    }, {
	        key: "DrawText",
	        value: function DrawText(ctx, config) {
	            if (!config.text) {
	                return;
	            }
	            var crect = this.GetContainRect();
	            if (!crect) {
	                return;
	            }
	            var x = crect[0] + (crect[2] - crect[0]) / 2;
	            var y = crect[1] + (crect[3] - crect[1]) / 2;
	
	            var st = this.configProxy.getStyle();
	            /* eslint-disable */
	            var textw = _text2.default.getTextWidth(config.text, st.font);
	            var texth = _text2.default.getTextHeight(config.text, st.font);
	            var textAlign = st.textAlign,
	                textBaseline = st.textBaseline;
	            switch (config.textpos) {
	                case "bottom-center":
	                    y = crect[1];
	                    textAlign = "center";
	                    break;
	                case "top-left":
	                case "left-top":
	                    x = crect[0];
	                    y = crect[1];
	                    break;
	                case "bottom-right":
	                case "right-bottom":
	                    x = crect[2] - textw;
	                    y = crect[1];
	                    break;
	                case "left-center":
	                    x = crect[0];
	                    textAlign = "left";
	                    textBaseline = "middle";
	                    break;
	                case "left-bottom":
	                case "bottom-left":
	                    x = crect[0];
	                    y = crect[3];
	                    break;
	                case "top-center":
	                    y = crect[3];
	                    textAlign = "center";
	                    textBaseline = "top";
	                    // x -= textw/2;
	                    break;
	                case "top-right":
	                case "right-top":
	                    y = crect[3];
	                    x = crect[2] - textw;
	                    break;
	                case "right-center":
	                    x = crect[2] - textw;
	                    y -= texth / 2;
	                    break;
	                default:
	                    textAlign = "center";
	                    textBaseline = "middle";
	                // x -= textw/2;
	                // y -= texth/2;
	                // st.textBaseline = "top";
	            }
	            /* eslint-disable */
	            ctx.save();
	            //文字颜色
	            if (st.textColor) {
	                ctx.fillStyle = st.textColor;
	            }
	            //文字的变换与图形不一样，默认情况下就是正向的，特别处理
	            var globalTextPos = this.transformCoordToGlobal(x, y);
	            x = globalTextPos[0], y = globalTextPos[1];
	
	            _text2.default.fillText(ctx, config.text, x, y, st.font, textAlign, textBaseline);
	
	            ctx.restore();
	        }
	    }, {
	        key: "coordinate",
	        set: function set(val) {
	            this.configProxy.update({
	                coordinate: val
	            });
	        }
	
	        /**
	         *
	         * @property {boolean} Draggable 当前元素是否可以拖动
	         * @default true
	         */
	
	    }, {
	        key: "draggable",
	        get: function get() {
	            return this.config.draggable === undefined ? true : this.config.draggable;
	        }
	
	        /**
	         * 当前元素的层级。层级决定了当前元素将被绘制在第几层canvas上
	         * @property {Number} zLevel
	         * @default 0
	         */
	
	    }, {
	        key: "zLevel",
	        get: function get() {
	            return this.config.zLevel || 0;
	        }
	
	        /**
	         * @property {Object} config 获取当前shapa的配置项
	         * @returns {Object}
	         */
	
	    }, {
	        key: "config",
	        get: function get() {
	            return this.configProxy.getConfig();
	        }
	
	        /**
	         * @property {boolean} getable 当前元素是否捕获事件。
	         * @default true
	         * @return boolean
	         */
	
	    }, {
	        key: "getable",
	        get: function get() {
	            return typeof this.config.getable === "undefined" ? true : this.config.getable;
	        }
	    }]);
	
	    return ContextView;
	}(_view2.default);
	
	(0, _klass.mixin)(ContextView, _transform2.default, true);
	(0, _klass.mixin)(ContextView, _eventful2.default, true);
	(0, _klass.mixin)(ContextView, _moveable2.default, true);
	
	exports.default = ContextView;
	module.exports = exports["default"];

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _StyleProxy = __webpack_require__(28);
	
	var _StyleProxy2 = _interopRequireDefault(_StyleProxy);
	
	var _config = __webpack_require__(21);
	
	var _util = __webpack_require__(3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * 每个可绘制元素的配置代理类
	 * 每个可绘制元素的配置项管理类。 该类将管理每个元素绘制需要的各项属性，其中，
	 * 样式采用styleProxy代理管理。 应该为样式有别名及默认样式。
	 *
	 * @class
	 * @param config
	 */
	var OptionProxy = function OptionProxy() {
	    /**
	     * 配置代理
	     * @member {boolean}
	     * @default null
	     */
	    this.styleProxy = new _StyleProxy2.default();
	
	    /**
	     * 实际配置
	     * 每个绘图元素的所有配置项。 其中 style 这个项表示所有样式相关。 独立处理
	     * @member {object}
	     */
	    this.config = {};
	
	    var _this = this;
	    Object.defineProperty(this.config, "style", {
	        enumerable: true,
	        configurable: false,
	        get: function get() {
	            return _this.styleProxy.getStyle();
	        },
	        set: function set(val) {
	            _this.styleProxy.update(val);
	        }
	    });
	
	    for (var _len = arguments.length, option = Array(_len), _key = 0; _key < _len; _key++) {
	        option[_key] = arguments[_key];
	    }
	
	    this.init(option);
	};
	
	/**
	 * 初始化样式管理类。 设置该元素绘制必须的样式
	 * @param config
	 */
	/**
	 * 配置代理类。 内部依赖 {@link module:ychart/core/config/styleProxy}
	 * @module ychart/core/config/optionProxy
	 */
	
	OptionProxy.prototype.init = function (configs) {
	    (0, _util.merge)(this.config, configs, true);
	    console.log(this.config);
	    /* var config = {};
	     merge(config, configs, true)
	     for (let item in config) {
	         if (item) {
	             this.config[item] = config[item];
	         }
	     }*/
	
	    /*for (let item in config) {
	        if (item) {
	            if (item != "style") {
	                this.config[item] = config[item];
	            } else {
	                this.styleProxy = new styleProxy(config[item]);
	            }
	        }
	    }
	        this.config.style = this.styleProxy.getStyle();*/
	};
	
	/**
	 * 获取所有配置
	 * @returns {object} config
	 */
	OptionProxy.prototype.getConfig = function (width, height) {
	    return this.config;
	};
	
	/**
	 * 获取样式
	 * @returns {OptionProxy.config.style|{}}
	 */
	OptionProxy.prototype.getStyle = function () {
	    return this.config.style || {};
	};
	
	/**
	 * 绑定当前样式到指定的上下文
	 * @param context
	 */
	OptionProxy.prototype.bindContext = function (context) {
	    this.styleProxy.bindContext(context);
	};
	
	/**
	 * 获取画刷类型。 自动基于属性选择是填充还是描边
	 * @param context
	 */
	OptionProxy.prototype.getBrushType = function (context) {
	    return this.styleProxy.getBrushType();
	};
	
	/**
	 * 更新数据
	 * @param option
	 */
	OptionProxy.prototype.update = function (config) {
	    for (item in config) {
	        if (item) {
	            if (item != "style") {
	                this.config[item] = config[item];
	            } else {
	                this.styleProxy.update(config[item]);
	            }
	        }
	    }
	    this.config.style = this.styleProxy.getStyle();
	};
	
	exports.default = OptionProxy;
	module.exports = exports["default"];

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _util = __webpack_require__(3);
	
	var _style2 = __webpack_require__(29);
	
	var _style3 = _interopRequireDefault(_style2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * 样式代理类。
	 *
	 */
	var defaultStyle = _style3.default.style;
	var styleMapper = _style3.default.styleMap;
	
	/**
	 * 样式代理类 ，在合并样式时会出现覆盖的情况
	 * @class
	 */
	var StyleProxy = function StyleProxy(style) {
	    style = style || {};
	    this.style = (0, _util.merge)(new defaultStyle(), style, true, styleMapper);
	    this.brushType = null;
	    this.init(style);
	};
	
	StyleProxy.prototype.init = function (style) {
	    this.brushType = style.brushType ? style.brushType : style.strokeStyle ? style.fillStyle ? 'both' : 'stroke' : style.fillStyle ? "fill" : "none";
	};
	
	StyleProxy.prototype.bindContext = function (ctx) {
	    var style = this.style;
	    for (var prop in this.style) {
	        ctx[prop] = this.style[prop];
	    }
	    // 渐变效果覆盖其他的fillStyle样式
	    if ((0, _util.isObj)(style.gradient)) {
	        var _gradient = ctx.createLinearGradient(style.gradient.beginpt[0], style.gradient.beginpt[1], style.gradient.endpt[0], style.gradient.endpt[1]);
	
	        _gradient.addColorStop(0, style.gradient.beginColor);
	        _gradient.addColorStop(1, style.gradient.endColor);
	        ctx.fillStyle = _gradient;
	    }
	};
	
	StyleProxy.prototype.update = function (_style) {
	    if (_style) {
	        (0, _util.merge)(this.style, _style, true, styleMapper);
	        this.init(_style);
	    }
	};
	
	StyleProxy.prototype.getBrushType = function (style) {
	    return this.brushType;
	};
	
	StyleProxy.prototype.getStyle = function () {
	    return this.style;
	};
	
	exports.default = StyleProxy;
	module.exports = exports["default"];

/***/ },
/* 29 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * 样式名映射
	 * @module ychart/core/config/style
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
	    shadowOffsetX: "shadowOffsetX",
	    shadowOffsetY: "shadowOffsetY",
	    shadowBlur: "shadowBlur",
	    shadowx: "shadowOffsetX",
	    shadowy: "shadowOffsetY",
	
	    globalAlpha: "globalAlpha",
	    alpha: "globalAlpha",
	    globalCompositionOperation: "globalCompositionOperation",
	    overlaystyle: "globalCompositionOperation"
	};
	
	/**
	 * @classdesc 全局默认样式。 所有形状或者路劲的样式都基于这个样式。
	 * 负责为所有模块提供默认样式及自定义样式名到标准样式名的转换
	 * 映射配置属性名到canvas属性.
	 * 应该包含默认的属性名
	 * 新加一个属性在这个映射和下面CONFIG中的style中同时添加
	 * @class
	 */
	var style = function style() {};
	
	style.prototype = {
	    /**
	     * 线条颜色，用于任意路劲绘制中线条样式的控制。
	     * 值可以是任意十六进制颜色或者英文单词
	     * 别名 : lineColor
	     * @type string
	     * @default blue
	     */
	    strokeStyle: "blue",
	
	    /**
	     * 填充颜色，用于任意路劲中fill方法的填充样式
	     * 值可以是任意十六进制颜色或者英文单词
	     * 别名 ： fillColor  color
	     * @type string
	     * @default #dcd5d9
	     */
	    fillStyle: "#dcd5d9",
	
	    /**
	     * 线宽。
	     * @type number
	     * @default 1
	     */
	    lineWidth: 1,
	
	    /**
	     * 线条两端样式. butt、round、square
	     * @type string
	     * @default round
	     */
	    lineCap: "round",
	
	    /**
	     * bevel,miter线条相交的方式. 园交,斜交还是斜接.
	     * @type string
	     * @default round
	     */
	    lineJoin: "round",
	
	    /**
	     * 文字
	     * @type string
	     * @default bold 14px Arial, Helvetica, sans-serif, Times, serif
	     */
	    font: "bold 14px Arial, Helvetica, sans-serif, Times, serif",
	
	    /**
	     * 文字颜色。 strokeStyle
	     * 该属性不是标准的canvas样式，是ycharts为方便文字控制添加的
	     * @type string
	     * @default black
	     */
	    textColor: "black", //文字样式。 非标准canvas属性
	
	    /**
	     * 文本对齐方式
	     * @type string
	     * @default start
	     */
	    textAlign: "start",
	
	    /**
	     * 文本基线
	     * @type string
	     * @default bottom
	     */
	    textBaseline: "bottom",
	
	    /**
	     * 默认阴影颜色
	     * @type string
	     * @default #EA9090
	     */
	    shadowColor: "#EA9090",
	
	    /**
	     * 阴影X偏移
	     * @type number
	     * @default  shadowOffsetX
	     */
	    shadowOffsetX: 0,
	
	    /**
	     * 阴影Y偏移
	     * @type number
	     * @default shadowOffsetY
	     */
	    shadowOffsetY: 0,
	
	    /**
	     * 像素的模糊数
	     * @type number
	     * @default 0
	     */
	    shadowBlur: 0,
	
	    /**
	     * 透明度。  0为透明
	     * @type number
	     * @default 1
	     */
	    globalAlpha: 1,
	
	    /**
	     * 透明重叠情况
	     * @type string
	     * @default source-over
	     */
	    globalCompositionOperation: "source-over"
	
	};
	
	exports.default = {
	    style: style,
	    styleMap: styleMap
	};
	module.exports = exports["default"];

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _style = __webpack_require__(29);
	
	var _style2 = _interopRequireDefault(_style);
	
	var _viewutil = __webpack_require__(31);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	//使用默认样式
	
	var st = new _style2.default.style();
	
	var defaultFont = st.font;
	var defaultAlign = st.textAlign;
	var defaultBaseline = st.textBaseline;
	
	var _ctx = (0, _viewutil.getContext)();
	
	var TextUtil = {
	    TEXT_CACHE_MAX: 5000,
	
	    _textHeightCache: [],
	    _textHeightCacheCounter: 0,
	
	    getTextHeight: function getTextHeight(text, textFont) {
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
	
	    getTextWidth: function getTextWidth(text, textFont) {
	
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
	            width = Math.max(_ctx.measureText(text[i]).width, width);
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
	    getTextRect: function getTextRect(text, x, y, textFont, textAlign, textBaseline) {
	
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
	                x -= width / 2;
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
	
	    var rect = TextUtil.getTextRect(text, x, y, textFont, textAlign, textBaseline);
	
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
	
	exports.default = {
	    fillText: _fillText,
	    getTextRect: TextUtil.getTextRect,
	    getTextWidth: TextUtil.getTextWidth,
	    getTextHeight: TextUtil.getTextHeight
	};
	module.exports = exports["default"];

/***/ },
/* 31 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	//isPointInStroke在IE下失效，但是由于仅需修复一次，所以写在这里
	if (typeof CanvasRenderingContext2D.prototype.isPointInStroke == "undefined") {
	    CanvasRenderingContext2D.prototype.isPointInStroke = function (path, x, y) {
	        return this.isPointInPath(x, y);
	    };
	}
	
	var _ctx = null;
	
	function createCanvas() {
	    return document.createElement("canvas");
	}
	
	var getContext = exports.getContext = function getContext() {
	    if (!_ctx) {
	        _ctx = createCanvas().getContext("2d");
	    }
	    return _ctx;
	};
	
	var isPtInRect = exports.isPtInRect = function isPtInRect(rect, x, y) {
	    return rect && rect[0] <= x && rect[2] >= x && rect[1] <= y && rect[3] >= y;
	};
	
	//todo 这种方式判断鼠标是否在形状内效率不高。改进
	var isPtInPath = exports.isPtInPath = function isPtInPath(shape, config, x, y) {
	    var ctx = getContext();
	    ctx.save();
	    //设置变换
	    shape._BeforeBrush(ctx, config);
	    //建立路径
	    shape.BuildPath(ctx, config);
	    var rs;
	    var type = shape.configProxy.getBrushType();
	    //对于填充和边线+填充的图形调用isPointInPath方法
	    if (type == "all" || type == "fill") {
	        rs = ctx.isPointInPath(x, y);
	    } else {
	        rs = ctx.isPointInStroke(x, y);
	    }
	    ctx.restore();
	    return rs;
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _viewBuilder = __webpack_require__(25);
	
	var _viewBuilder2 = _interopRequireDefault(_viewBuilder);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * 圆形
	 * @class Circle
	 * @property {number} x 圆心x坐标
	 * @property {number} y 圆心y坐标
	 * @property {number} r 半径
	 * @constructor Circle
	 * */
	exports.default = _viewBuilder2.default.baseContextViewExtend({
	
	    /**
	     * 构造函数 。 在构造函数中指定该图像的中心点
	     * @param {object} option  绘制形状的配置
	     * @private
	     */
	    Init: function Init(config) {
	        this.origin = [config.x, config.y];
	    },
	
	    type: "circle",
	
	    BuildPath: function BuildPath(ctx, config) {
	        ctx.arc(config.x, config.y, config.r, Math.PI * 2, config.startangel || 0, config.endangel || Math.PI * 2);
	    },
	
	    GetContainRect: function GetContainRect() {
	        var config = this.config;
	        if (this.dirty || !this.rect) {
	            this.rect = [config.x - config.r, config.y - config.r, config.x + config.r, config.y + config.r];
	        }
	        return this.rect;
	    }
	
	}); /**
	     * 圆形
	     * @module ychart/shape/Circle
	     */

	module.exports = exports["default"];

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _viewBuilder = __webpack_require__(25);
	
	var _viewBuilder2 = _interopRequireDefault(_viewBuilder);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * 直线形状类
	 * @class Line
	 * @property {number} x0 , y0 开始点
	 * @property {number} x1 ,y1 结束点
	 * @property {number} splitnum  如果是虚线，分成多少段.
	 * @constructor Line
	 * @extends ContextView
	 */
	exports.default = _viewBuilder2.default.baseContextViewExtend({
	
	    type: "Line",
	
	    BuildPath: function BuildPath(ctx, config) {
	        if (config.splitnum) {
	            var splitnum = config.splitnum || 1;
	            var splitlen_x = (config.x1 - config.x0) / splitnum / 2;
	            var splitlen_y = (config.y1 - config.y0) / splitnum / 2;
	            for (var i = 0; i < splitnum; i++) {
	                ctx.moveTo(config.x0 + i * 2 * splitlen_x, config.y0 + i * 2 * splitlen_y);
	                ctx.lineTo(config.x0 + i * 2 * splitlen_x + splitlen_x, config.y0 + i * 2 * splitlen_y + splitlen_y);
	            }
	        } else {
	            ctx.moveTo(config.x0, config.y0);
	            ctx.lineTo(config.x1, config.y1);
	        }
	        this.rect = [config.x0, config.y0, config.x1, config.y1];
	    }
	}); /**
	     * 直线
	     * @module ychart/shape/Line
	     */

	module.exports = exports["default"];

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _viewBuilder = __webpack_require__(25);
	
	var _viewBuilder2 = _interopRequireDefault(_viewBuilder);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var minx = 99999,
	    miny = 99999,
	    maxx = -99999,
	    maxy = -99999;
	
	/**
	 * @class Rect
	 * @classdesc 不规则多边形. 需指定所有的点坐标
	 * @property  {Array.number}  allpt [[0,0],[10,10]]这样的点的数组
	 * @property  {boolean} notClose 是否是不闭合的多边形.默认闭合
	 * @constructor Rect
	 */
	/**
	 * 不规则多边形
	 * @module ychart/shape/Rect
	 */
	
	exports.default = _viewBuilder2.default.baseContextViewExtend({
	
	    type: "Rect",
	
	    BuildPath: function BuildPath(ctx, config) {
	        ctx.moveTo(config.pts[0][0], config.pts[0][1]);
	        for (var i = 1; i < config.pts.length; i++) {
	            ctx.lineTo(config.pts[i][0], config.pts[i][1]);
	        }
	        if (!config.notClose) {
	            ctx.closePath();
	        }
	    },
	
	    GetContainRect: function GetContainRect() {
	        if (!this.rect) {
	
	            var i = 0,
	                tmp;
	            for (i = 0; i < this.config.pts.length; i++) {
	                tmp = this.config.pts[i];
	                if (tmp[0] < minx) {
	                    minx = tmp[0];
	                }
	                if (tmp[1] < miny) {
	                    miny = tmp[1];
	                }
	                if (tmp[0] > maxx) {
	                    maxx = tmp[0];
	                }
	                if (tmp[1] > maxy) {
	                    maxy = tmp[1];
	                }
	            }
	            this.rect = [minx, miny, maxx, maxy];
	        }
	        return this.rect;
	    }
	
	});
	module.exports = exports["default"];

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _viewBuilder = __webpack_require__(25);
	
	var _viewBuilder2 = _interopRequireDefault(_viewBuilder);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * 三角形
	 * @class Triangle
	 * @property {number} beginpt 开始座标
	 * @property {number} width  三角形的宽
	 * @property {number} height 三角形的高
	 * @property {number} direction bottom 为向下。 默认向上
	 * @constructor Triangle
	 */
	exports.default = _viewBuilder2.default.baseContextViewExtend({
	
	    type: "triangle",
	
	    BuildPath: function BuildPath(ctx, config) {
	        ctx.moveTo(config.beginpt[0], config.beginpt[1]);
	        ctx.lineTo(config.beginpt[0] + config.width, config.beginpt[1]);
	        var pt = [config.beginpt[0] + config.width / 2, config.beginpt[1] + config.height];
	        //向下的三角形
	        if (config.direction == "bottom") {
	            pt[1] = config.beginpt[1] - config.height;
	        }
	        ctx.lineTo(pt[0], pt[1]);
	        ctx.lineTo(config.beginpt[0], config.beginpt[1]);
	        config.style.brushType = config.style.brushType || "stroke";
	    }
	}); /**
	     * 三角形
	     * @module ychart/shape/Triangle
	     */

	module.exports = exports["default"];

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _util = __webpack_require__(3);
	
	var _text = __webpack_require__(30);
	
	var _text2 = _interopRequireDefault(_text);
	
	var _viewBuilder = __webpack_require__(25);
	
	var _viewBuilder2 = _interopRequireDefault(_viewBuilder);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * 文本
	 * 由于文本显示与图像刚好是竖向完全相反的两个方向，所以对文本绘制特殊处理。
	 * 某区域文本是直角座标系，但是文字实际上还是默认的座标系，不过Y被改成负数了
	 * @class Text
	 * @property {string} text 显示的文字
	 * @property {Array.number} beginpt 开始座标
	 * @constructor YText
	 */
	exports.default = _viewBuilder2.default.baseContextViewExtend({
	    defaultConfig: {
	        coordinate: 1
	    },
	
	    type: "Text",
	
	    BuildPath: function BuildPath(ctx, config) {
	        config.style.brushType = "none";
	    },
	
	    DrawText: function DrawText(ctx, config) {
	        if ((0, _util.checkNull)(config.text)) {
	            return;
	        }
	        ctx.save();
	
	        //文字颜色
	        if (!(0, _util.checkNull)(config.style.textColor)) {
	            ctx.fillStyle = config.style.textColor;
	        }
	
	        var rect = this.getRectByCtx(ctx);
	
	        var y = rect[1] - config.dy;
	
	        if (this.coordinate == -1) {
	            y = config.dy;
	        }
	
	        var textparams = [config.text, config.dx, y, config.style.font, config.style.textAlign, config.style.textBaseline];
	
	        _text2.default.fillText(ctx, textparams[0], textparams[1], textparams[2], textparams[3], textparams[4], textparams[5]);
	
	        //设置文本的包围圈
	        if (this.__dirty || !this.containRect) {
	            var textrect = _text2.default.getTextRect(textparams[0], textparams[1], textparams[2], textparams[3], textparams[4], textparams[5]);
	            this.containRect = [textrect.x, textrect.y, textrect.x + textrect.width, textrect.y + textrect.height];
	        }
	
	        ctx.restore();
	    },
	
	    GetContainRect: function GetContainRect() {
	        return this.containRect;
	    }
	
	    /* IsPtInPath: function(){
	        return true;
	    } */
	
	}); /**
	     * 文字
	     * @module ychart/shape/Text
	     */

	module.exports = exports["default"];

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _viewBuilder = __webpack_require__(25);
	
	var _viewBuilder2 = _interopRequireDefault(_viewBuilder);
	
	var _util = __webpack_require__(3);
	
	var _lang = __webpack_require__(22);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * 图形形状类
	 * @class Image
	 * 该元素可以如下三种构造方法:
	 *  <br>(image, dx, dy);
	 *  <br>(image, dx, dy, dWidth, dHeight);
	 *  <br>(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
	 *  分别对应着按照图片的默认尺寸绘制\ 指定目标位置和尺寸\ 指定截取图片上的某一块绘制到目标对象上的某个位置
	 * @property {HTMLImage} image 图形的HTMLImage对象， 注意不能是通过DOM获取的对象。 可以通过新建一个Image对象
	 * @property {String} imagesrc 图形的src属性， 注意必须和Ychart同源,否则会由于浏览器的安全限制而报错. 与image属性同时存在时Image属性有效
	 * @property {number} dx 绘制该图形在画布上的起点X  默认0
	 * @property {number} dy 绘制该图形在画布上的起点Y  默认0
	 * @property {number} dWidth 绘制该图形在画布上的宽度  默认不指定
	 * @property {number} dHeight 绘制该图形在画布上的宽度  默认不指定
	 * @property {number} sx 绘制该图形在图像上的起点X  默认不指定
	 * @property {number} sy 绘制该图形在图像上的起点Y  默认不指定
	 * @property {number} sWidth 绘制该图形在图像上的宽度  默认不指定
	 * @property {number} sHeight 绘制该图形在图像上的宽度  默认不指定
	 * @property {Object} style 样式.
	 * @constructor Image
	 * @extends ContextView
	 */
	exports.default = _viewBuilder2.default.baseContextViewExtend({
	
	    /**
	     * 构造函数 。 在构造函数中指定该图像的中心点
	     * @param {object} option  绘制形状的配置
	     * @private
	     */
	    Init: function Init(config) {
	        var _this2 = this;
	
	        this.origin = this.origin || [];
	        //由于引入了异步加载图片的机制，获取图片的大小在图片还没有实际加载的时候也就无法执行
	        if (typeof config.image != "string") {
	            this.image = config.image;
	            this.__setOrigin(this.image);
	        } else {
	            (function () {
	                _this2.image = new Image();
	                var _this = _this2;
	                _this2.image.onload = function () {
	                    this.image = null;
	                    _this.__setOrigin(_this.image);
	                };
	                _this2.image.src = config.image;
	            })();
	        }
	    },
	
	    /**
	     * 设置图片放大缩小的中心座标。 由于依赖于已经加载的图片，所以单独列出来
	     * @private
	     */
	    __setOrigin: function __setOrigin(image) {
	        var config = this.config;
	        var rect = [];
	        if (config.dWidth && config.dHeight) {
	            this.origin[0] = config.dx || 0 + config.dWidth / 2;
	            this.origin[1] = rect[1] - config.dy || 0 + config.dHeight / 2;
	        } else {
	            this.origin[0] = config.dx || 0 + image.width / 2;
	            this.origin[1] = rect[1] - config.dy || 0 + image.height / 2;
	        }
	    },
	
	    type: "Image",
	
	    /**
	     * 绘制图片。 必须注意的图片同其他形状一样默认以左下角为起点。
	     * 但是由于这是通过容器canvas大小和目标图像的高度计算得来，在
	     * 和其他形状配合使用时遇到变化可能会出现问题。 此时就需要设置
	     * coordinate属性为-1，使得绘图片还是以左上角为原点.
	     * @private
	     */
	    BuildPath: function BuildPath(ctx, config) {
	        var buildImagePath1 = function buildImagePath1() {
	            var image = this.image || config.image;
	            if (image) {
	                numberOrZero(config, ["dx", "dy", "sx", "sy"]);
	                var dy = config.dy;
	                var sWidth = config.sWidth || image.width;
	                var sHeight = config.sHeight || image.height;
	                var dWidth = config.dWidth || image.width;
	                var dHeight = config.dHeight || image.height;
	                /*if (this.coordinate == 1) {
	                    let rect = this.getRectByCtx(ctx);
	                    dy = rect[1] - dHeight - dy;
	                }*/
	                //图片的目标位置应该是图片的左下角, 在笛卡尔坐标系中就应该加上图片的目标高度
	                dy += dHeight;
	                ctx.drawImage(image, config.sx, config.sy, sWidth, sHeight, config.dx, dy, dWidth, dHeight);
	                this.rect = [config.dx, dy, config.dx + dWidth, dy + dHeight];
	            }
	        };
	        (0, _lang.onImgReady)(this, this.image, [buildImagePath1, function () {
	            this.RebrushAll();
	        }]);
	    },
	
	    _isPtInPath: function _isPtInPath(x, y) {
	        return true;
	    }
	}); /**
	     * 图片
	     * @module ychart/shape/Image
	     */
	
	function numberOrZero(obj, fields) {
	    if ((0, _util.isArr)(fields)) {
	        fields.forEach(function (field) {
	            obj[field] = (0, _util.checkNull)(obj[field]) || isNaN(obj[field]) ? 0 : obj[field];
	        });
	    } else {
	        obj[fields] = (0, _util.checkNull)(obj[fields]) || isNaN(obj[fields]) ? 0 : obj[fields];
	    }
	}
	module.exports = exports["default"];

/***/ },
/* 38 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 *动画效果模块
	 * @module ychart/animation
	 */
	
	var requestAnimFrame = window !== undefined && (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame) || function (callback) {
	    window.setTimeout(callback, 1000 / 60);
	};
	
	var Nop = function Nop() {
	    return true;
	};
	
	/**
	 * @function
	 * @description 动画控制函数
	 * @param option
	 */
	var animate = function animate(option) {
	    var onBegin = option.onBegin || Nop,
	        onChanging = option.onChanging || Nop,
	        onEnd = option.onEnd || Nop,
	        beginDelay = option.beginDelay || 0;
	
	    (function frame(beginResult) {
	        if (onEnd()) {
	            return;
	        }
	        onChanging(beginResult);
	
	        requestAnimFrame(frame);
	    })(function () {
	        setTimeout(onBegin, beginDelay);
	    }());
	};
	
	exports.default = {
	    animate: animate
	};
	module.exports = exports["default"];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=ychart.js.map