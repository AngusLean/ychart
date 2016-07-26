define(function(require){

    var sqrt = function(val){
        return Math.sqrt(val);
    };

    var pow2 = function(val){
        return Math.pow(val,2);
    }

    var _ctx = null;
    var getContext = function(){
        function createCanvas(){
            return document.createElement("canvas");
        }
        if(!_ctx){
            _ctx = createCanvas().getContext("2d");
        }
        return _ctx;
    }

    var isPtInPath = function(shape ,config , x , y){
        var ctx = getContext();
        ctx.save();
        ctx.beginPath();
        shape.BuildPath(ctx ,config);
        var rs = ctx.isPointInPath(x , y);
        ctx.restore();
        return rs;
    }

    return {
        distanceOf2Point: function(point1 ,point2){
            return sqrt(pow2(point2[0]-point1[0])+pow2(point2[1]-point1[1]));
        },
        getContext: getContext,
        isPtInPath : isPtInPath
    }
});
