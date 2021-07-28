import * as THREE from "three";
// @ts-ignore
import waterVertexShader from "../shaders/water/vertex.glsl";
// @ts-ignore
import waterFragmentShader from "../shaders/water/fragment.glsl";
import {GUI} from "dat.gui";
import {Mesh, Scene, ShaderMaterial} from "three";

export class  WaterScene{

    private _water: Mesh;
    private _waterMaterial: ShaderMaterial;


    get water(): Mesh {
        return this._water;
    }

    get waterMaterial(): ShaderMaterial {
        return this._waterMaterial;
    }



    constructor ( scene: Scene,gui :GUI) {

    //Material
    const debugObject = {
        depthColor: 0x186691,
        surfaceColor: 0x9bd8ff
    }

    const waterMaterial = new THREE.ShaderMaterial(
        {
            vertexShader: waterVertexShader,
            fragmentShader: waterFragmentShader,
            transparent: true,
            uniforms: {
                uTime: {value: 0},
                uBigWavesElevation: {value: 5},
                uBigWavesFrequency: {value: new THREE.Vector2(.05, .05)},

                uSmallWavesElevation: {value: 4},
                uSmallWavesFrequency: {value: 0.2},
                uSmallWavesSpeed: {value: 0.2},
                uSmallWavesIterations: {value: 4.0},


                uDepthColor: {value: new THREE.Color(debugObject.depthColor)},
                uSurfaceColor: {value: new THREE.Color(debugObject.surfaceColor)},
                uColorOffset: {value: 0.08},
                uColorMultiplier: {value: 5}
            }

        }
    );

    //Geometry

    const waterGeometry = new THREE.PlaneBufferGeometry(2, 2, 1024, 1024);

    //GUI

    gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1000).step(0.001).name('uBigWaveElevation')
    gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10000).step(0.001).name('uBigWaveFrequencyY')
    gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10000).step(0.001).name('uBigWaveFrequencyY')
    gui.addColor(debugObject, 'depthColor').name('depthColor').onChange(() => {
        waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor);
    });
    gui.addColor(debugObject, 'surfaceColor').name('surfaceColor').onChange(() => {
        waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
    });

    gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset');
    gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier');


    gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(10).step(0.00001).name('smallWavesFrequency');
    gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(10000).step(0.1).name('smallWavesElevation');


    //Mesh
    const water = new THREE.Mesh(waterGeometry, waterMaterial)
    water.rotation.x = -Math.PI * 0.5;
    water.scale.set(1000, 1000, 10);
    scene.add(water);

    this._water = water;
    this._waterMaterial = waterMaterial;

}




}