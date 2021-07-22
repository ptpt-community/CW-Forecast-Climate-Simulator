import * as THREE from "three";
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export function movementControlling(camera: THREE.Camera, domElement: HTMLElement) {
    const controls = new PointerLockControls(camera, domElement);
    new OrbitControls(camera, domElement);



    const onKeyDown = function (event: KeyboardEvent) {
        console.log(event.code);
        switch (event.code) {

            case 'KeyW':
                controls.moveForward(.1)
                break
            case 'KeyA':
                controls.moveRight(-.1)
                break
            case 'KeyS':
                controls.moveForward(-.1)
                break
            case 'KeyD':
                controls.moveRight(.1)
                break
            case 'Space':
                camera.position.y +=.01;
                break
            case 'ShiftLeft':
                camera.position.y -=.01;
                break
        }
    }


    const onMouseSigmal = ()=>{
        (controls.isLocked)? controls.unlock() : controls.lock();
    }

    document.addEventListener("keydown", onKeyDown,false);
    document.addEventListener("dblclick", onMouseSigmal,false);
    return onKeyDown;
}