import {getInterpolatedNoise} from "../../Math/GradientNoise";

export class BiomeManager {

     _amplitude = 300;

     calculateBiome = (x: number, z: number) :Biome => {
         const subscale =10;
        const biomeNumber  = this.getBiomeFactor(x/subscale,z/subscale);
        return this._getBiome(x,z,biomeNumber);
    }

     getBiomeFactor(x:number, y:number) {
         return getInterpolatedNoise(x / 128, y / 128) * this._amplitude+this._amplitude/2;
    }


    private _getBiome(x:number, z: number , biomeNumber: number) :Biome{
         if(biomeNumber>200 && biomeNumber<300){
             return new MountainBiome(x,z,biomeNumber);
         }
         if(biomeNumber>100 && biomeNumber <200){
             return new PlaneBiome(x,z,biomeNumber);
         }
         else return new SuperFlatBiome(x,z,biomeNumber);
    }

}


export interface Biome{
    getHeight(): number;
}


class MountainBiome implements Biome{

    _biomeNumber;
    _x;
    _z;

    constructor(x : number, z: number, biomeNumber :number) {
        this._biomeNumber = biomeNumber;
        this._x = x;
        this._z = z;
    }

    private _amplitude = 300;

   public getHeight(): number {
        return this._getMountainHeight();
    }

    private  _getMountainHeight() {
        let total = 0;
        total += getInterpolatedNoise(this._x/64, this._z/64)*this._amplitude;
        total += getInterpolatedNoise(this._x/32, this._z/32)*this._amplitude/3;
        return this._amplitude/3+total;
    }


}


class SuperFlatBiome implements Biome{

    _biomeNumber;
    _x;
    _z;

    constructor(x : number, z: number, biomeNumber :number) {
        this._biomeNumber = biomeNumber;
        this._x = x;
        this._z = z;
    }



    public getHeight(): number {
        return -30;
    }
}

class PlaneBiome implements Biome{
    _amplitude = 40;

    _biomeNumber;
    _x;
    _z;

    constructor(x : number, z: number, biomeNumber :number) {
        this._biomeNumber = biomeNumber;
        this._x = x;
        this._z = z;
    }


    public getHeight(): number {
        let total = 0;
        total+= getInterpolatedNoise(this._x/64,this._z/64)*this._amplitude;
        total+= getInterpolatedNoise(this._x/128,this._z/128)*this._amplitude;

        return total;
    }

}