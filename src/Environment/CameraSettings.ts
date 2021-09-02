import * as THREE from "three";
import {Camera, PerspectiveCamera} from "three";

export class CameraSettings{
    constructor(){

    }

    public getCamera():PerspectiveCamera{
        return new THREE.PerspectiveCamera( 40, 2, 0.1, 3000);

    }

}