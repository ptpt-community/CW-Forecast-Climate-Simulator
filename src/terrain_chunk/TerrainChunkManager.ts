import {Box2, Camera, Group, Scene, TextureLoader, Vector2} from "three";
import {TerrainChunk} from "./TerrainChunk";
import {ChunkDirector} from "./ChunkDirector";
import {TerrainFeatureNoiseManager} from "./TerrainFeatureNoiseManager";
import {BiomeManager} from "./Biome/BiomeManager";

export class ChunkPosition extends Vector2{

    private _dimension;
    private _terrainChunk:undefined|TerrainChunk

    constructor(box:Box2) {
        const x = Math.trunc((box.min.x+box.max.x)/2);
        const y = Math.trunc((box.min.y+box.max.y)/2);
        super(x,y);

        this._dimension = Math.abs(Math.trunc(box.max.x-box.min.x));
    }

    get dimension(){
        return this._dimension;
    }

    get terrainChunk(): TerrainChunk | undefined {
        return this._terrainChunk;
    }

    set terrainChunk(value: TerrainChunk | undefined) {
        this._terrainChunk = value;
    }
}



export default class TerrainChunkManager {
    private readonly _group: Group;
    private readonly _camera: Camera;
    private _chunkPositions_DP : any = []
    private _noiseManager = new TerrainFeatureNoiseManager(new BiomeManager());


    private _chunkDirector = new ChunkDirector(64);




    constructor(scene: Scene, camera: Camera) {
        this._group = new Group();
        scene.add(this._group);
        this._camera = camera;
    }


    public checkCameraAndAddTerrain() {

        const camera = this._camera;

        const chunkPositions = this._chunkDirector.getChunksFrom(camera.position);



        chunkPositions.forEach(chunkPosition=>{
            if(!(TerrainChunkManager.positionToKey(chunkPosition) in this._chunkPositions_DP))
            {
                this.createChunk(chunkPosition);
            }
        })


    }


    private static positionToKey(position: ChunkPosition):string{
        return  ''+position.x+','+position.y+','+position.dimension;
    }


    private static _subtractSet<T>(setA:T[], setB:T[]) {
        const subtracted = {...setA};
        for (let k in setB) {
            delete subtracted[k];
        }
        return subtracted;
    }






    private createChunk(position: ChunkPosition) {
        console.log("Generate New Chunk");
        position.terrainChunk = new TerrainChunk(this._group, position, this._noiseManager);
        this._chunkPositions_DP[TerrainChunkManager.positionToKey(position)] = position;

        // this._currentChunkList.add(new ChunkRecord(position,terrainChunk));
    }
}