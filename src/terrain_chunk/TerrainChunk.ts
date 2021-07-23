import {Mesh, MeshBasicMaterial, PlaneGeometry, RepeatWrapping, Scene, Texture, TextureLoader} from "three";
import {HeightGenerator} from "../Noise/HeightGenerator";
import {PlaneCreator} from "./PlaneCreator";

export class TerrainChunk {

    _loader: TextureLoader;
    _scene: Scene;
    _size: number;
    _texture: Texture;
    private _planeMaterial: MeshBasicMaterial;
    private _planeGeometry: PlaneGeometry;
    _noisifier: HeightGenerator;

    constructor(scene: Scene, loader: TextureLoader, size: number) {
        this._loader = loader;
        this._scene = scene;
        this._size = size;

        const texture = loader.load("https://www.the3rdsequence.com/texturedb/download/26/texture/png/256/cracked+rock-256x256.png", () => {
            texture.repeat.set(size, size);
            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
            texture.needsUpdate = true;
        });
        this._texture = texture;

        this._planeMaterial = new MeshBasicMaterial({

            wireframe: false,
            map: texture
        })
        this._planeGeometry = new PlaneGeometry(size, size, 128, 128);

        this._noisifier = new HeightGenerator();


    }


    private applyNoise = (plane: Mesh, offset:{x: number, z: number}) => {
        this._noisifier.applyHeight(plane, offset)
    }

    generateTerrain(position: { x_position: number, z_position: number }) {
        const plane = new PlaneCreator(
            this._size,
            position.x_position * this._size,
            position.z_position * this._size,
            new PlaneGeometry(this._size, this._size, 128, 128),
            this._planeMaterial).plane;

        this.applyNoise(plane,{x:position.x_position * this._size, z:position.z_position * this._size})

        this._scene.add(plane);
    }
}