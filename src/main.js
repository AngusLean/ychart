/**
 * 该类的唯一作用是打包时用来引入所有需要打包的组件。
 * 对于依赖于requirejs版本的打包，该文件依赖的组件都会被包含进来。
 * 对于打包成不依赖requirejs的版本，该文件导出的接口就是通过浏览器的YH全局变量访问到的接口。
 * 打包文件详情见 /build/
 */
define(
    ["Ycharts","shape/Bezier","shape/Circle","shape/Line","shape/Rect","shape/Triangle",
    "shape/YText","./extend/dam/dam" ,"./Group"],

    function(Ycharts ,Bezier ,Circle ,Line ,Rect ,Triangle ,YText ,Dam
    ,Group){
        function _YCharts(){

        }
        _YCharts.prototype = {
            constructure: _YCharts
        };
        
        _YCharts.ycharts = Ycharts;

        _YCharts.Group = Group;

        _YCharts.shape ={
            Bezier: Bezier,
            Circle: Circle,
            Line: Line,
            Rect: Rect,
            Triangle: Triangle,
            YText: YText,
            Dam: Dam
        };


        return _YCharts;
});