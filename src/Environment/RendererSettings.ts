import * as THREE from "three";
import TerrainChunkManager from "../terrain_chunk/TerrainChunkManager";
import {PerspectiveCamera, Scene} from "three";
import SkyBox from "../SkyBox";

export class Renderer {

    private _terrainChunkManager: TerrainChunkManager;
    private _camera;
    private renderer;
    private _scene ;


    constructor(camera: PerspectiveCamera, canvas: HTMLCanvasElement,scene:Scene) {
        this._camera = camera;
        this._scene = scene;
        this._terrainChunkManager = new TerrainChunkManager(this._scene, this._camera);
        this.renderer = new THREE.WebGLRenderer({canvas});

    }

    public resizeRendererToDisplaySize(renderer: THREE.Renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }

        return needResize;
    }

    private  newRender=():void=>{
        this._terrainChunkManager.checkCameraAndAddTerrain();

        if (this.resizeRendererToDisplaySize(this.renderer)) {
            const canvas = this.renderer.domElement;
            this._camera.aspect = canvas.clientWidth / canvas.clientHeight;
            this._camera.updateProjectionMatrix();
        }

        this.renderer.render(this._scene, this._camera);

        requestAnimationFrame(this.newRender);
    }

    public render() {
        this.newRender();
    }
}
