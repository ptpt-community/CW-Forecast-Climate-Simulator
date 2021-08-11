import {getGradientNoise} from "../../Math/GradientNoise";

export class BiomeManager {

     _amplitude = 300;

     calculateBiome = (x: number, z: number) :Biome => {
         const subscale =10;
        const biomeNumber  = this.getBiomeFactor(x/subscale,z/subscale);
        const biome =  BiomeManager._getBiome(x,z,biomeNumber);

        biome.setForestFactor(this.getForestFactor(x,z));

        return biome;
     }

     getBiomeFactor(x:number, z:number) {
         return getGradientNoise(x / 128, z / 128) * this._amplitude+this._amplitude/2;
     }


     getForestFactor(x: number, z: number){
         return getGradientNoise((x+2000)/64,(z-1212)/64)%1;
     }





    private static _getBiome(x:number, z: number , biomeNumber: number) :Biome {
        return new TestBiome(x, z, biomeNumber);
    }

}


export interface Biome{
    getHeight(): number;

    setForestFactor(forestFactor: number): void;
}





class TestBiome implements Biome{
    _amplitude = 10;

    _biomeNumber;
    _x;
    _z;
    _forestFactor=0;

    constructor(x : number, z: number, biomeNumber :number) {
        this._biomeNumber = biomeNumber;
        this._x = x;
        this._z = z;
    }


    public getHeight(): number {
        let total = 0;
        const multiplier = 1;
        const period = 16*100*multiplier;
        // total+= getInterpolatedNoise(this._x/period,this._z/period)*this._amplitude;
        total+= getGradientNoise(this._x/period,this._z/period)*this._amplitude*multiplier;

        return total;
    }

    setForestFactor(forestFactor: number): void {
        this._forestFactor = forestFactor;
    }


}