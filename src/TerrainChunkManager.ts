import {AxesHelper, Scene, TextureLoader} from "three";
import {PlaneCreator} from "./PlaneCreator";

export default class TerrainChunkManager{
     _scene: Scene;

    constructor(scene :Scene) {
        this._scene = scene;

        this._init();

    }

     _init = ()=>{
        const loader = new TextureLoader();

         const plane = new PlaneCreator(loader,512,128,0,0).plane;
         const plane2 = new PlaneCreator(loader,512,128,512,0).plane;
         const plane3 = new PlaneCreator(loader,512,128,512,512).plane;

         const axesHelper : AxesHelper = new AxesHelper();
         axesHelper.add(plane,plane2,plane3);
         this._scene.add(plane,plane2,plane3,axesHelper);
    }


}