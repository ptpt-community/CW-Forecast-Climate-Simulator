import * as THREE from "three"
import {Scene} from "three"
import {movementControlling} from "./MovementControlling";
import {LightSettings} from "./Environment/LightSettings";
import {CameraSettings} from "./Environment/CameraSettings";
import {RendererSettings} from "./Environment/RendererSettings";
import {GuiSingleton} from "./GUI/GUI";


// @ts-ignore
import waterVertexShader from './shaders/water/vertex.glsl';
//@ts-ignore
import waterFragmentShader from './shaders/water/fragment.glsl';
import {Sky} from "three/examples/jsm/objects/Sky";
import {WaterModel} from "./Environment/waterModel";

let canvas = document.querySelector("#c") as HTMLCanvasElement;


//@ts-ignore----------------
window.debug = {}

const cameraBasic = new CameraSettings()
const camera = cameraBasic.getCamera()
const gui = GuiSingleton.getGui()//3
//renderInstantiate
const scene = new Scene();

const rendererSettings = new RendererSettings(camera, canvas, scene);
const renderer = rendererSettings.getRenderer();
rendererSettings.render()


movementControlling(camera, renderer.domElement, .3, gui);

/*new THREE.Camera()
const terrainChunkManager =new TerrainChunkManager(scene,camera);*/
// new SkyBox(scene);

const light = new LightSettings(scene)
light.directionalLightManager()

renderer.shadowMap.enabled = true;



// const waterScene = new WaterScene(scene, gui);


/*Sky
*/


function buildSky() {
    const sky = new Sky();
    sky.scale.setScalar(10000);
     sky.material.uniforms["turbidity"].value = 5;
     sky.material.uniforms["rayleigh"].value = 15;
     sky.material.uniforms["mieCoefficient"].value = .5;
     sky.material.uniforms["mieDirectionalG"].value = .999999999;

     //sky.material.uniforms["luminance"].value = 1;
     console.log(sky.material.uniforms)
    scene.add(sky);
    return sky;
}


//sun
function buildSun() {
    const sky : Sky = buildSky();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const sun = new THREE.Vector3();

    // Defining the x, y and z value for our 3D Vector
    const inclination = 0.31;
    const azimuth = .25;

    const theta = Math.PI * (inclination - 0.5);
    const phi = 2 * Math.PI * (azimuth - 0.5);
    sun.x = Math.cos(phi);
    sun.y = Math.sin(phi) * Math.sin(theta);
    sun.z = Math.sin(phi) * Math.cos(theta);


    sky.material.uniforms['sunPosition'].value.copy(sun);

    //@ts-ignore
    scene.environment = pmremGenerator.fromScene(sky).texture;
    return sun;
}
const sun = buildSun();
//end sky


//Water

const water = new WaterModel(sun);
water.addToScene(scene);
rendererSettings.addRenderable(water);

//endWater

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





// window.THREE = THREE;
//@ts-ignore
//@ts-ignore
window.camera = camera;

/*
 */

