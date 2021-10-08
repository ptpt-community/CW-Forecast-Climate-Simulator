import * as THREE from "three";
import {AmbientLight, CameraHelper, Clock, DirectionalLight} from "three";
import {GUI} from "dat.gui";
import {movementControlling} from "./MovementControlling";
import SkyBox from "./SkyBox";
import {LightSettings} from "./Environment/LightSettings";
import {CameraSettings} from "./Environment/CameraSettings";
import {Renderer} from "./Environment/RendererSettings";
import {GuiSingleton} from "./GUI/GUI";


// @ts-ignore
import waterVertexShader from './shaders/water/vertex.glsl';
//@ts-ignore
import waterFragmentShader from './shaders/water/fragment.glsl';
import {WaterScene} from "./Environment/WaterScene";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader";

let canvas = document.querySelector("#c") as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({canvas});

//@ts-ignore----------------
window.debug = {}

const cameraBasic = new CameraSettings()
const camera = cameraBasic.getCamera()
const gui = GuiSingleton.getGui()//3
//renderInstantiate
const scene = new THREE.Scene();

const renderer_class = new Renderer(camera, canvas, scene)
renderer_class.render()


movementControlling(camera, renderer.domElement, .1, gui);

/*new THREE.Camera()
const terrainChunkManager =new TerrainChunkManager(scene,camera);*/
new SkyBox(scene);

const light = new LightSettings(scene)
light.directionalLightManager()

renderer.shadowMap.enabled = true;


/*
const waterScene = new WaterScene(scene, gui);
*/


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
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


const clock = new Clock();

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
const cube = new THREE.Mesh( geometry, material );
cube.position.set(10,10,10)
scene.add( cube );



window.THREE = THREE;
//@ts-ignore
//@ts-ignore
window.camera = camera;

/*
 */

