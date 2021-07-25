import randomNonsense from "./randomNonsense";
export default  class FastRandom{

    private _pointer = 0;






    getRandom(seed:number){
        const randomNumber = seed/100000+this._table[this._pointer];
        this._pointer++;
        if(this._pointer>this._table.length) this._pointer = 0;
        return randomNumber%1;
    }


    private _table = randomNonsense;














}