import {
    Material,
    Mesh,
    MeshBasicMaterial,
    MeshPhongMaterial,
    PlaneGeometry,
    RepeatWrapping,
    Scene, ShaderMaterial,
    Texture,
    TextureLoader
} from "three";
import {PlaneCreator} from "./PlaneCreator";
import {BiomeManager} from "./Biome/BiomeManager";
import {TerrainFeatureNoiseManager} from "./TerrainFeatureNoiseManager";
import {ChunkPosition} from "./TerrainChunkManager";

//@ts-ignore
import groundVertexShader from "../shaders/ground/vertex.glsl"
//@ts-ignore
import groundFragmentShader from "../shaders/ground/fragment.glsl"

export class TerrainChunk {

    _loader: TextureLoader;
    _scene: Scene;
    _size: number;
    _texture: Texture;
    private _planeMaterial: Material;
    private _planeGeometry: PlaneGeometry;
    _noisifier: TerrainFeatureNoiseManager;
    _segment ;

    constructor(scene: Scene, loader: TextureLoader, size: number) {
        this._loader = loader;
        this._scene = scene;
        this._size = size;
         this._segment = 64;

        const texture = loader.load("https://www.the3rdsequence.com/texturedb/download/26/texture/png/256/cracked+rock-256x256.png", () => {
            texture.repeat.set(size*4, size*4);
            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
            texture.needsUpdate = true;
        });
        this._texture = texture;

        this._planeMaterial = new ShaderMaterial({

            wireframe: true,
            vertexShader: groundVertexShader,
            fragmentShader: groundFragmentShader
        //    map: texture,
          //  shininess:3,

        })
        this._planeGeometry = new PlaneGeometry(size, size, 128, 128);

        this._noisifier = new TerrainFeatureNoiseManager(new BiomeManager());

    }


    private applyNoise = (plane: Mesh, offset:{x: number, z: number}) => {
        this._noisifier.applyFeatures(plane, offset);
    }

    generateTerrain(position:ChunkPosition) : Mesh {
        const plane = new PlaneCreator(
            position.dimension,
            position.x,
            position.y,
            new PlaneGeometry(position.dimension, position.dimension, this._segment,this._segment),
            this._planeMaterial).plane;

        this.applyNoise(plane,{x:position.x,z:position.y})
        plane.castShadow = true;
        plane.receiveShadow = true;

        this._scene.add(plane);
        return plane;
    }
}