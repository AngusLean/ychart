var yh,layers,layer;
(function(){
    yh = generateHiddeYchart();
    layers = yh.__painter.__layer;
    layer = layers[0];
})();

describe("Layer",function(){
    describe("Before call ychart.BrushAll",function(){
        it("layer instance should be a array in ychart.__painter.__layer",function(){
            expect(layers).toBeArray();
        })
    });
    describe("After Add Element and call ychart.BrushAll",function(){
        yh.add(generateRandomElement());
        yh.BrushAll();
        layer = layers[0];

        it("layer instance should be a array in ychart.__painter.__layer",function(){
            expect(layers).toBeArray();
        })
        it("layer instance should be a object",function(){
            console.log(layers);
            expect(layer).toBeObject();
        })
    });

    describe("ychart-instance ",function(){
    });
});
