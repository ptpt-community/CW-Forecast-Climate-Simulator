import {getInterpolatedNoise} from "../../Math/GradientNoise";

export class BiomeManager {
    _mountain_biome = new MountainBiome();
    _super_flat_biome = new SuperFlatBiome();

     _amplitude = 300;

     calculateBiome = (x: number, z: number) :Biome => {
         const subscale =10;
        const biomeNumber  = this.getBiomeFactor(x/subscale,z/subscale);
        return this._getBiome(biomeNumber);
    }

     getBiomeFactor(x:number, y:number) {
         return getInterpolatedNoise(x / 128, y / 128) * this._amplitude+this._amplitude/2;
    }


    private _getBiome(biomeNumber: number) :Biome{
         if(biomeNumber>200 && biomeNumber<300){
             return this._mountain_biome;
         }
         else return this._super_flat_biome;
    }

}


export interface Biome{
    getHeight(x:number, z:number): number;
}


class MountainBiome implements Biome{
    private amplitude = 300;
   public getHeight(x: number, z: number): number {
        return this._getMountainHeight(x,z);
    }

    private  _getMountainHeight(x:number, z:number) {
        let total = 0;
        total += getInterpolatedNoise(x/64, z/64)*this.amplitude;
        total += getInterpolatedNoise(x/16, z/16)*this.amplitude/3;
        total += getInterpolatedNoise(x/8, z/8)*this.amplitude/9;
        total += getInterpolatedNoise(x/4, z/4)*this.amplitude/27;
        return 20+total;
    }


}


class SuperFlatBiome implements Biome{

    public getHeight(x: number, z: number): number {
        return -30;
    }
}