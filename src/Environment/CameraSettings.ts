import {Camera, PerspectiveCamera} from "three";

export class CameraSettings{
    constructor(){

    }


    public getCamera():PerspectiveCamera{
        const camera =new PerspectiveCamera( 60, 2, 0.1, 200);
        camera.position.set(0,10,0);
        camera.lookAt(1,1,1);
        return camera;
    }

}