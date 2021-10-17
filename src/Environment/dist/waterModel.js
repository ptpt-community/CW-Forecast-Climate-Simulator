"use strict";
exports.__esModule = true;
var Water_1 = require("three/examples/jsm/objects/Water");
var three_1 = require("three");
var WaterModel = /** @class */ (function () {
    function WaterModel(sun) {
        this.water = undefined;
        this.sun = sun;
    }
    WaterModel.prototype.updateRender = function () {
        if (this.water === undefined)
            return;
        // @ts-ignore
        this.water.material.uniforms['time'].value += 1.0 / 60.0;
    };
    WaterModel.prototype.addToScene = function (scene) {
        var waterGeometry = new three_1.PlaneGeometry(1500, 1500);
        var water = new Water_1.Water(waterGeometry, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new three_1.TextureLoader().load('https://threejs.org/examples/textures/waternormals.jpg', function (texture) {
                texture.wrapS = texture.wrapT = three_1.RepeatWrapping;
            }),
            alpha: .5,
            sunDirection: this.sun,
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: scene.fog !== undefined
        });
        water.rotation.x = -Math.PI / 2;
        scene.add(water);
        //@ts-ignore
        var waterUniforms = water.material.uniforms;
        console.log(waterUniforms);
        waterUniforms.size.value = 500;
        this.water = water;
        //@ts-ignore
        window.water = water;
    };
    return WaterModel;
}());
exports.WaterModel = WaterModel;

//# sourceMappingURL=waterModel.js.map
