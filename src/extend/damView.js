
//自定义的大坝水位图示

(function (global) {
    var ychart = global.ychart;
    function merge(target, source, overwrite) {
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
        if(target){
            for (var i in source) {
                mergeItem(target, source, i, overwrite);
            }
        }

        return target;
    }
    function warn(msg) {
        console.log(msg);
    }
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


    var damModule = merge({
        DMTP : "土石坝",
        UPDMSL: 0,
        DWDMSL: 0,
        CDREWALL : null,
        HYCH: null
    },baseDamEntity ,false);

    var containerWh = 800,containerht=400;

    var generatorDam = function (dam) {
        var config = merge(dam,damModule,false);

        var size = damSizeAdapter(config,containerWh,containerht);
        var damView = new ychart.Group({
            scale: size.globalScale
        });
        var damgroup = generatorDamGroup(size.damBeginPt,config),
        wlgroup = generatorWaterLevel(size.wlBeginPt ,config ,size.wlWidth);
        damView.add(wlgroup).add(damgroup);
        return damView;
    };
    global.damview = generatorDam;

    /**
     * 整个图形尺寸适应
     * @param maxwidth
     * @param maxheight
     */
    function damSizeAdapter(damconfig ,maxwidth, maxheight) {
        var damwh,
            leftMargin = 50;
        var rs={
            globalScale:[1,1],
            damBeginPt: [200,0],
            wlBeginPt: [50,0],
            wlWidth: 230
        };
        if(typeof damconfig.UPDMSL == "Array"){
            warn("上游坡面多折线的适配暂未实现");
        }else{
            damwh = damconfig.UPDMSL * damconfig.MAXDMHG + damconfig.DMTPWD + damconfig.DWDMSL * damconfig.MAXDMHG;
            var x1 = damwh/maxwidth ,y1=damconfig.MAXDMHG/maxheight ,max=Math.max(x1,y1);
            console.log("宽度： "+damwh+" "+x1+" "+y1+" ");
            var percent;
            if(max < 0.5){
                rs.globalScale[0]=rs.globalScale[1] = 1+max;
                percent = 2;
            }else{
                percent = 1 / max;
                max = 1
            }
            rs.wlWidth = damwh*percent;
            rs.damBeginPt[0] = rs.wlWidth;
            rs.wlBeginPt = [leftMargin,0];
        }
        return rs;
    }

    /**
     * 生成大坝图
     */
    function generatorDamGroup(beginpt ,damModule) {
        var damGroup= new ychart.Group({
            position:beginpt
        });
        var damPts = [[0,0]], pt;
        //大坝左上第一个点
        if(typeof damModule.UPDMSL == 'Object'){
            warn("上游坝坡尚未实现");
            return
        }else{
            pt = [];
            pt[0] = damModule.UPDMSL * damModule.MAXDMHG;
            pt[1] = damModule.MAXDMHG;
            damPts.push(pt);
        }
        //大坝右上角第一个点
        pt = [];
        pt[0] =  damModule.UPDMSL * damModule.MAXDMHG + damModule.DMTPWD;
        pt[1] =  damModule.MAXDMHG;
        damPts.push(pt);
        //大坝右下角最后一个点
        if (typeof damModule.DWDMSL=="Object") {
            warn("下游坝坡面多折线未实现");
            return;
        } else {
            pt = [];
            pt[0] = damModule.UPDMSL * damModule.MAXDMHG + damModule.DMTPWD + damModule.DWDMSL * damModule.MAXDMHG;
            pt[1] = 0;
            damPts.push(pt);
        }

        //大坝
        var damShape = new ychart.shape.Rect({
            pts: damPts,
            draggable: false,
            style: {
                lineColor: "red",
                textColor: "black",
                fillColor: "#DDBB88",
                // fillColor: "red",
                brushType: "fill"
            },
            text: damModule.name
        });
        damGroup.add(damShape);
        if (damModule.CDREWALL) {

            var cdrect = [],damrect=damPts;
            var tmp = (damModule.DMTPWD - damModule.CDREWALL.WTDTH) / 2; //坝顶宽度减去心墙宽度，即心墙左侧位置
            var pt1 = [];
            //心墙第一个点
            pt1[0] = damrect[1][0] + tmp;
            pt1[1] = damrect[0][1];
            if (!damModule.CDREWALL.UPSL) {
                if (typeof damModule.CDREWALL.UPSL == "Object") {
                    warn("心墙上游坡面多折线尚未实现");
                    return;
                } else {
                    //心墙上游坡面向上倾斜。
                    pt1[0] = damrect[1][0] + tmp - damModule.MAXDMHG * damModule.CDREWALL.UPSL;
                }
            }
            cdrect.push(pt1);

            //心墙第二个点
            pt1 = [];
            pt1[0] = damrect[1][0] + tmp;
            pt1[1] =  damModule.MAXDMHG;
            cdrect.push(pt1);

            //心墙第三个点（右上角）
            pt1 = [];
            pt1[0] = damrect[1][0] + tmp + damModule.CDREWALL.WTDTH;
            pt1[1] =  damModule.MAXDMHG;
            cdrect.push(pt1);

            //心墙第四个点(右下角)
            pt1 = [];
            pt1[0] = damrect[1][0] + tmp + damModule.CDREWALL.WTDTH;
            pt1[1] = damrect[0][1];
            if (damModule.CDREWALL.DWSL) {
                if (typeof damModule.CDREWALL.DWSL == "Object") {
                    warn("心墙下游坡面多折线尚未实现");
                    return;
                } else {
                    pt1[0] = damrect[1][0] + tmp + damModule.CDREWALL.WTDTH + damModule.MAXDMHG * damModule.CDREWALL.DWSL;
                }
            }
            cdrect.push(pt1);
            //绘制心墙
            var heartShape = new ychart.shape.Rect({
                pts: cdrect,
                draggable: false,
                style: {
                    fillStyle: "#8B7E6C",
                    textColor: "red",
                    brushType: "fill"
                }
            });
            damGroup.add(heartShape);
        }
        return damGroup;
    }

    var GlobalConfig={
        //三角形的宽度和高度
        triangleWidth : 13,
        triangleHeight: 8,
        //三角形下方对应的水位刻度线最长值
        scalelinewh: 5,
        //刻度线的缩短值
        scalelinepd: 2,
        //刻度线竖向间距
        scalelinetp: 3,
        //水尺的宽度
        rulerwh : 9,
        //水尺分为多少部分
        rulersplitnm : 10
    };

    function generatorWaterLevel(begin ,damModule , maxwaterwidth) {

        var wlGroup = new ychart.Group({
            position: begin
        });
        if (damModule.HYCH) {
            var pt = [];
            var hych =damModule.HYCH;

            var beginpt = [2];
            beginpt[0] = 0;
            beginpt[1] = 0;

            //坝底高程()
            var DMBTEL = !damModule.DMTPEL ? 0 : (damModule.DMTPEL -damModule.MAXDMHG);
            //当前水位对应的海水
            var crtwl = [];
            var crtz = hych.Z - DMBTEL;

            crtwl.push(beginpt);
            crtwl.push([beginpt[0], beginpt[1] + crtz]);
            crtwl.push([beginpt[0] + maxwaterwidth, beginpt[1] + crtz]);
            crtwl.push([beginpt[0] + maxwaterwidth, beginpt[1]]);
            //当前水对应的海水背景
            wlGroup.add(new ychart.shape.Rect({
                pts: crtwl,
                //draggable: false,
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
            var splitnum = GlobalConfig.rulersplitnm;
            //水尺宽度
            var rulerwidth = GlobalConfig.rulerwh;
            var eachlen =damModule.MAXDMHG / splitnum;
            //水尺
            var waterruler = [];
            waterruler.push(beginpt);
            waterruler.push([beginpt[0],
                            [beginpt[1] +damModule.MAXDMHG]
            ]);
            waterruler.push([beginpt[0] + rulerwidth, [beginpt[1] +damModule.MAXDMHG]]);
            waterruler.push([beginpt[0] + rulerwidth, beginpt[1]]);
            //水尺本身
            wlGroup.add(new ychart.shape.Rect({
                pts: waterruler,
                draggable: false,
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
                wlGroup.add(new ychart.shape.Line({
                    x0: beginpt[0],
                    y0: y,
                    x1: beginpt[0]+rulerwidth,
                    y1: y,
                    draggable: false,
                    style: {
                        lineColor: "white",
                        brushType: "stroke"
                    }
                }));
                wlGroup.add(new ychart.shape.YText({
                    beginpt: [beginpt[0] - 25, y + 5],
                    text: tt,
                    draggable: false,
                    style: {
                        textColor: "black"
                    }
                }));
            }

            // 水位标识
            var nrpllvtext = "正常蓄水位" + hych.NRPLLV ;
            wlGroup.add(buildWaterLevelLine({
                beginpt: [beginpt[0] +rulerwidth + 2, beginpt[1] + hych.NRPLLV - DMBTEL],
                endpt: [beginpt[0] + rulerwidth + 120, beginpt[1] + hych.NRPLLV - DMBTEL],
                text: nrpllvtext,
                leftMargin: 10
            }));
            var nrptextrect = ychart.textutil.getTextRect(nrpllvtext ,0,0);

            wlGroup.add(buildWaterLevelLine({
                beginpt: [beginpt[0] + rulerwidth + 2, beginpt[1] + hych.DDWL - DMBTEL],
                endpt: [beginpt[0] + rulerwidth + 120, beginpt[1] + hych.DDWL - DMBTEL],
                text: "死水位" + hych.DDWL,
                leftMargin: 25
            }));
            //处理当前水位的提示位置
            var zx = beginpt[0] +rulerwidth + 2;
            if(nrptextrect.width < maxwaterwidth/2){
                zx += nrptextrect.width+30;
            }
            wlGroup.add(buildWaterLevelLine({
                beginpt: [zx, beginpt[1] + hych.Z - DMBTEL],
                endpt: [beginpt[0] + rulerwidth + 120, beginpt[1] + hych.Z - DMBTEL],
                text: "当前水位" + hych.Z ,
                leftMargin: 10
            },true));

            return wlGroup;
        }
        function buildWaterLevelLine(param ,noline) {
            var wlline = new ychart.Group();
            if(!noline){
                wlline.add(new ychart.shape.Line({
                    beginpt: param.beginpt,
                    endpt: param.endpt,
                    splitnum: 20,
                    draggable: false,
                    style:{
                        lineColor: "#003d8f"
                    }
                }));
            }
            wlline.add(gereratorWlTag([param.beginpt[0] + param.leftMargin, param.beginpt[1] + GlobalConfig.triangleHeight],
                                           GlobalConfig.triangleWidth ,GlobalConfig.triangleHeight));
            //水位标识中的文字
            wlline.add(new ychart.shape.YText({
                beginpt: [param.beginpt[0] + param.leftMargin + GlobalConfig.triangleWidth + 3, param.beginpt[1]],
                text: param.text,
                draggable: false,
                style: {
                    textColor: "black",
                    textBaseline: "bottom"
                }
            }));

            return wlline;
        }

        //生成水位标识
        function gereratorWlTag(toplefttp ,width,height) {
            var wlTag = new ychart.Group();
            wlTag.add(new ychart.shape.Triangle({
                beginpt:toplefttp,
                width:width,
                height:height,
                direction: "bottom",
                draggable: false,
                style: {
                    lineColor: "black"
                }
            }));
            for (var i = 0; i < 2; i++) {
                wlTag.add(new ychart.shape.Line({
                    beginpt: [toplefttp[0] + i * GlobalConfig.scalelinepd, toplefttp[1] - GlobalConfig.scalelinetp * (i + 1)],
                    endpt: [toplefttp[0] + toplefttp + i * GlobalConfig.scalelinepd + (3 - i) * GlobalConfig.scalelinewh,
                    toplefttp[1] - GlobalConfig.scalelinetp * (i + 1)
                    ],
                    draggable: false,
                    style: {
                        lineColor: "black"
                    }
                }));
            }
            return wlTag;
        }
    }
})(window);
