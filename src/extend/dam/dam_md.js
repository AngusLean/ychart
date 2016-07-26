/**
 * 水库模型。
 */
define(function(require){

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
