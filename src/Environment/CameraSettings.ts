import {Camera, PerspectiveCamera} from "three";

export class CameraSettings{
    constructor(){

    }


    public getCamera():PerspectiveCamera{
        const camera =new PerspectiveCamera( 40, 16/9, .2, 4000);
        camera.position.set(0,10,0);
        camera.lookAt(1,1,1);
        return camera;
    }

}