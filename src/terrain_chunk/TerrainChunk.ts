import {
    Group,
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

    private _group: Group;
    private _planeMaterial: Material;
    private _noisifier: TerrainFeatureNoiseManager;
    private _segment = 64 ;
    private _plane: Mesh;

    constructor(group: Group,  position:ChunkPosition, noisifier: TerrainFeatureNoiseManager ) {
        this._group = group;
        this._planeMaterial = new ShaderMaterial({
            wireframe: true,
            vertexShader: groundVertexShader,
            fragmentShader: groundFragmentShader
        })

        this._noisifier = noisifier;
        this._plane =   this._generateTerrain(position);
    }


    private applyNoise = (plane: Mesh, offset:{x: number, z: number}) => {
        this._noisifier.applyFeatures(plane, offset);
    }

    private _generateTerrain(position:ChunkPosition) : Mesh {
        const plane = new PlaneCreator(
            position.dimension,
            position.x,
            position.y,
            new PlaneGeometry(position.dimension, position.dimension, this._segment,this._segment),
            this._planeMaterial).plane;

            this.applyNoise(plane,{x:position.x,z:position.y})
            plane.receiveShadow = true;
            this._group.add(plane);
            return  plane;
    }



}