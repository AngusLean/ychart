var ClientToLocal = function(el, e, out) {
    var out = out || {};
    var box = el.getBoundingClientRect();
    out.ycX = e.clientX - box.left;
    out.ycY = e.clientY - box.top;

    return out;
};

export default {
    addHandler: function(element, type, handler) {
        element.addEventListener(type, handler, false);
    },
    removeHandler: function(element, type, handler) {
        element.removeEventListener(type, handler);
    },
    getEvent: function(event) {
        return event ? event : window.event;
    },
    getTarget: function(event) {
        return event.target || event.srcElement;
    },
    preventDefault: function(event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    stopPropagation: function(event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },
    stop: function(event) {
        this.preventDefault(event);
        this.stopPropagation(event);
    },
    clientToLocal: ClientToLocal,
};
