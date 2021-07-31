import {AxesHelper, CurveUtils, Mesh, Object3D, Vector3} from "three";
import seedrandom from "seedrandom";
import FastRandom from "../Random/FastRandom";
import {BiomeManager} from "../terrain_chunk/Biome/BiomeManager";
import {getInterpolatedNoise} from "../Math/GradientNoise";



export class NoiseManager {


    private static amplitude = 400;
    private _biomeManager;
    constructor(biomeManager: BiomeManager) {
        this._biomeManager = biomeManager;
    }

    applyHeight(plane: Mesh , offset:{x: number, z: number}) {

        function getOffsetX(x:number){
            console.log(offset.x+x);
            return offset.x + x;
        }

        function getOffsetZ(y:number){
            console.log(offset.z+y);
            return offset.z - y;
        }
        const axesHelper = new AxesHelper(3);
        plane.add(axesHelper);
        const vertex = new Vector3();

        const position = plane.geometry.attributes.position;

        for (let i = 0; i< position.count; i++){

            const biome = this._biomeManager.calculateBiome(offset.x+position.getX(i),offset.z - position.getY(i));
            position.setZ (i, biome.getHeight( getOffsetX(position.getX(i)), getOffsetZ(position.getY(i))) );


         }



        position.needsUpdate = true



    }
}