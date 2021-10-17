import {Camera, PerspectiveCamera} from "three";

export class CameraSettings{
    constructor(){

    }


    public getCamera():PerspectiveCamera{
        const camera =new PerspectiveCamera( 40, 16/9, 1, 2000);
        camera.position.set(-14,3,-450);
        camera.lookAt(200,0,20)
        return camera;
    }

}