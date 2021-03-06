function parseInt10(val) {
    return parseInt(val, 10);
}
export var getPosition = function (id) {
    var element = typeof id == "string" ? document.getElementById(id) : id;
    var st = document.defaultView.getComputedStyle(element);

    var rect = element.getBoundingClientRect();
    var scrollTop = document.documentElement.scrollTop ?
        document.documentElement.scrollTop : document.body.scrollTop;
    var scrollLeft = document.documentElement.scrollLeft ?
        document.documentElement.scrollLeft : document.body.scrollLeft;
    return {
        width: (element.clientWidth || parseInt10(st.width) || parseInt10(element.style.width) -
            (parseInt10(st.paddingLeft) || 0) -
                (parseInt10(st.paddingRight))) || 0,

        height: (element.clientHeight || parseInt10(st.height) || parseInt10(element.style.height) -
            (parseInt10(st.paddingTop) || 0) -
                (parseInt10(st.paddingBottom))) || 0,
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft
    };
};

var CACHE = {};

export var getRectByCtx = function(context){
    let canvas = context.canvas;
    if(CACHE[canvas]){
        return CACHE[canvas];
    }
    CACHE[canvas] = [canvas.width ,canvas.height];
    return CACHE[canvas];
};

export var doc = function (id) {
    return document.getElementById(id);
};

/* eslint-disable */
export var createDOM = function (id, type, desc, pos ,style , attr) {
    var newdom = document.createElement(type);
    var st = newdom.style;
    st.position = typeof pos === "undefined" ? "absolute" : pos;
    if(style){
        for(let item in style){
            if(isNaN(style[item])){
                st[item] = style[item];
            }else{
                st[item] = style[item]+"px";
            }
        }
    }
    if(attr){
        for(let item in attr){
            newdom[item] = attr[item];
        }
    }
    newdom.setAttribute("ychart-"+desc, id);
    return newdom;
};


export var getContext = function (drawing) {
    if (drawing && drawing.getContext) {
        return drawing.getContext("2d");
    }
    return null;
};
