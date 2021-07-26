import * as THREE from "three";
import {AmbientLight, CameraHelper, Clock, DirectionalLight} from "three";
import {GUI} from "dat.gui";
import {movementControlling} from "./MovementControlling";
import SkyBox from "./SkyBox";
import TerrainChunkManager from "./terrain_chunk/TerrainChunkManager";
// @ts-ignore
import waterVertexShader from './shaders/water/vertex.glsl';
//@ts-ignore
import waterFragmentShader from './shaders/water/fragment.glsl';

let canvas = document.querySelector("#c") as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({canvas});

const camera = new THREE.PerspectiveCamera( 40, 2, 0.1, 3000);

movementControlling(camera,renderer.domElement,100);

camera.position.set(0,5,0);
camera.lookAt(1,1,1);


const effectController = {
    turbidity: 10,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    elevation: 2,
    azimuth: 180,
    exposure: renderer.toneMappingExposure
};

const scene = new THREE.Scene();
const terrainChunkManager =new TerrainChunkManager(scene,camera);
new SkyBox(scene);

const light = new DirectionalLight(0xffffff, 1.5);
light.castShadow = true;
light.shadow.camera.left= -1000;
light.shadow.camera.right= 1000;
light.shadow.camera.top= 1000;
light.shadow.camera.bottom= -1000;
light.shadow.camera.far = 2000;
light.position.set(400,800,800);

light.shadow.mapSize.set(512,512);


const ambientLight = new AmbientLight(0x999999,.5);
scene.add(light);
const shadowHelper = new CameraHelper(light.shadow.camera);
scene.add(shadowHelper,ambientLight);

const gui = new GUI();
// gui.add(params, "intensity").min(0).max(10).step(.001).onFinishChange(()=>{
//     light.intensity = params.intensity;
// })


//TODO: SKY
// const sky = new Sky();
// sky.position.set(0,500,0);
// sky.visible = true;
// sky.scale.setScalar(10000);
// sky.material.uniforms.turbidity.value = effectController.turbidity;
// sky.material.uniforms.rayleigh.value = effectController.rayleigh;
// sky.material.uniforms.mieCoefficient.value = effectController.mieCoefficient;
// sky.material.uniforms.mieDirectionalG.value = effectController.mieDirectionalG;
//scene.add(sky);



function resizeRendererToDisplaySize(renderer:THREE.Renderer){
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !==height;
    if (needResize){
        renderer.setSize(width,height,false);
    }

    return needResize;
}

renderer.shadowMap.enabled = true;

//WATER


/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneBufferGeometry(2, 2, 1024, 1024);

const debugObject = {
    depthColor: 0x186691,
    surfaceColor: 0x9bd8ff
}



// Material
const waterMaterial = new THREE.ShaderMaterial(
    {
        vertexShader: waterVertexShader,
        fragmentShader: waterFragmentShader,
        uniforms: {
            uTime: {value: 0},
            uBigWavesElevation : {value: 0.2},
            uBigWavesFrequency : {value: new THREE.Vector2(4,1.5)},

            uSmallWavesElevation: {value: 0.15},
            uSmallWavesFrequency: {value: 3},
            uSmallWavesSpeed: {value: 0.2},
            uSmallWavesIterations: {value: 4.0},


            uDepthColor: {value: new THREE.Color(debugObject.depthColor)},
            uSurfaceColor: {value: new THREE.Color(debugObject.surfaceColor)},
            uColorOffset: {value: 0.08},
            uColorMultiplier: {value: 5}
        }

    }

);


//Debug
gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWaveElevation')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWaveFrequencyY')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWaveFrequencyY')
gui.addColor(debugObject,'depthColor').name('depthColor').onChange(()=>{
    waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor);
});
gui.addColor(debugObject,'surfaceColor').name('surfaceColor').onChange(()=>{
    waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
});

gui.add(waterMaterial.uniforms.uColorOffset,'value').min(0).max(1).step(0.001).name('uColorOffset');
gui.add(waterMaterial.uniforms.uColorMultiplier,'value').min(0).max(10).step(0.001).name('uColorMultiplier');

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5;
//water.scale.set(1,1,1);
scene.add(water)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes

    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})





//
const clock = new Clock();


function render() {
    water.position.set(camera.position.x,0,camera.position.z);
    waterMaterial.uniforms.uTime.value = clock.getElapsedTime();
    terrainChunkManager.checkCameraAndAddTerrain();
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

requestAnimationFrame(render);


