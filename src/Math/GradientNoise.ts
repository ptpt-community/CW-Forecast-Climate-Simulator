import {GetNoise} from "../Noise/GetNoise";
// @ts-ignore
import SimplexNoise from  "simplex-noise"




export function getGradientNoise(x:number, z:number){
    return getNoise(x,z);
}





function getNoise(x:number,z:number){
    return GetNoise.getInstance().getNoise(x, z);
}




