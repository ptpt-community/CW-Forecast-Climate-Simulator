import seedrandom from "seedrandom"
//@ts-ignore
import SimplexNoise from "simplex-noise"




export class GetNoise {


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


        const simplexNoise = this._simplex.noise2D(x,y);

        return simplexNoise;
    }

    private static _key(x:number,y:number):string{
        return ''+x+','+y;
    }


}