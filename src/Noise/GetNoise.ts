import seedrandom from "seedrandom";

export class GetNoise {

    _seed = '' + 100100;

    public static getInstance(): GetNoise {
        return this._instance;
    }

    private static _instance = new GetNoise();

    private constructor() {

    }

    _dp: any = {};

    getNoise(x: number, y: number) {


        const input_seed = this._seed + x * 30000 + y * 90000;
        if (this._dp[input_seed] !== undefined) return this._dp[input_seed];

        const seeder = this._getRandom(input_seed);

        const randomNumber = (seeder() - .5) * 2;

        this._dp[input_seed] = randomNumber;

        return randomNumber;
    }


    private _getRandom(seed: string) {
        return seedrandom.xor128(seed);
    }
}