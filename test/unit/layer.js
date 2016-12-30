suite("root components", function () {
    test("layer", function () {
        var a = 20;
        var b = 10;
        // assert.equal(a == b, "is true");

        var yh = ychart.init(createYchartContainer());
        assert.equal(yh == undefined , "ychart instanse must not undefined");
    });
});


