import seedrandom from "seedrandom"


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

    private constructor() {
      //  this._loadSave();
        //setInterval(this._save,10000);
    }




    private _dp: any = {};
    private _is_changed = false;

    // private _loadSave(){
    //     fs.readFile("/generated_randoms.json",((err, data) => {
    //         this._dp =JSON.stringify(data);
    //     }))
    // }
    //
    // private _save(){
    //     if(!this._is_changed) return;
    //     fs.writeFile ("/generated_randoms.json", JSON.stringify(this._dp), function(err) {
    //             if (err) throw err;
    //         }
    //     );
    //     this._is_changed = false;
    //
    // }






    getNoise(x: number, y: number) {


        const input_seed = this._seed + x * 30000 + y * 90000;
        if (this._dp[input_seed] !== undefined) return this._dp[input_seed];

        this._is_changed = true;

        const seeder = this._getRandom(input_seed);

        const randomNumber = (seeder() - .5) * 2;

        this._dp[input_seed] = randomNumber;

        return randomNumber;
    }


    private _getRandom(seed: string) {
        return seedrandom.xor128(seed);
    }
}