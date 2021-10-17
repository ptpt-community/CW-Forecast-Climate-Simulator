import {Renderable} from "./RendererSettings";
import {Water} from "three/examples/jsm/objects/Water";
import {PlaneGeometry, RepeatWrapping, Scene, TextureLoader, Vector3} from "three";

export class WaterModel implements Renderable {

    private water: Water | undefined = undefined;
    private  sun;

    constructor(sun : Vector3) {
        this.sun = sun;
    }


    updateRender() {
        if (this.water === undefined) return;
        // @ts-ignore
        this.water.material.uniforms['time'].value += 1.0 / 60.0;
    }


    addToScene(scene: Scene) {
        const waterGeometry = new PlaneGeometry(1500, 1500);
        const water = new Water(
            waterGeometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new TextureLoader().load('https://threejs.org/examples/textures/waternormals.jpg', function (texture) {
                    texture.wrapS = texture.wrapT = RepeatWrapping;
                }),
                alpha: .5,
                sunDirection:this.sun,
                sunColor: 0xffffff,
                waterColor: 0x001e0f,
                distortionScale: 3.7,
                fog: scene.fog !== undefined
            }
        );
        water.rotation.x = -Math.PI / 2;
        scene.add(water);


        //@ts-ignore
        const waterUniforms = water.material.uniforms;
        console.log(waterUniforms)
       waterUniforms.size.value = 500;
        this.water = water;

        //@ts-ignore
        window.water = water;
    }


}
