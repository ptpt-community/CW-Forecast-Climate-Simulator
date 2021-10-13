import {Box2, Camera, Group, Scene, Vector2} from "three";
import {TerrainChunk} from "./TerrainChunk";
import {TerrainFeatureNoiseManager} from "./TerrainFeatureNoiseManager";
import {IChunkDirector} from "./ChunkDirector/IChunkDirector";
import {IDictionary} from "../Utils/Dictionary/IDictionary";
import {ArrayDictionary} from "../Utils/Dictionary/ArrayDictionary";
import {QuadTree} from "./ChunkDirector/QuadTree";

export class ChunkRecord extends Vector2{

    private readonly _dimension;
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
    get group(): Group {

        return this._group;
    }

    private readonly _group: Group;



    private readonly _camera: Camera;

    private _chunkPositionDictionary : IDictionary<ChunkRecord>= new ArrayDictionary();


    private _noiseManager = new TerrainFeatureNoiseManager();
    private _chunkBuilder = new ChunkBuilder();


    private _chunkDirector:IChunkDirector = new QuadTree(
        {bottomLeft: new Vector2(-512,-512), topRight: new Vector2(512,512)}
    );

    constructor(scene: Scene, camera: Camera) {
        this._group = new Group();
        scene.add(this._group);
        this._camera = camera;

        //@ts-ignore
        window.group = this._group;
    }


    public checkCameraAndAddTerrain() {

        const camera = this._camera;
        const suggestedPositionsDictionary : IDictionary<ChunkRecord>= new ArrayDictionary();

        const suggestedPositions = this._chunkDirector.getChunksFrom(camera.position);
        suggestedPositionsDictionary.setAndReplace(suggestedPositions);

        const suggestedChunksDictionary : IDictionary<ChunkRecord>= new ArrayDictionary();

        suggestedPositions.forEach(chunkPosition=>{
            const key = TerrainChunkManager.positionToKey(chunkPosition);
            suggestedChunksDictionary.add(key,chunkPosition);
        })


        const deletableDictionary : IDictionary<ChunkRecord>= new ArrayDictionary();
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

        this._chunkBuilder.build(8);


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

    build(turns:number){
        for(let i =0; i<turns; i++){
            const done = this._Build();
            if(done) return;
        }
    }


    private _Build(){

        if(this._currentGenerator === undefined) {
            const chunk = this.chunkRecords.pop();
            if(chunk===undefined) return 0;
            this._currentChunk = chunk;
            this._currentGenerator = chunk.terrainChunk.noiseGenerator;
        }
        else {
            const a=  this._currentGenerator.next();
            if(a.done) this._currentGenerator =undefined;
            if(this._currentChunk!==undefined)
                this._currentChunk.terrainChunk.show();
            else return 0;

        }

    }





}

