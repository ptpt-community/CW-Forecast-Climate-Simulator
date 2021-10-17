import * as THREE from "three";
import TerrainChunkManager from "../terrain_chunk/TerrainChunkManager";
import {PerspectiveCamera, Scene} from "three";



export interface Renderable{
    updateRender() : void;
}

export class RendererSettings {

    private _terrainChunkManager: TerrainChunkManager;
    private _camera;
    private renderer;
    private _scene ;

    private rendarables : Renderable[]  = [];

    constructor(camera: PerspectiveCamera, canvas: HTMLCanvasElement,scene:Scene) {
        this._camera = camera;
        this._scene = scene;
        this._terrainChunkManager = new TerrainChunkManager(this._scene, this._camera);
        this.renderer = new THREE.WebGLRenderer({canvas});
        this.rendarables.push(this._terrainChunkManager);

    }


    private updateRenderables(){
        this.rendarables.forEach(renderable => renderable.updateRender())
    }



    public getRenderer(){
        return this.renderer;
    }

    public addRenderable(renderable: Renderable){
        this.rendarables.push(renderable);
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
       this.updateRenderables();
        if (this.resizeRendererToDisplaySize(this.renderer)) {
            this.resizeView();
        }

        this.renderer.render(this._scene, this._camera);
        requestAnimationFrame(this.newRender);
    }

    private resizeView() {
        const canvas = this.renderer.domElement;
        this._camera.aspect = canvas.clientWidth / canvas.clientHeight;
        this._camera.updateProjectionMatrix();
    }

    public render() {
        this.newRender();
    }
}
