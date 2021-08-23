import seedrandom from "seedrandom"
//@ts-ignore
import SimplexNoise from "simplex-noise"




export class GetNoise {

    /*TODO:
    In our backend we should add file module to store our this._dp
    Later we can use it to save new random numbers and load previous random numbers
    */

    _seed = '' + 100100;

    public static getInstance(): GetNoise {
        return this._instance;
    }

    private static _instance = new GetNoise();
    private _simplex;

    private constructor() {
      //  this._loadSave();
        //setInterval(this._save,10000);

        this._simplex = new SimplexNoise('SEED');
    }




    private _dp: any = {};
    private _is_changed = false;







    getNoise(x: number, y: number) {

        // const key = GetNoise._key(x,y);
        // if (this._dp[key] !== undefined) return this._dp[key];
        // this._is_changed = true;
        const simplexNoise = this._simplex.noise2D(x,y);
        // this._dp[key] = simplexNoise;

        return simplexNoise;
    }

    private static _key(x:number,y:number):string{
        return ''+x+','+y;
    }


}