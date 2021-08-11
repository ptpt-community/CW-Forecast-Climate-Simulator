import {GetNoise} from "../Noise/GetNoise";
// @ts-ignore
import SimplexNoise from  "simplex-noise"


/**
 * TODO:
 * A Singleton GetGradientNoise class
 * To apply memoization we need to make a "Singleton" From it
 * The getInterpolatedNoise is to be the public method
 * */


export function getInterpolatedNoise(x:number, z:number){
    return getNoise(x,z);
}





function getNoise(x:number,z:number){
    return GetNoise.getInstance().getNoise(x, z);
}




