var _ctx = null;

function createCanvas() {
    return document.createElement("canvas");
}

export var getContext = function () {
    if (!_ctx) {
        _ctx = createCanvas().getContext("2d");
    }
    return _ctx;
};

//todo 这种方式判断鼠标是否在形状内效率不高。改进
export var isPtInPath = function (shape, config, x, y) {
    var ctx = getContext();
    ctx.save();
    //设置变换
    shape.BeforeBrush(ctx, config);
    //建立路径
    shape.BuildPath(ctx, config);
    var rs;
    var type = shape.configProxy.getBrushType();
    //对于填充和边线+填充的图形调用isPointInPath方法
    if (type == "all" || type == "fill") {
        rs = ctx.isPointInPath(x, y);
    } else {
        rs = ctx.isPointInStroke(x, y);
    }
    ctx.restore();
    return rs;
};

