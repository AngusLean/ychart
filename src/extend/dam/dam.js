define(function(require) {
    "use strict";

    var util = require("../../tool/util");
    var textutil = require("../../core/graphic/helper/text");
    var dammd = require("./dam_md");

    var Group = require("../../Group");
    var Rect = require(".././Rect");
    var Line = require(".././Line");
    var YText = require(".././YText");

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
            var Triangle = require(".././Triangle");
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
