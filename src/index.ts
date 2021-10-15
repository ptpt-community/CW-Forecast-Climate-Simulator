import * as THREE from "three"
import {
    AmbientLight, BoxGeometry,
    CameraHelper,
    Clock,
    DirectionalLight, Mesh, MeshBasicMaterial,
    PlaneGeometry, RepeatWrapping,
    Scene,
    TextureLoader, Vector3,
    WebGLRenderer
} from "three";
import {GUI} from "dat.gui";
import {movementControlling} from "./MovementControlling";
import SkyBox from "./SkyBox";
import {LightSettings} from "./Environment/LightSettings";
import {CameraSettings} from "./Environment/CameraSettings";
import {RendererSettings} from "./Environment/RendererSettings";
import {GuiSingleton} from "./GUI/GUI";


// @ts-ignore
import waterVertexShader from './shaders/water/vertex.glsl';
//@ts-ignore
import waterFragmentShader from './shaders/water/fragment.glsl';
import {WaterScene} from "./Environment/WaterScene";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader";
import {Water} from "three/examples/jsm/objects/Water";
import {Sky} from "three/examples/jsm/objects/Sky";

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

//Water

function buildWater() {
    const waterGeometry = new PlaneGeometry(1500, 1500);
    const water = new Water(
        waterGeometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new TextureLoader().load('', function ( texture ) {
                texture.wrapS = texture.wrapT = RepeatWrapping;
            }),
            alpha: 1.0,
            sunDirection: new Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: scene.fog !== undefined
        }
    );
    water.rotation.x =- Math.PI / 2;
    scene.add(water);

    //@ts-ignore
    const waterUniforms = water.material.uniforms;
    return water;
}

const water = buildWater();

function update() {
    // @ts-ignore
    water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
    // renderer.render(scene, camera);
}


// const waterScene = new WaterScene(scene, gui);


/*Sky
*/


function buildSky() {
    const sky = new Sky();
    sky.scale.setScalar(10000);
    scene.add(sky);
    return sky;
}

const sky : Sky = buildSky();
//sun
function buildSun() {
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const sun = new THREE.Vector3();

    // Defining the x, y and z value for our 3D Vector
    const theta = Math.PI * (0.49 - 0.5);
    const phi = 2 * Math.PI * (0.205 - 0.5);
    sun.x = Math.cos(phi);
    sun.y = Math.sin(phi) * Math.sin(theta);
    sun.z = Math.sin(phi) * Math.cos(theta);


    sky.material.uniforms['sunPosition'].value.copy(sun);

    //@ts-ignore
    scene.environment = pmremGenerator.fromScene(sky).texture;
    return sun;
}
buildSun();
//end sky

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

