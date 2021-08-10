import {
    Material,
    Mesh,
    MeshBasicMaterial,
    MeshPhongMaterial,
    PlaneGeometry, PlaneHelper,
    RepeatWrapping,
    Scene, ShaderMaterial,
    Texture,
    TextureLoader, Vector2
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


    _scene: Scene;
    _size: number;
    private _planeMaterial: Material;
    private _planeGeometry: PlaneGeometry;
    _noisifier: TerrainFeatureNoiseManager;
    _MIN_RESOLUTION = 64 ;
    private readonly _offset: Vector2;
    private  _plane:Mesh|undefined;


    constructor(scene: Scene, size: number, offset:Vector2, planeMaterial: Material) {

        this._scene = scene;
        this._size = size;

         this._offset = offset;
         this._planeMaterial = planeMaterial;

        this._planeGeometry = new PlaneGeometry(size, size, this._MIN_RESOLUTION, this._MIN_RESOLUTION);
        this._noisifier = new TerrainFeatureNoiseManager(new BiomeManager());
        this._generateTerrain();

    }


    private applyNoise = (plane: Mesh, offset:Vector2) => {
        this._noisifier.applyFeatures(plane, {x:offset.x,z:offset.y});
    }

    private _generateTerrain()  {
        console.log("Generating");
        const plane = new Mesh(this._planeGeometry,this._planeMaterial);
        plane.position.set(this._offset.x,0,this._offset.y);
        this.applyNoise(plane,this._offset)
        plane.castShadow = true;
        console.log(plane.position);

        this._scene.add(plane);

        plane.rotation.x = Math.PI * (-.5);
        this._plane = plane;
    }


    get plane(){
        return this._plane as Mesh;
    }
}