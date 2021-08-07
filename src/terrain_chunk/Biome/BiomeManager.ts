import {getInterpolatedNoise} from "../../Math/GradientNoise";

export class BiomeManager {

     _amplitude = 300;

     calculateBiome = (x: number, z: number) :Biome => {
         const subscale =10;
        const biomeNumber  = this.getBiomeFactor(x/subscale,z/subscale);
        const biome =  this._getBiome(x,z,biomeNumber);

        biome.setForestFactor(this.getForestFactor(x,z));

        return biome;
     }

     getBiomeFactor(x:number, z:number) {
         return getInterpolatedNoise(x / 128, z / 128) * this._amplitude+this._amplitude/2;
     }


     getForestFactor(x: number, z: number){
         return getInterpolatedNoise((x+2000)/64,(z-1212)/64)%1;
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
    hasPlant():boolean
    setForestFactor(forestFactor: number): void;
}


class MountainBiome implements Biome{

    _biomeNumber;
    _x;
    _z;
    _forestFactor = 0;

    constructor(x : number, z: number, biomeNumber :number) {
        this._biomeNumber = biomeNumber;
        this._x = x;
        this._z = z;
    }

    hasPlant(): boolean {

        return false;
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

    setForestFactor(forestFactor: number): void {
       this._forestFactor = forestFactor;
    }




}


class SuperFlatBiome implements Biome{

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
        return -30;
    }

    hasPlant(): boolean {

        return false;
    }

    setForestFactor(forestFactor: number): void {
        this._forestFactor = forestFactor+.3;
    }

}

class PlaneBiome implements Biome{
    _amplitude = 40;

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
        total+= getInterpolatedNoise(this._x/64,this._z/64)*this._amplitude;
        total+= getInterpolatedNoise(this._x/128,this._z/128)*this._amplitude;

        return total;
    }

    setForestFactor(forestFactor: number): void {
        this._forestFactor = forestFactor;
    }

    hasPlant(): boolean {
        return false;
    }


}

class tundraBiome implements Biome{
    _amplitude = 40;

    _biomeNumber;
    _x;
    _z;
    _forestFactor=0;
    constructor(x : number, z: number, biomeNumber :number) {
        this._biomeNumber = biomeNumber;
        this._x = x;
        this._z = z;
    }

    getHeight(): number {
        return 0;
    }

    hasPlant(): boolean {
        return false;
    }

    setForestFactor(forestFactor: number): void {
    }

}