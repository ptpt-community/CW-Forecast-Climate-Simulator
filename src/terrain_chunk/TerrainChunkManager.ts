import {Box2, Camera, Group, Scene, TextureLoader, Vector2} from "three";
import {TerrainChunk} from "./TerrainChunk";
import {ChunkDirector} from "./ChunkDirector";
import {TerrainFeatureNoiseManager} from "./TerrainFeatureNoiseManager";
import {BiomeManager} from "./Biome/BiomeManager";

export class ChunkRecord extends Vector2{

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

    get terrainChunk(): TerrainChunk  {
        return this._terrainChunk as TerrainChunk;
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
    private _chunkBuilder = new ChunkBuilder();


    private _chunkDirector = new ChunkDirector(128);
    
    constructor(scene: Scene, camera: Camera) {
        this._group = new Group();
        scene.add(this._group);
        this._camera = camera;
    }


    public checkCameraAndAddTerrain() {

        const camera = this._camera;

        const suggestedPositions = this._chunkDirector.getChunksFrom(camera.position);
        const suggestedChunks_DP :any = [];
        suggestedPositions.forEach(chunkPosition=>{
            const key = TerrainChunkManager.positionToKey(chunkPosition);
            suggestedChunks_DP[key] =chunkPosition;
        })


        const deletableChunks =  TerrainChunkManager._subtractSet(this._chunkPositions_DP, suggestedChunks_DP);

        for(let key in suggestedChunks_DP){
            if(this._chunkPositions_DP[key]) continue;
            this.createChunk(suggestedChunks_DP[key]);
        }



        for(let key in deletableChunks){
            (this._chunkPositions_DP[key].terrainChunk==undefined)
            this._chunkPositions_DP[key].terrainChunk.destroy();
            delete  this._chunkPositions_DP[key];
        }

        this._chunkBuilder.build();


    }


    private static positionToKey(position: ChunkRecord):string{
        return  ''+position.x+','+position.y+','+position.dimension;
    }


    private static _subtractSet<T>(setA:T[], setB:T[]) {
        const subtracted = {...setA};
        for (let k in setB) {
            delete subtracted[k];
        }
        return subtracted;
    }






    private createChunk(position: ChunkRecord) {
        console.log("Generate New Chunk");
        position.terrainChunk = new TerrainChunk(this._group, position, this._noiseManager);
        this._chunkPositions_DP[TerrainChunkManager.positionToKey(position)] = position;
        this._chunkBuilder.push(position);

        // this._currentChunkList.add(new ChunkRecord(position,terrainChunk));
    }
}



class ChunkBuilder{
    private chunkRecords : ChunkRecord[] = [];
    private _currentGenerator : Generator | undefined
    private _currentChunk :ChunkRecord|undefined;


    push(chunk:ChunkRecord){
        chunk.terrainChunk.hide();
        this.chunkRecords.push(chunk);
    }


    build(){
        console.log("BUILDING! CALLED");
        if(this._currentGenerator === undefined) {
            console.log("BUILDING! UNDEFINED?");
            const chunk = this.chunkRecords.pop();
            console.log("BUILDING!");
            if(chunk===undefined) return;
            this._currentChunk = chunk;
            this._currentGenerator = chunk.terrainChunk.noiseGenerator;
        }
        else {
            console.log("BUILDING FOR REAL!");
           const a=  this._currentGenerator.next();
           console.log(a)
           if(a.done) this._currentGenerator =undefined;
           if(this._currentChunk!==undefined)
           this._currentChunk.terrainChunk.show();

        }

    }





}

