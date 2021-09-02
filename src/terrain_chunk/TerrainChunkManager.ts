import {Box2, Camera, Group, Scene, TextureLoader, Vector2} from "three";
import {TerrainChunk} from "./TerrainChunk";
import {TerrainFeatureNoiseManager} from "./TerrainFeatureNoiseManager";
import {BiomeManager} from "./Biome/BiomeManager";
import {GridChunkDirector} from "./ChunkDirector/GridChunkDirector";
import {IChunkDirector} from "./ChunkDirector/IChunkDirector";

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


class Dictionary{
    private _collection:any = [];

    add(at:string, object: any){
        this._collection[at] = object;
    }

    remove(at:string){
        delete this._collection[at];
    }

    setAndReplace(object: any[]){
        this._collection = object;
    }

    getAll(){
        return this._collection;
    }

    getAt(key:string){
        return this._collection[key];
    }

}



export default class TerrainChunkManager {
    private readonly _group: Group;
    private readonly _camera: Camera;

    private _chunkPositionDictionary = new Dictionary();


    private _noiseManager = new TerrainFeatureNoiseManager(new BiomeManager());
    private _chunkBuilder = new ChunkBuilder();


    private _chunkDirector:IChunkDirector = new GridChunkDirector(256);
    
    constructor(scene: Scene, camera: Camera) {
        this._group = new Group();
        scene.add(this._group);
        this._camera = camera;
    }


    public checkCameraAndAddTerrain() {

        const camera = this._camera;
        const suggestedPositionsDictionary = new Dictionary();


        const suggestedPositions = this._chunkDirector.getChunksFrom(camera.position);
        suggestedPositionsDictionary.setAndReplace(suggestedPositions);

        const suggestedChunksDictionary = new Dictionary();

        suggestedPositions.forEach(chunkPosition=>{
            const key = TerrainChunkManager.positionToKey(chunkPosition);
            suggestedChunksDictionary.add(key,chunkPosition);
        })


        const deletableDictionary = new Dictionary();
        const deletableChunks =  TerrainChunkManager._subtractSet(this._chunkPositionDictionary.getAll(), suggestedChunksDictionary.getAll());
        deletableDictionary.setAndReplace(deletableChunks);

        for(let key in suggestedChunksDictionary.getAll()){
            if(this._chunkPositionDictionary.getAt(key)) continue;
            this.createChunk(suggestedChunksDictionary.getAt(key));
        }



        for(let key in deletableDictionary.getAll()){

            this._chunkPositionDictionary.getAt(key).terrainChunk.destroy();
            this._chunkPositionDictionary.remove(key);
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
        this._chunkPositionDictionary.add(TerrainChunkManager.positionToKey(position), position);
        this._chunkBuilder.push(position);

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

        if(this._currentGenerator === undefined) {
            const chunk = this.chunkRecords.pop();
            if(chunk===undefined) return;
            this._currentChunk = chunk;
            this._currentGenerator = chunk.terrainChunk.noiseGenerator;
        }
        else {
           const a=  this._currentGenerator.next();
           if(a.done) this._currentGenerator =undefined;
           if(this._currentChunk!==undefined)
           this._currentChunk.terrainChunk.show();

        }

    }





}

