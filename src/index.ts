import * as THREE from "three";
import {GUI} from "dat.gui";
import {Line, Material, Mesh, MeshBasicMaterial, MeshPhongMaterial, PlaneGeometry} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {LineGeometry} from "three/examples/jsm/lines/LineGeometry";
import {noise} from "./libs/noise";
import {Sky} from "three/examples/jsm/objects/Sky";
import {PlaneCreator} from "./PlaneCreator";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";


let canvas = document.querySelector("#c") as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({canvas});
const gui = new GUI();
const camera = new THREE.PerspectiveCamera( 40, 2, 0.1, 3000);
const controls = new TrackballControls(camera,canvas);
controls.target.set(0, 5, 0);
controls.update();


camera.position.set(0,20,200);
camera.lookAt(0,0,0)

const scene = new THREE.Scene();
const loader = new THREE.TextureLoader();

const plane = new PlaneCreator(loader,512,128,0,0).plane;








scene.add(plane);



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


