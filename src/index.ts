import * as THREE from "three";
import {GUI} from "dat.gui";
import {movementControlling} from "./MovementControlling";
import {AmbientLight, AxesHelper, CameraHelper, DirectionalLight} from "three";
import SkyBox from "./SkyBox";
import TerrainChunkManager from "./terrain_chunk/TerrainChunkManager";
import {PlaneCreator} from "./terrain_chunk/PlaneCreator";
import {Sky} from "three/examples/jsm/objects/Sky";


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


