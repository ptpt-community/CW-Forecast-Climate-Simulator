import {
    Mesh,
    MeshBasicMaterial,
    MeshPhongMaterial,
    PlaneGeometry,
    RepeatWrapping,
    Scene,
    Texture,
    TextureLoader
} from "three";
import {TerrainFeatureNoiseManager} from "../Noise/TerrainFeatureNoiseManager";
import {PlaneCreator} from "./PlaneCreator";
import {BiomeManager} from "./Biome/BiomeManager";

export class TerrainChunk {

    _loader: TextureLoader;
    _scene: Scene;
    _size: number;
    _texture: Texture;
    private _planeMaterial: MeshBasicMaterial;
    private _planeGeometry: PlaneGeometry;
    _noisifier: TerrainFeatureNoiseManager;
    _segment ;

    constructor(scene: Scene, loader: TextureLoader, size: number) {
        this._loader = loader;
        this._scene = scene;
        this._size = size;
         this._segment = 128;

        const texture = loader.load("https://www.the3rdsequence.com/texturedb/download/26/texture/png/256/cracked+rock-256x256.png", () => {
            texture.repeat.set(size*4, size*4);
            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
            texture.needsUpdate = true;
        });
        this._texture = texture;

        this._planeMaterial = new MeshPhongMaterial({

            wireframe: false,
            map: texture,
            shininess:3,

        })
        this._planeGeometry = new PlaneGeometry(size, size, 128, 128);

        this._noisifier = new TerrainFeatureNoiseManager(new BiomeManager());

    }


    private applyNoise = (plane: Mesh, offset:{x: number, z: number}) => {
        this._noisifier.applyHeight(plane, offset);
    }

    generateTerrain(position: { x_position: number, z_position: number }) {
        const plane = new PlaneCreator(
            this._size,
            position.x_position * this._size,
            position.z_position * this._size,
            new PlaneGeometry(this._size, this._size, this._segment, this._segment),
            this._planeMaterial).plane;

        this.applyNoise(plane,{x:position.x_position * this._size, z:position.z_position * this._size})
        plane.castShadow = true;
        plane.receiveShadow = true;

        this._scene.add(plane);
    }
}