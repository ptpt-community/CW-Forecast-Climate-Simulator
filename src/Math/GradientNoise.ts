import {GetNoise} from "../Noise/GetNoise";

/**
 * TODO:
 * A Singleton GetGradientNoise class
 * To apply memoization we need to make a "Singleton" From it
 * The getInterpolatedNoise is to be the public method
 * */


export function getInterpolatedNoise(x:number, z:number){
    const integerX = Math.floor(x);
    const integerZ = Math.floor(z);
    const fractX = x - integerX;
    const fractZ = z - integerZ;

    const v1 = getSmoothNoise(integerX,integerZ);
    const v2 = getSmoothNoise(integerX+1,integerZ);
    const v3 = getSmoothNoise(integerX,integerZ+1);
    const v4 = getSmoothNoise(integerX+1,integerZ+1);

    const i1 = interpolate(v1,v2,fractX);
    const i2 = interpolate(v3,v4,fractX);

    return interpolate(i1,i2,fractZ);

}




function interpolate(a:number,b:number, blend: number){
    const theta = blend*Math.PI;
    const f = (1-Math.cos(theta))*.5;
    return a*(1-f) +b*f;
}

function getSmoothNoise(x:number, y:number){
    const corners = (getNoise(x-1,y-1)+getNoise(x+1,y-1)+getNoise(x-1,y+1)+getNoise(x+1,y+1))/16;
    const edges = (getNoise(x-1,y)+getNoise(x,y-1)+getNoise(x+1,y)+getNoise(x,y+1))/8;
    const center = getNoise(x,y)/4;
    return corners +edges +center;
}


function getNoise(x:number,z:number){
    return GetNoise.getInstance().getNoise(x, z);
}




