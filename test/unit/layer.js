var yh,layers,layer;
beforeEach(function(){
    yh = generateHiddeYchart();
    layers = yh.__painter.__layer;
    layer = layers[0];
});

describe("Layer",function(){
    describe("Before call ychart.BrushAll",function(){
        it("layer instance should be a array in ychart.__painter.__layer",function(){
            expect(layers).toBeArray();
        })
        it("layer instance should not be a object",function(){
            expect(layer).toBeUndefined();
        })
    });
    describe("call ychart.BrsuhAll",function(){
        yh.addChild(generateRandomElement());
    });
    describe("After call ychart.BrushAll",function(){
        it("layer instance should be a array in ychart.__painter.__layer",function(){
            expect(layers).toBeArray();
        })
        it("layer instance should be a object",function(){
            expect(layer).toBeObject();
        })
    });

    describe("ychart-instance ",function(){
        it(" member test" ,function(){
            //console.log(layer.dom)
        })
    });
});
