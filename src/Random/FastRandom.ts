import randomNonsense from "./randomNonsense";
export default  class FastRandom{

    private _seed: number;
    private _pointer = 0;


    constructor(seed:number) {
        this._seed =  seed;

    }



    getRandom(){
        const randomNumber = this._seed + this._table[this._pointer];
        this._pointer++;
        if(this._pointer>this._table.length) this._pointer = 0;


    }


    private _table = randomNonsense;







    






}