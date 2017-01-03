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
}
var error = function(text){
    console.error(text);
}
var isNum = function(dt){
    return !isNaN(dt);
}

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
