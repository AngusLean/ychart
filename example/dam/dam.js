var baseDamEntity = {
    name: "",
    /**
     * 按结构形式分为 重力坝/土石坝/拱坝/支墩坝
     */
    DMTP: {
        DMTPA: "土石坝",
        DMTPB: "心墙坝",
        DMTPC: "沥青混凝土心墙"
    },

    //最大坝高
    MAXDMHG: 0,
    //坝顶宽度
    DMTPWD: 0,
    //坝底宽度. 基本上用不到。 使用坝顶和坡度可以计算
    // DMBTWD : 0,
    //坝顶长度
    DMTPLN: 0,
    //坝顶高程
    DMTPEL: 0,

    //上游坝坡
    UPDMSL: {
        //可能有两段坡面
        UPDMSL1: 0,
        UPDMSL2: 0
    },
    //下游坝坡
    DWDMSL: {
        DWDMSL1: 0,
        DWDMSL2: 0
    },

    //心墙
    CDREWALL: {
        //心墙材料
        MT: "沥青混凝土",
        //心墙宽度
        WIDTH: 0,
        //心墙上游坡度
        UPSL: {
            //可能是组合式心墙
            UPSL1: 0,
            UPSL2: 0
        },
        //心墙下游坡度
        DWSL: {
            DWSL1: 0,
            DWSL2: 0
        }
    },

    //水位特征值
    HYCH: {
        //死水位
        DDWL: 0,
        //正常蓄水位
        NRPLLV: 0,
        //汛限水位 FLSSCNWL: 0,
        //设计洪水位
        DSFLLV: 0,
        //校核洪水位
        CHFLLV: 0,

        //当前水位
        Z: 0
    }
};

var warn = function(text){
    console.warn(text);
};
var error = function(text){
    console.error(text);
};
var isNum = function(dt){
    return typeof dt === "number";
};

var Dam = ychart.extendView({
    type: "Dam",

    defaultConfig: {
        style:{
            brushType: "both"
        }
    },

    BuildPath: function(ctx, config) {
        var dmHeight = config.MAXDMHG;
        if(!isNum(dmHeight)){
            error("没有指定大坝高度");
            return;
        }
        var allpts = [];
        //坝左下方点
        allpts.push([0,0]);
        //坝左侧斜坡的宽度
        var damLeftW ;

        //坝左上角点
        if(isNum(config.UPDMSL)){
            damLeftW = dmHeight/config.UPDMSL;
            allpts.push([damLeftW, dmHeight]);
        }else{
            warn("上游多坡面坝尚未实现");
            return;
        }
        //坝右侧坡面宽度
        var damRightW ;
        var damRight = damLeftW+config.DMTPWD;
        //坝右上角点
        allpts.push([damRight , dmHeight]);
        //坝右下角
        if(isNum(config.DWDMSL)){
            damRightW = dmHeight/config.DWDMSL;
            allpts.push([damLeftW+config.DMTPWD+damRightW, 0]);
        }else{
            warn("下游多坡面坝尚未实现");
            return;
        }
        allpts.push([0,0])
        //绘制大坝
        allpts.forEach(function(item){
            ctx.lineTo(item[0],item[1]);
        });
    }
});
var DamHeart = ychart.extendView({
    type: "damHeart",

    defaultConfig: {
        style:{
            brushType: "both"
        }
    },

    BuildPath: function(ctx, config){
        if(!config.CDREWALL){
            return;
        }
        var CDREWALL = config.CDREWALL;
        var pts = [];
        pts.push([0,0]);
        var dmHeight = config.MAXDMHG;

        var damHeartLeftW;
        if(isNum(CDREWALL.UPSL)){
            damHeartLeftW = dmHeight * CDREWALL.UPSL;
            pts.push([damHeartLeftW,dmHeight]);
        }else{
            warn("心墙上游坝坡多折线尚未实现");
            return;
        }
        //心墙右上角
        pts.push([damHeartLeftW+CDREWALL.WIDTH , dmHeight]);
        //心墙右下角
        if(isNum(CDREWALL.DWSL)){
            let damHeartRightW = dmHeight * CDREWALL.DWSL;
            let right =damHeartLeftW+CDREWALL.WIDTH+damHeartRightW ;
            pts.push([right, 0]);
        }else{
            warn("心墙下游坝坡多折线尚未实现");
            return;
        }
        pts.forEach(function(item){
            ctx.lineTo(item[0],item[1]);
        })
    }
});

var WaterLevel = ychart.extendView({
    type: "waterLevel",

    defaultConfig: {
        style: {
            brushType: "fill",
            fillColor: "#1C6BA0",
            /* gradient: {
                beginColor: "#83ADF5",
                endColor: "#1C6BA0"
            } */
        }
    },

    BuildPath: function(ctx , config){
        if(!config.HYCH){
            error("当前水库没有指定水位数据");
            return;
        }
        var rectH = config.HYCH.Z || config.HYCH.NRPLLV;
        if(!isNum(rectH)){
            error("既没有指定正常蓄水位也没有指定实时水位");
            return;
        }
        var rectW = config.width || ctx.width;
        ctx.moveTo(0,0);
        ctx.lineTo(0,rectH);
        ctx.lineTo(rectW,rectH);
        ctx.lineTo(rectW,0);
        ctx.closePath();
    }
});

/**
 * 水尺
 */
var TideStaff = ychart.extendView({
    type: "TideStaff",

    defaultConfig: {
        style:{
            brushType: "stroke"
        }
    },

    BuildPath: function(ctx , config){
        var dmHeight = config.MAXDMHG;
        //水尺宽度
        var tidestaffW = 30;
        //水尺分为左右两部分
        var tidestaffLeftW = tidestaffW  * 2 /3;
        // var tidestaffRightW =tidestaffW * 1/3;
        //不同长度的水尺宽度
        var s_tidestaffLen = 5 , l_tidestaffLen = 8;
        //水尺的长短横线的间距
        var tidestaffSAndSLen = 10;
        //水尺左边的矩形
        var leftpts = [ [0,0], [0,dmHeight],[tidestaffLeftW,dmHeight],[tidestaffLeftW,0] ];
        ctx.moveTo(0,0);
        leftpts.forEach(function(item){
            ctx.lineTo(item[0],item[1]);
        })
        ctx.lineTo(0,0);

        //水尺右边矩形
        var rightpts = [[tidestaffW,dmHeight],[tidestaffW ,0] ];
        ctx.moveTo(tidestaffLeftW,dmHeight);
        rightpts.forEach(function(item){
            ctx.lineTo(item[0],item[1]);
        })
        ctx.lineTo(tidestaffLeftW ,0);


        //水尺左边边的水位标识
        //长水尺数量
        var l_tidestaffNum = parseInt(dmHeight/tidestaffSAndSLen);
        //短水尺数量
        var s_tidestaffNum = DamHeart - l_tidestaffNum;
        //长水尺的所有点
        var l_tidestaffpts = [];
        //长水尺的开始位置
        let l_tidestaffBegin = tidestaffLeftW-l_tidestaffLen;
        var i;
        for(i=0 ;i<l_tidestaffNum;i++){
            l_tidestaffpts.push([[l_tidestaffBegin,tidestaffSAndSLen*i],[tidestaffLeftW,tidestaffSAndSLen*i]])
        }
        l_tidestaffpts.forEach(function(item){
            ctx.moveTo(item[0][0],item[0][1]);
            ctx.lineTo(item[1][0],item[1][1]);
        })
        //短水尺的所有点
        var s_tidestaffpts = [];
        //短水尺的开始位置
        var s_tidestaffBegin = tidestaffLeftW-s_tidestaffLen;
        for(i=1 ;i<dmHeight ;i+=2){
            if(i % tidestaffSAndSLen != 0)
                s_tidestaffpts.push([[s_tidestaffBegin,i],[tidestaffLeftW,i]])
        }
        console.log(s_tidestaffpts)
        s_tidestaffpts.forEach(function(item){
            ctx.moveTo(item[0][0],item[0][1]);
            ctx.lineTo(item[1][0],item[1][1]);
        })
    }
});

function createTideStaff(config){
    var tidestaffGp = new ychart.Group();

    var dmHeight = config.MAXDMHG;
    //水尺宽度
    var tidestaffW = 30;
    //水尺分为左右两部分
    var tidestaffLeftW = tidestaffW  * 2 /3;
    // var tidestaffRightW =tidestaffW * 1/3;
    //不同长度的水尺宽度
    var s_tidestaffLen = 4 , l_tidestaffLen = 8;
    //水尺的长短横线的间距
    var tidestaffSAndSLen = 10;
    //水尺左边的矩形
    var leftpts = [ [0,0], [0,dmHeight],[tidestaffLeftW,dmHeight],[tidestaffLeftW,0],[0,0] ];
    tidestaffGp.add(new ychart.shape.Rect({
        pts: leftpts,
        style:{
            lineColor: "#083EF0"
        }
    }))

    //水尺右边矩形
    var rightpts = [[tidestaffLeftW ,dmHeight],[tidestaffW,dmHeight],[tidestaffW ,0] ,[tidestaffLeftW ,0]];
    tidestaffGp.add(new ychart.shape.Rect({
        pts: rightpts,
        style:{
            lineColor: "#083EF0"
        }
    }))

    //水尺左边边的水位标识
    //长水尺数量
    var l_tidestaffNum = parseInt(dmHeight/tidestaffSAndSLen);
    //短水尺数量
    var s_tidestaffNum = DamHeart - l_tidestaffNum;
    //长水尺的所有点
    var l_tidestaffpts = [];
    //长水尺的开始位置
    let l_tidestaffBegin = tidestaffLeftW-l_tidestaffLen;
    var i;
    for(i=1 ;i<l_tidestaffNum;i++){
        var crtH = tidestaffSAndSLen*i;
        //左边的长水尺
        tidestaffGp.add(new ychart.shape.Line({
            x0: l_tidestaffBegin,
            y0: crtH,
            x1: tidestaffLeftW,
            y1: crtH,
            text: crtH,
            textpos: "left-top",
            style:{
                lineColor: "#083EF0"
            }
        }))
    }
    //短水尺的开始位置
    var s_tidestaffBegin = tidestaffLeftW-s_tidestaffLen;
    for(i=1 ;i<dmHeight ;i+=2){
        if(i % tidestaffSAndSLen != 0){
            //左边的短水尺
            var crtH = i;
            tidestaffGp.add(new ychart.shape.Line({
                x0: s_tidestaffBegin,
                y0: crtH,
                x1: tidestaffLeftW,
                y1: crtH,
                // text: crtH,
                // textpos: "left-top",
                style:{
                    lineColor: "#083EF0"
                }
            }))
        }
    }
    //正常蓄水位
    var nrpllv = dmHeight - config.DMTPEL+config.HYCH.NRPLLV;
    tidestaffGp.add(new ychart.shape.Line({
        x0: tidestaffLeftW,
        y0: nrpllv,
        x1: tidestaffLeftW+s_tidestaffLen,
        y1: nrpllv,
        // text: " 正常蓄水位"+nrpllv,
        textPos: "right-center",
        style:{
            lineColor: "#083EF0"
        }
    }))
    console.log("正常蓄水位 "+nrpllv)
    //校核洪水位
    var chfllv = dmHeight-config.DMTPEL+config.HYCH.CHFLLV;
    tidestaffGp.add(new ychart.shape.Line({
        x0: tidestaffLeftW,
        y0: chfllv,
        x1: tidestaffLeftW+s_tidestaffLen,
        y1: chfllv,
        // text: " 校核洪水位"+chfllv,
        textPos: "right-center",
        style:{
            lineColor: "#083EF0"
        }
    }))
    console.log("校核洪水位 "+chfllv)
    //汛限水位
    var flsscnwl = dmHeight-config.DMTPEL+config.HYCH.FLSSCNWL;
    tidestaffGp.add(new ychart.shape.Line({
        x0: tidestaffLeftW,
        y0: flsscnwl,
        x1: tidestaffLeftW+s_tidestaffLen,
        y1: flsscnwl,
        // text: " 汛限水位"+chfllv,
        textPos: "right-center",
        style:{
            lineColor: "#083EF0"
        }
    }))
    console.log("汛期限制水位 "+flsscnwl);
    return tidestaffGp;
}

function drawWaterLevel(options){
    if(!options.MAXDMHG){
        alert("没有指定坝高");
        return;
    }
    yh = ychart.init(options.id);

    //大坝group
    var damGp = new ychart.Group({
        position: [100,0]
    })
    damGp.add(new Dam(options));

    //心墙group
    var heartGp = new ychart.Group({
        //指定心墙相对于大坝的位置
        position: [25,0]
    })
    heartGp.add(new DamHeart(options));
    damGp.add(heartGp);

    //水位group
    var wlGp = new ychart.Group({
    })
    wlGp.add(new WaterLevel(options));

    var tidestaffGp = new ychart.Group({
    })
    tidestaffGp.add(new TideStaff(options))

    var canvasH = yh.getHeight();
    var damH = options.MAXDMHG;
    var sc = canvasH / damH;
    sc = 5;
    var globalGp = new ychart.Group({
        scale: [sc,sc]
    })
    globalGp.add(createTideStaff(options));
    // globalGp.add(tidestaffGp)
    // globalGp.add(wlGp);
    globalGp.add(damGp);
    // globalGp.add(heartGp);

    yh.add(globalGp)
    yh.BrushAll();
}

