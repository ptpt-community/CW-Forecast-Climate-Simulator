import * as THREE from "three";
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GUI} from "dat.gui";
import {FrontEndReceiver} from "./FrontEndUpdatable";

export function movementControlling(camera: THREE.Camera, domElement: HTMLElement,speed: number,gui:GUI) {
    const controls = new PointerLockControls(camera, domElement);
    new OrbitControls(camera, domElement);

    let controllableParams = {
        speed: speed
    };

    function getSpeedBasedOnHeight(){
        return (0.0909090909090909*camera.position.y) + 0.18181818181818182;
    };

    const nearPreset : number[] = [0.05,.2,1,20,100]

    const frontEndInteract = FrontEndReceiver.getInstance();


    function onHeightChange(){
        let set = 0;
        const height = camera.position.y;

        frontEndInteract.updateHeight(height)


        if(height>0 && height<=1.5) {
            set = 1;
        }

        else if(height >1.5 && height <20) {
            set = 2;
        }

        else if(height>20 && height <50 ) {
            set = 2;
        }

        else if(height>50 && height <80) {
            set = 2;
        }
        else if(height>200){
            set = 2;
        }


        //@ts-ignore
        if(window.camera.near !== nearPreset[set]){
            //@ts-ignore
            window.camera.near = nearPreset[set];
            console.log("Changing Near To :", nearPreset[set], "Crossed", camera.position.y  );
        }

    }

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
                //if(camera.position.y>40) break;
                onHeightChange();
                camera.position.y += controllableParams.speed;
              // controllableParams.speed = getSpeedBasedOnHeight()
                break
            case 'ShiftLeft':
                if(camera.position.y<1.2) break;
                onHeightChange();
                camera.position.y -= controllableParams.speed;
               // controllableParams.speed = getSpeedBasedOnHeight()
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