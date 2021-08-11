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
/***
 *
onst persistance = .707;
 const lacuranity = 1.8;
 const exponentiation = 7;
 const height = 300;

 * */

    public getHeight(): number {
        const persistance = .707;
        const lacuranity = 1.8;
        const exponentiation = 7;
        const height = 100;

        const G= 2**(-persistance);

        let amplitude = 1.0;
        let frequency = 0.01;
        let normalization = 0;
        let total = 0;

        for(let o = 0; o<5; o++){
           let noise = getGradientNoise(this._x*frequency,this._z*frequency);
            noise = noise*.5+.5;
            total+=noise*amplitude;
            normalization+=amplitude;
            amplitude *= G;
            frequency *= lacuranity;
        }
        total /= normalization;

        total = Math.pow(
            total, exponentiation) * height;

        total += getGradientNoise(this._x/2000,this._z/2000)*10;
        return  total;


    }

    setForestFactor(forestFactor: number): void {
        this._forestFactor = forestFactor;
    }


}