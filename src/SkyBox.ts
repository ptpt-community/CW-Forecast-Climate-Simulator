import {BackSide, BoxGeometry, CubeTextureLoader, Mesh, MeshBasicMaterial, Scene, TextureLoader} from "three";

export default class SkyBox{
    private _scene: Scene;
    _size = 1000;

    constructor(scene : Scene) {
        this._scene = scene;
        this._init();
    }



    private _init() {

       // this._scene.add(skyBoxMesh);
        let daySky = [
            'https://media.discordapp.net/attachments/871240169100038181/871240264801452092/Daylight_Box_Back.png',
            'https://media.discordapp.net/attachments/871240169100038181/871240271042600980/Daylight_Box_Front.png',
            'https://media.discordapp.net/attachments/871240169100038181/871334401051598878/Daylight_Box_Top_180y.png',
            'https://media.discordapp.net/attachments/871240169100038181/871240267733299261/Daylight_Box_Bottom.png',
            'https://media.discordapp.net/attachments/871240169100038181/871240275849277521/Daylight_Box_Right.png',
            'https://media.discordapp.net/attachments/871240169100038181/871240274905542677/Daylight_Box_Left.png',

        ];
        this._scene.background = new CubeTextureLoader().load(daySky);



    }







}