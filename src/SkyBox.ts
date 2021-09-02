import {BackSide, BoxGeometry, CubeTextureLoader,  Scene} from "three";

export default class SkyBox{
    private _scene: Scene;
    _size = 1000;

    constructor(scene : Scene) {
        this._scene = scene;
        this._init();
    }



    private _init() {


        let daySky = [
            'https://media.discordapp.net/attachments/871240169100038181/871240264801452092/Daylight_Box_Back.png',
            'https://media.discordapp.net/attachments/871240169100038181/871240271042600980/Daylight_Box_Front.png',
            'https://media.discordapp.net/attachments/871240169100038181/871334401051598878/Daylight_Box_Top_180y.png',
            'https://media.discordapp.net/attachments/871240169100038181/871240267733299261/Daylight_Box_Bottom.png',
            'https://media.discordapp.net/attachments/871240169100038181/871240275849277521/Daylight_Box_Right.png',
            'https://media.discordapp.net/attachments/871240169100038181/871240274905542677/Daylight_Box_Left.png',

        ];

        const nightSky = [
            'https://media.discordapp.net/attachments/838858730342580314/867682751997935626/corona_ft.png',
            'https://media.discordapp.net/attachments/838858730342580314/867682307149266984/corona_bk.png',
            'https://media.discordapp.net/attachments/838858730342580314/867683079619215380/corona_up.png',
            'https://media.discordapp.net/attachments/838858730342580314/867682673391829022/corona_dn.png',
            'https://media.discordapp.net/attachments/838858730342580314/867682971435663380/corona_rt.png',
            'https://media.discordapp.net/attachments/838858730342580314/867682847119900672/corona_lf.png'

        ];

        this._scene.background = new CubeTextureLoader().load(daySky);



    }







}