import * as THREE from "three";
import {GUI} from "dat.gui";
import {PlaneCreator} from "./PlaneCreator";
import {movementControlling} from "./MovementControlling";
import {AxesHelper} from "three";


let canvas = document.querySelector("#c") as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({canvas});
const gui = new GUI();
const camera = new THREE.PerspectiveCamera( 40, 2, 0.1, 3000);

movementControlling(camera,renderer.domElement,.1);

camera.position.set(0,5,0);
camera.lookAt(1,1,1);


// document.addEventListener("keydown", onKeyDown,false);



const scene = new THREE.Scene();
const loader = new THREE.TextureLoader();

const plane = new PlaneCreator(loader,512,128,0,0).plane;
const plane2 = new PlaneCreator(loader,512,128,512,0).plane;
const plane3 = new PlaneCreator(loader,512,128,512,512).plane;



const axesHelper : AxesHelper = new AxesHelper();
axesHelper.add(plane,plane2,plane3);




scene.add(plane,plane2,plane3,axesHelper);



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


function render() {


    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

requestAnimationFrame(render);


