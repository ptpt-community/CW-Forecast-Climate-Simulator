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

    function getSpeedBasedOnHeight(){
        return (0.0909090909090909*camera.position.y) + 0.18181818181818182;
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
                if(camera.position.y>20) break;
                camera.position.y += controllableParams.speed;
               // controllableParams.speed = getSpeedBasedOnHeight()
                break
            case 'ShiftLeft':
                if(camera.position.y<3.0) break;
                camera.position.y -= controllableParams.speed;
                //controllableParams.speed = getSpeedBasedOnHeight()
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