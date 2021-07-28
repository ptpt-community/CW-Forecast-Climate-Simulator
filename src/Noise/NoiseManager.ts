import {AxesHelper, CurveUtils, Mesh, Object3D, Vector3} from "three";
import seedrandom from "seedrandom";
import FastRandom from "../Random/FastRandom";
import {BiomeCalculator} from "../terrain_chunk/Biome/BiomeCalculator";
import {getInterpolatedNoise} from "../Math/GradientNoise";



export class NoiseManager {


    private static amplitude = 400;
    private _biomeManager;
    constructor(biomeManager: BiomeCalculator) {
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
            if(biome<50 && biome>30)
            position.setZ (i, NoiseManager.getHeight( getOffsetX(position.getX(i)), getOffsetZ(position.getY(i))) );
            else position.setZ(i,position.getZ(i)-20);

         }



        position.needsUpdate = true



    }



    private static getHeight(x:number, y:number) {
        let total = 0;
        total += getInterpolatedNoise(x/64, y/64)*this.amplitude;
        total += getInterpolatedNoise(x/16, y/16)*this.amplitude/3;
          total += getInterpolatedNoise(x/8, y/8)*this.amplitude/9;
          total += getInterpolatedNoise(x/4, y/4)*this.amplitude/27;

        return 20+total;
    }



}