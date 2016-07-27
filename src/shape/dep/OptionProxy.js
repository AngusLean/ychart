/**
 * Created by Administrator on 2016/7/27.
 */

define(function (require) {
   "use strict";
    
    var styleProxy = require("./styleProxy");
    var util = require("../../tool/util");
    
    
    var optionProxy = function(config){
        
        this.styleProxy = null;
        
        //每个绘图元素的所有配置项。 其中 style 这个项表示所有样式相关。 独立处理
        this.config = {
            style: {}
        };

        this.init(config);
    };

    var item;
    optionProxy.prototype.init = function (config) {
        for(item in config){
            if(!util.checkNull(config[item])){
                if(item != "style"){
                    this.config[item] = config[item];
                }else {
                    this.styleProxy = new styleProxy(config[item]);
                }
            }
        }
        this.config.style = this.styleProxy.getStyle();
    };

    optionProxy.prototype.getConfig = function () {
        return this.config;
    };

    optionProxy.prototype.getStyle = function () {
        return this.config.style || {};
    };
    
    optionProxy.prototype.bindContext = function (context) {
        this.styleProxy.bindContext(context);
    };

    optionProxy.prototype.getBrushType = function (context) {
        return this.styleProxy.getBrushType();
    };

    optionProxy.prototype.update = function (option) {
        for(item in config){
            if(!util.checkNull(config[item])){
                if(item != "style"){
                    this.config[item] = config[item];
                }else {
                    this.styleProxy.update(config[item]);
                }
            }
        }
        this.config.style = this.styleProxy.getStyle();
    };
    
    
    
    
    
    
    
    
    
    
    
    
    return optionProxy;
});