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
import {WaterScene} from "./Environment/WaterScene";


let canvas = document.querySelector("#c") as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({canvas});

const camera = new THREE.PerspectiveCamera( 40, 2, 0.1, 3000);
const gui = new GUI();

movementControlling(camera,renderer.domElement,.1,gui);

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


const waterScene = new WaterScene(scene,gui);




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




/*DEBUG
*/
import {GridChunkDirector} from "./terrain_chunk/ChunkDirector/GridChunkDirector";

window.THREE = THREE;
//@ts-ignore
window.ChunkDirector = GridChunkDirector;
//@ts-ignore
window.camera = camera;

/*
 */

