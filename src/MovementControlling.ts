import * as THREE from "three";
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export function movementControlling(camera: THREE.Camera, domElement: HTMLElement,speed: number) {
    const controls = new PointerLockControls(camera, domElement);
    new OrbitControls(camera, domElement);



    const onKeyDown = function (event: KeyboardEvent) {
        switch (event.code) {

            case 'KeyW':
                controls.moveForward(speed)
                break
            case 'KeyA':
                controls.moveRight(-speed)
                break
            case 'KeyS':
                controls.moveForward(-speed)
                break
            case 'KeyD':
                controls.moveRight(speed)
                break
            case 'Space':
                camera.position.y += .1*speed;
                break
            case 'ShiftLeft':
                camera.position.y -=.1*speed;
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