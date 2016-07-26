/**
 * Created by Administrator on 2016/6/22.
 */

define(function(require){
   "use strict";

    return require("./ShapeBuilder").extend({

        type: "Line",

        BuildPath: function (ctx, config) {
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
        }

    })


});
