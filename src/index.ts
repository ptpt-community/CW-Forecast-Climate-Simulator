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

const cameraBasic = new CameraSettings()
const camera = cameraBasic.getCamera()
const gui = GuiSingleton.getGui()//3
//renderInstantiate
const scene = new THREE.Scene();

const renderer_class =new Renderer(camera,canvas,scene)
renderer_class.render()


movementControlling(camera,renderer.domElement,.1,gui);

/*new THREE.Camera()
const terrainChunkManager =new TerrainChunkManager(scene,camera);*/
new SkyBox(scene);

const light = new LightSettings(scene)
light.directionalLightManager()

/*function resizeRendererToDisplaySize(renderer:THREE.Renderer){
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !==height;
    if (needResize){
        renderer.setSize(width,height,false);
    }

    return needResize;
}*/

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


/*function render() {

    terrainChunkManager.checkCameraAndAddTerrain();
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

requestAnimationFrame(render);*/




/*DEBUG
*/
import {GridChunkDirector} from "./terrain_chunk/ChunkDirector/GridChunkDirector";
import {GuiSingleton} from "./GUI/GUI";
import {LightSettings} from "./Environment/LightSettings";
import {CameraSettings} from "./Environment/CameraSettings";
import {Renderer} from "./Environment/RendererSettings";

window.THREE = THREE;
//@ts-ignore
window.ChunkDirector = GridChunkDirector;
//@ts-ignore
window.camera = camera;

/*
 */

