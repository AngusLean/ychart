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
        //汛限水位
        FLSSCNWL: 0,
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
    return !isNaN(dt);
};

var Dam = ychart.extendView({
    type: "Dam",
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
        //坝右上角点
        allpts.push([damLeftW+config.DMTPWD , dmHeight]);
        //坝右下角
        if(isNum(config.DWDMSL)){
            damRightW = dmHeight/config.DWDMSL;
            allpts.push([damLeftW+config.DMTPWD+damRightW, dmHeight]);
        }else{
            warn("下游多坡面坝尚未实现");
            return;
        }
        //绘制大坝
        ctx.moveTo(0,0);
        allpts.forEach(function(item){
            ctx.lineTo(item[0],item[1]);
        });
    }
});
var DamHeart = ychart.extendView({
    type: "damHeart",

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
            damHeartLeftW = dmHeight / CDREWALL.UPSL;
            pts.push([damHeartLeftW,dmHeight]);
        }else{
            warn("心墙上游坝坡多折线尚未实现");
            return;
        }
        //心墙右上角
        pts.push([damHeartLeftW+CDREWALL.WIDTH , dmHeight]);
        //心墙右下角
        var damHeartRightW;
        if(isNum(CDREWALL.DMSL)){
            damHeartLeftW = dmHeight / CDREWALL.DMSL;
            pts.push([damHeartLeftW+CDREWALL.WIDTH+damHeartRightW , 0]);
        }else{
            warn("心墙上游坝坡多折线尚未实现");
            return;
        }
    }
});

var WaterLevel = ychart.extendView({
    type: "waterLevel",

    defaultConfig: {
        style: {
            fillColor: "#1C6BA0",
            brushType: "fill",
            gradient: {
                beginColor: "#83ADF5",
                endColor: "#1C6BA0"
            }
        }
    },

    BuildPath: function(ctx , config){
        if(!config.HYCH){
            error("当前水库没有指定水位数据");
            return;
        }
        var rectH = config.Z || config.NRPLLV;
        if(!isNum(rectH)){
            error("既没有指定正常蓄水位也没有指定实时水位");
            return;
        }
        var rectW = config.with || ctx.width;
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
        var tidestaffSAndSLen = 5;
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
        for(let i=0 ;i<l_tidestaffNum;i++){
            l_tidestaffpts.push([l_tidestaffBegin,tidestaffSAndSLen*i])
        }
        //短水尺的所有点
        var s_tidestaffpts = [];
        //短水尺的开始位置
        let s_tidestaffBegin = tidestaffLeftW-s_tidestaffLen;
        for(let i=1 ;i<l_tidestaffNum;i++){
            s_tidestaffpts.push([s_tidestaffBegin,i])
        }


    }
});
