import * as THREE from "three";
import {GUI} from "dat.gui";
import {Line, Material, Mesh, MeshBasicMaterial, MeshPhongMaterial, PlaneGeometry} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {LineGeometry} from "three/examples/jsm/lines/LineGeometry";
import {noise} from "./libs/noise";
import {Sky} from "three/examples/jsm/objects/Sky";


let canvas = document.querySelector("#c") as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({canvas});
const gui = new GUI();
const camera = new THREE.PerspectiveCamera( 40, 2, 0.1, 3000);
const controls = new OrbitControls(camera,renderer.domElement);
controls.target.set(0, 5, 0);
controls.update();


camera.position.set(0,20,200);
camera.lookAt(0,0,0)

const scene = new THREE.Scene();
const loader = new THREE.TextureLoader();
const texture = loader.load("https://th.bing.com/th/id/OIP.kJ-tZYAV3pa9gb4JFgb1GgHaE8?pid=ImgDet&rs=1");
const plane = new THREE.Mesh(new PlaneGeometry(4500,4500,1500,1500),new MeshBasicMaterial({

    wireframe: false,
    map: texture
}));




texture.needsUpdate = true;



scene.add(plane);

const sky = new Sky();
sky.scale.setScalar(10000);
sky.visible= true;
//@ts-ignore
window.sky = sky;
sky.position.set(0,0,2000);
scene.add(sky);

{
const planePositions = plane.geometry.getAttribute("position");
console.log(planePositions.count);
const noiseGenerator = new noise.Noise({
    octaves: 10,
    persistence: 0.5,
    lacunarity: 2.0,
    exponentiation: 3.9,
    height: 1000,
    scale: 2000,
    noiseType: 'simplex',
    seed: 1
})
for(let i = 0; i<planePositions.count; i++){
    planePositions.setZ(i,noiseGenerator.Get(planePositions.getX(i),planePositions.getY(i)));
}

plane.geometry.attributes.position.needsUpdate = true;
}
{

    let light = new THREE.DirectionalLight("0xFFFFFF",20);
    scene.add(light);
}



class AxisGridHelper{
    private grid: THREE.GridHelper;
    private axes: THREE.AxesHelper;
    private _visible: boolean;

    constructor(node: THREE.Object3D, units: number | undefined) {
        const axes = new THREE.AxesHelper();
        const axesMaterial = axes.material as THREE.Material;
        axesMaterial.depthTest = false;
        axes.renderOrder = 2;
        node.add(axes);

        const grid = new THREE.GridHelper(units,units);
        const gridMaterial = grid.material as THREE.Material;
        gridMaterial.depthTest = false;
        grid.renderOrder = 1;
        node.add(grid);

        this.grid = grid;
        this.axes = axes;
        this._visible = this.grid.visible;
    }

    get visible() : boolean{
        return this._visible;
    }

    set visible(v:boolean){
      this._visible = v;
      this.grid.visible = v;
      this.axes.visible = v;
    }


}


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


