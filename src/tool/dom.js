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
    }
};

export var doc = function (id) {
    return document.getElementById(id);
};


export var createDOM = function (id, type, width, height, left, top) {
    var newdom = document.createElement(type);

    var st = newdom.style;
    st.position = "absolute";
    st.left = left;
    st.top = top;
    st.width = width + "px";
    st.height = height + "px";
    newdom.width = width;
    newdom.height = height;
    newdom.setAttribute("ychart-layer", id);
    return newdom;
};


export var getContext = function (drawing) {
    if (drawing && drawing.getContext) {
        return drawing.getContext("2d");
    }
    return null;
};