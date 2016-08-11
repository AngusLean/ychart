import {isArr} from "../../../tool/util"

var moveable = function () {

};

moveable.prototype = {
    constructor: moveable,

    drift: function (dx, dy) {
        if (!isArr(this.position)) {
            this.position = [0, 0];
        }

        this.position[0] += dx;
        this.position[1] += dy;

        this.__dirty = true;
    },

    move: function (dx, dy) {
        this.drift(dx, dy);
    },

    rotate: function (x, y, angle) {
        if (!isArr(this.origin)) {
            this.origin = [0, 0];
        }
        this.origin[0] = x;
        this.origin[1] = y;
        this.rotation = angle;

        this.__dirty = true;
    }
};


export default moveable;
