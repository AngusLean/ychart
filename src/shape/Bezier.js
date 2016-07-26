

define(function(require){
    "use strict";

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
    return require("./ShapeBuilder").extend({

        type: "BezierPath",

        BuildPath: function (ctx, config) {
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
            
        }
    })


});