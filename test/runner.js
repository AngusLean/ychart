
var uid = 1000;
var parent = document.getElementById("container");
function generateContainer(width,height,visible){
    var div = document.createElement("div");
    div.style = "width: "+width+"px ; height:"+height+"px; visibility:"+visible+";position:relative;"
    var id = "testContainer-"+uid++;
    div.setAttribute("id",id);
    parent.appendChild(div);

    return id;
}

var globalInstanceCount = 0;
function generateHiddeYchart(){
    var id = generateContainer(10,10,"hidden");
    var yh = ychart.init(id);
    return yh;
}

function generateRandomElement(){
    var line = new ychart.shape.Line({
        x0: 0,
        y0: 0,
        x1: 10,
        y1: 10
    });
    return line;
}
