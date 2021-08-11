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
import {ChunkRecord} from "./TerrainChunkManager";

//@ts-ignore
import groundVertexShader from "../shaders/ground/vertex.glsl"
//@ts-ignore
import groundFragmentShader from "../shaders/ground/fragment.glsl"

export class TerrainChunk {


    private _group: Group;
    private _planeMaterial: Material;
    private _noisifier: TerrainFeatureNoiseManager;
    private _segment = 128 ;
    private _plane: Mesh;
    private _noiseGenerator: Generator

    constructor(group: Group, position:ChunkRecord, noisifier: TerrainFeatureNoiseManager ) {
        this._group = group;
        this._planeMaterial = new ShaderMaterial({
            wireframe: true,
            vertexShader: groundVertexShader,
            fragmentShader: groundFragmentShader
        })
        this._noisifier = noisifier;
        const a =   this._generateTerrain(position);
        this._noiseGenerator = a.generator;
        this._plane = a.plane;
    }


    private applyNoise = (plane: Mesh, offset:{x: number, z: number}) => {
       return  this._noisifier.applyFeatures(plane, offset);
    }

    private _generateTerrain(position:ChunkRecord)  {
        const plane = new PlaneCreator(
            position.dimension,
            position.x,
            position.y,
            new PlaneGeometry(position.dimension, position.dimension, this._segment,this._segment),
            this._planeMaterial).plane;

            const generator =this.applyNoise(plane,{x:position.x,z:position.y})
            plane.receiveShadow = true;
            this._group.add(plane);
            return {plane,generator};
    }


    destroy(){
        this._plane.geometry.dispose();
        this._group.remove(this._plane);
    }

    get noiseGenerator(): Generator{
        return this._noiseGenerator;
    }



}