import {Camera, PerspectiveCamera} from "three";

export class CameraSettings{
    constructor(){

    }


    public getCamera():PerspectiveCamera{
        const camera =new PerspectiveCamera( 40, 2, 0.1, 3000);
        camera.position.set(0,1000,0);
        camera.lookAt(1,1,1);
        return camera;
    }

}