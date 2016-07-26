define(function (require, exports, module) {

    var beginid = 1000;
    var guid = function(){
        return beginid++;
    };

    return guid;
});
