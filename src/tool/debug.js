import {isObj,isArr} from "./util";

var dbpre = "DamJs Debug Info :    ";
var wnpre = "DamJs warn Info :    ";
var dbprespace = function () {
    var i = 0, rs = "      ";
    for (i = 0; i < dbpre.length; i++) {
        rs += " ";
    }
    return rs;
}();

var debug = function (info) {
    console.log(dbpre + info);
};

var warn = function (info) {
    console.log(wnpre + info);
};

var isobj = false;
var printobj = function (obj) {
    function _printObj(obj) {
        var ele;
        if (isObj(obj)) {
            for (ele in obj) {
                if (isObj(obj[ele])) {
                    debug(ele + " : ");
                    isobj = true;
                    printObj(obj[ele]);
                    isobj = false;
                } else {
                    if (isobj) {
                        console.log(dbprespace + ele + " : " + obj[ele]);
                    }
                    else
                        debug(ele + " : " + obj[ele]);
                }
            }
        } else if (isArr(obj)) {
            var len = obj.length;
            for (var i = 0; i < len; i++) {
                printObj(obj[i]);
            }
        }
    }

    _printObj(obj);
    isobj = false;
};

export default {
    printobj,
    debug,
    warn
};

