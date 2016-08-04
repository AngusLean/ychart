define(function(require){

    var sqrt = function(val){
        return Math.sqrt(val);
    };

    var pow2 = function(val){
        return Math.pow(val,2);
    };
    
    
    var _ctx = null;
    
    var getContext = function(){
        function createCanvas(){
            return document.createElement("canvas");
        }
        if(!_ctx){
            _ctx = createCanvas().getContext("2d");
        }
        return _ctx;
    };

    //todo 这种方式判断鼠标是否在形状内效率不高。改进
    var isPtInPath = function(shape ,config , x , y){
        var ctx = getContext();
        ctx.save();
        //设置变换
        shape.BeforeBrush(ctx);
        //建立路径
        shape.BuildPath(ctx ,config);
        var rs;
        var type=shape.configProxy.getBrushType();
        //对于填充和边线+填充的图形调用isPointInPath方法
        if(type == "all" || type == "fill"){
            rs = ctx.isPointInPath(x , y);
        }else{
            rs = ctx.isPointInStroke(x , y) ;
        }
        ctx.restore();
        return rs;
    };

    return {
        distanceOf2Point: function(point1 ,point2){
            return sqrt(pow2(point2[0]-point1[0])+pow2(point2[1]-point1[1]));
        },
        getContext: getContext,
        isPtInPath : isPtInPath
    }
});