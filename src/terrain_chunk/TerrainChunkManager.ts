import {Box2, Camera, Mesh, Scene, TextureLoader, Vector2, Vector3} from "three";
import {TerrainChunk} from "./TerrainChunk";
import {QuadTree} from "./QuadTree";

export class ChunkPosition{
    private readonly _chunk_x: number;
    private readonly _chunk_z: number;


    constructor(chunk_x: number, chunk_z: number) {
        this._chunk_x = chunk_x;
        this._chunk_z = chunk_z;
    }

    get chunk_x(): number {
        return this._chunk_x;
    }

    get chunk_z(): number {
        return this._chunk_z;
    }
}


class ChunkRecord{
    private readonly _position:ChunkPosition;
    private readonly _plane: Mesh;

    constructor(position: ChunkPosition, plane: Mesh) {
        this._position= position;
        this._plane = plane;
    }


    get plane(): Mesh {
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
       return  this._chunkRecords_dp[ChunkRecordList.positionToKey(position)] !== undefined;
    }



    private static positionToKey(position: ChunkPosition):string{
        return  ''+position.chunk_x+','+position.chunk_z;
    }



}


interface IChunkChild{
         position: number[],
        dimensions: number[],
        bounds: Box2
}





export default class TerrainChunkManager {
    _scene: Scene;

    _camera: Camera;

    SIZE = 512;

    private _GRID_SIZE = 1;

    _loader: TextureLoader = new TextureLoader();

    _chunk_record_list = new ChunkRecordList();


    private _terrainChunk: TerrainChunk;


    constructor(scene: Scene, camera: Camera) {

        this._scene = scene;
        this._terrainChunk = new TerrainChunk(this._scene, this._loader, this.SIZE);
        this._init();
        this._camera = camera;

    }

    // public checkCameraAndAddTerrain() {
    //
    //     const camera = this._camera;
    //     const cameraChunk = this._coordinateToChunkPosition(camera.position);
    //
    //
    //     for(let i=-this._GRID_SIZE; i<=this._GRID_SIZE; i++){
    //         for(let j=-this._GRID_SIZE; j<this._GRID_SIZE; j++){
    //             const chunkPosition = new ChunkPosition(cameraChunk.chunk_x+i, cameraChunk.chunk_z+j);
    //             if(!this._chunk_record_list.contains(chunkPosition))  this.createChunk(chunkPosition);
    //         }
    //     }
    //
    //
    // }

    _chunks :IChunkChild[] = [];



    public checkCameraAndAddTerrain() {

        function _Key(c:IChunkChild) {
            return c.position[0] + '/' + c.position[1] + ' [' + c.dimensions[0] + ']';
        }

        let newTerrainChunks: any = {}


        const quadTree = new QuadTree({
            bottomLeft: new Vector2(-32000,32000),
            topRight: new Vector2(32000,32000)
        })

       function dictionaryDifference(dictA:IChunkChild[], dictB:IChunkChild[]):IChunkChild[] {
            const diff = {...dictA};
            for (let k in dictB) {
                delete diff[k];
            }
            return diff;
        }

        quadTree.insert(this._camera.position);
        const nodes = quadTree.getNodes();

        const center = new Vector2();
        const dimensions = new Vector2();

        for(let node of nodes){
            node.bounds.getCenter(center);
            node.bounds.getSize(dimensions);
            const child = {
                position: [center.x,center.y],
                bounds: node.bounds,
                dimensions: [dimensions.x,dimensions.y]
            }

            const k = _Key(child);
            newTerrainChunks[k] = child;

        }


        const difference = dictionaryDifference(newTerrainChunks,this._chunks)

        for(let k in difference){
            const [xp,zp] = difference[k].position;
            const offset = new Vector2(xp,zp);
            this._chunks[k] = {
                position: [xp,zp],
                chunk: this.createChunk()
            }
        }





        const camera = this._camera;
        const cameraChunk = this._coordinateToChunkPosition(camera.position);


        for(let i=-this._GRID_SIZE; i<=this._GRID_SIZE; i++){
            for(let j=-this._GRID_SIZE; j<this._GRID_SIZE; j++){
                const chunkPosition = new ChunkPosition(cameraChunk.chunk_x+i, cameraChunk.chunk_z+j);
                if(!this._chunk_record_list.contains(chunkPosition))  this.createChunk(chunkPosition);
            }
        }


    }


    _coordinateToChunkPosition(position: Vector3) : ChunkPosition {
        let x = Math.floor(position.x / this.SIZE);
        let z = Math.floor(position.z / this.SIZE);
        return new ChunkPosition(x,z);
    }


    _init = () => {
       this.createChunk(new ChunkPosition(0,0));
    }


    private createChunk(position: ChunkPosition) {
        console.log("Generate New Chunk");

        const plane = this._terrainChunk.generateTerrain(position);
        this._chunk_record_list.add(new ChunkRecord(position,plane));
    }
}

