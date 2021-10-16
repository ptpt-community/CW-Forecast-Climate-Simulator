import {Camera, PerspectiveCamera} from "three";

export class CameraSettings{
    constructor(){

    }


    public getCamera():PerspectiveCamera{
        const camera =new PerspectiveCamera( 40, 16/9, 1, 4000);
        camera.position.set(22.4,8,-45);
        return camera;
    }

}