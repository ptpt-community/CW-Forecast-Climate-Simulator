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
        this._scene.background = new CubeTextureLoader().load([
            'https://media.discordapp.net/attachments/838858730342580314/867682751997935626/corona_ft.png',
            'https://media.discordapp.net/attachments/838858730342580314/867682307149266984/corona_bk.png',
            'https://media.discordapp.net/attachments/838858730342580314/867683079619215380/corona_up.png',
            'https://media.discordapp.net/attachments/838858730342580314/867682673391829022/corona_dn.png',
            'https://media.discordapp.net/attachments/838858730342580314/867682971435663380/corona_rt.png',
            'https://media.discordapp.net/attachments/838858730342580314/867682847119900672/corona_lf.png'

        ]);

    }







}