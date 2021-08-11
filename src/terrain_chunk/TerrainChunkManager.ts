import {Box2, Camera, Group, Mesh, Scene, TextureLoader, Vector2, Vector3} from "three";
import {TerrainChunk} from "./TerrainChunk";
import {ChunkDirector} from "./ChunkDirector";
import {TerrainFeatureNoiseManager} from "./TerrainFeatureNoiseManager";
import {BiomeManager} from "./Biome/BiomeManager";

export class ChunkPosition extends Vector2{

    private _dimension;

    constructor(box:Box2) {
        const x = Math.trunc((box.min.x+box.max.x)/2);
        const y = Math.trunc((box.min.y+box.max.y)/2);
        super(x,y);

        this._dimension = Math.abs(Math.trunc(box.max.x-box.min.x));

    }

    get dimension(){
        return this._dimension;
    }
}


class ChunkRecord{
    private readonly _position:ChunkPosition;
    private readonly _plane: TerrainChunk;

    constructor(position: ChunkPosition, terrainChunk: TerrainChunk) {
        this._position= position;
        this._plane = terrainChunk;
    }


    get plane(): TerrainChunk {
        return this._plane;
    }

    get position():ChunkPosition{
        return this._position;
    }


}

class ChunkRecordList{
    _chunkRecords_dp: any = {};

    add(chunkRecord : ChunkRecord){
        this._chunkRecords_dp[ChunkRecordList.positionToKey(chunkRecord.position)] = chunkRecord;
    }

    remove(chunkRecord:ChunkRecord){
        delete this._chunkRecords_dp[ChunkRecordList.positionToKey(chunkRecord.position)];
    }


    contains(position : ChunkPosition) :boolean{
        const cache = this._chunkRecords_dp[ChunkRecordList.positionToKey(position)];


       return cache  !== undefined;
    }



    private static positionToKey(position: ChunkPosition):string{
        return  ''+position.x+','+position.y+','+position.dimension;
    }



}







export default class TerrainChunkManager {
    _group: Group;

    _camera: Camera;


    private _loader: TextureLoader = new TextureLoader();

    private _chunk_record_list = new ChunkRecordList();

    private _noiseManager = new TerrainFeatureNoiseManager(new BiomeManager());




    constructor(scene: Scene, camera: Camera) {
        this._group = new Group();
        scene.add(this._group);
        this._camera = camera;
    }

    chunkDirector = new ChunkDirector(64);

    public checkCameraAndAddTerrain() {

        const camera = this._camera;
      // const cameraChunk = this._coordinateToChunkPosition(camera.position);
        const chunkBoxes = this.chunkDirector.getChunksFrom(camera.position);

        chunkBoxes.forEach(chunkBox=>{
            const chunkPosition = new ChunkPosition(chunkBox);
            if(!this._chunk_record_list.contains(chunkPosition))
            {
                this.createChunk(chunkPosition);

            }
        })



    }






    private createChunk(position: ChunkPosition) {
        console.log("Generate New Chunk");

        const terrainChunk = new TerrainChunk(this._group,position,this._noiseManager)
        this._chunk_record_list.add(new ChunkRecord(position,terrainChunk));
    }
}