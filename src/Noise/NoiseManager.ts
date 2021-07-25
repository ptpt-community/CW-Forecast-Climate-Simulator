import {AxesHelper, CurveUtils, Mesh, Object3D, Vector3} from "three";
import seedrandom from "seedrandom";
import FastRandom from "../Random/FastRandom";
import {BiomeCalculator} from "../terrain_chunk/Biome/BiomeCalculator";
import {getInterpolatedNoise} from "../Math/GradientNoise";



export class NoiseManager {


    private static amplitude = 150;
    private _biomeManager;
    constructor(biomeManager: BiomeCalculator) {
        this._biomeManager = biomeManager;
    }

    applyHeight(plane: Mesh , offset:{x: number, z: number}) {
        const axesHelper = new AxesHelper(3);
        plane.add(axesHelper);
        const vertex = new Vector3();

        const position = plane.geometry.attributes.position;

        for (let i = 0; i< position.count; i++){
            position.setZ (i, NoiseManager.getHeight( offset.x+position.getX(i), offset.z - position.getY(i)) );
            this._biomeManager.calculateBiome(offset.x+position.getX(i),offset.z - position.getY(i));
         }


        position.needsUpdate = true
    }


    private static getHeight(x:number, y:number) {
        let total = getInterpolatedNoise(x/128, y/128)*this.amplitude;
      //  total += this.getInterpolatedNoise(x/32, y/32)*this.amplitude/3;
      //  total += this.getInterpolatedNoise(x/16, y/16)*this.amplitude/3;
         // total += this.getInterpolatedNoise(x/8, y/8)*this.amplitude/9;
         // total += this.getInterpolatedNoise(x/4, y/4)*this.amplitude/27;

        return total;
    }



}