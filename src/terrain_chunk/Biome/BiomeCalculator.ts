import {getInterpolatedNoise} from "../../Math/GradientNoise";

export class BiomeCalculator {
    get dp(): number[][] {
        return this._dp;
    }
     _amplitude = 150;
     private _dp : number [][] = [[]];

     calculateBiome = (x: number, z: number) => {
         const subscale =1;
        const factor  = this.getBiomeFactor(x/subscale,z/subscale);
       // console.log(factor);
         if(this._dp[x+256]=== undefined)
             this.dp[x+256] = [];
         this._dp[x+256][z+256] = factor;
        return(factor)
    }





     getBiomeFactor(x:number, y:number) {
         return getInterpolatedNoise(x / 128, y / 128) * this._amplitude+this._amplitude/2;
    }

}