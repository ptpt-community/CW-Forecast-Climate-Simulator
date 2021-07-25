import {getInterpolatedNoise} from "../../Math/GradientNoise";

export class BiomeCalculator {

     _amplitude = 150;

     calculateBiome = (x: number, z: number) => {
         const subscale =5;
        const factor  = this.getBiomeFactor(x/subscale,z/subscale);
        return(factor)
    }





     getBiomeFactor(x:number, y:number) {
         return getInterpolatedNoise(x / 128, y / 128) * this._amplitude+this._amplitude/2;
    }

}