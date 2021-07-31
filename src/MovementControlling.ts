import * as THREE from "three";
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GUI} from "dat.gui";

export function movementControlling(camera: THREE.Camera, domElement: HTMLElement,speed: number,gui:GUI) {
    const controls = new PointerLockControls(camera, domElement);
    new OrbitControls(camera, domElement);

    let controllableParams = {
        speed: speed
    };

    const onKeyDown = function (event: KeyboardEvent) {
        console.log(camera.position);
        switch (event.code) {

            case 'KeyW':
                controls.moveForward(controllableParams.speed)
                break
            case 'KeyA':
                controls.moveRight(-controllableParams.speed)
                break
            case 'KeyS':
                controls.moveForward(-controllableParams.speed)
                break
            case 'KeyD':
                controls.moveRight(controllableParams.speed)
                break
            case 'Space':
                camera.position.y += .1*controllableParams.speed;
                break
            case 'ShiftLeft':
                camera.position.y -=.1*controllableParams.speed;
                break
        }
    }

    gui.add(controllableParams,"speed").min(0.01).max(10).step(.001);


    const onMouseSigmal = ()=>{
        (controls.isLocked)? controls.unlock() : controls.lock();
    }

    document.addEventListener("keydown", onKeyDown,false);
    document.addEventListener("dblclick", onMouseSigmal,false);
    return onKeyDown;
}