import {Group, Material, Mesh, PlaneGeometry, ShaderMaterial} from "three";
import {PlaneCreator} from "./PlaneCreator";

import {TerrainFeatureNoiseManager} from "./TerrainFeatureNoiseManager";
import {ChunkRecord} from "./TerrainChunkManager";

//@ts-ignore
//@ts-ignore
import groundVertexShader from "../shaders/ground/vertex.glsl"
//@ts-ignore
import groundFragmentShader from "../shaders/ground/fragment.glsl"
import {inputs} from "../../inputs/input";
import {GuiSingleton} from "../GUI/GUI";

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
            wireframe: false,
            vertexShader: groundVertexShader,
            fragmentShader: groundFragmentShader,
            uniforms: {
                uTemperatureOffset: {value: inputs.temperatureOffset},
                uColorSelection : {value: inputs.selectedRenderColor}
            }
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
            plane.visible = false;
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


    show(){
        this._plane.visible = true;
    }

    hide(){
        this._plane.visible =false;
    }



}