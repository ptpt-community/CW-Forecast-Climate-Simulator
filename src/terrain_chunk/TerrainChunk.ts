import {
    Material,
    Mesh,
    PlaneGeometry,
    Scene,
 Vector2
} from "three";
import {BiomeManager} from "./Biome/BiomeManager";
import {TerrainFeatureNoiseManager} from "./TerrainFeatureNoiseManager";


//@ts-ignore
import groundVertexShader from "../shaders/ground/vertex.glsl"
//@ts-ignore
import groundFragmentShader from "../shaders/ground/fragment.glsl"

export class TerrainChunk {


    private _scene: Scene;
    private _size: number;
    private readonly _noisifier: TerrainFeatureNoiseManager;
    _MIN_RESOLUTION = 64 ;
    private readonly _offset: Vector2;
    private  _plane:Mesh|undefined;


    constructor(scene: Scene, size: number, offset:Vector2, planeMaterial: Material) {
        this._scene = scene;
        this._size = size;
         this._offset = offset;

        const planeGeometry = new PlaneGeometry(size, size, this._MIN_RESOLUTION, this._MIN_RESOLUTION);
        this._noisifier = new TerrainFeatureNoiseManager(new BiomeManager());
        this._generateTerrain(planeGeometry,planeMaterial);

    }


    private applyNoise = (plane: Mesh, offset:Vector2) => {
        this._noisifier.applyFeatures(plane, {x:offset.x,z:offset.y});
    }

    private _generateTerrain(planeGeometry:PlaneGeometry,planeMaterial:Material)  {
        console.log("Generating");
        const plane = new Mesh(planeGeometry, planeMaterial);
        plane.position.set(this._offset.x,0,this._offset.y);
        this.applyNoise(plane,this._offset)
        plane.castShadow = true;
        console.log(plane.position);

        this._scene.add(plane);

        plane.rotation.x = Math.PI * (-.5);
        this._plane = plane;
    }

}