import {Camera, Mesh, Scene, TextureLoader, Vector3} from "three";
import {TerrainChunk} from "./TerrainChunk";

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
        this._position = position;
        this._plane = plane;
    }

    get position(): ChunkPosition {
        return this._position;
    }

    get plane(): Mesh {
        return this._plane;
    }

    containsPosition (position: ChunkPosition) : boolean{
        return this.position.chunk_x == position.chunk_x && this.position.chunk_z == position.chunk_z;

    }

}


export default class TerrainChunkManager {
    _scene: Scene;

    _camera: Camera;

    SIZE = 512;

    _loader: TextureLoader = new TextureLoader();

    _chunk_records: ChunkRecord[] = [];
    private _terrainChunk: TerrainChunk;


    constructor(scene: Scene, camera: Camera) {

        this._scene = scene;
        this._terrainChunk = new TerrainChunk(this._scene, this._loader, this.SIZE);
        this._init();
        this._camera = camera;

    }

    public checkCameraAndAddTerrain() {
        const camera = this._camera;
        const newChunkPosition = this._coordinateToChunkPosition(camera.position);
        let chunkAlreadyExists = false;
        //  console.log(newChunkPosition);
        //if (this._chunk_positions.includes(newChunkPosition)) return;
        this._chunk_records.forEach((record) => {
                chunkAlreadyExists = record.containsPosition(newChunkPosition);
        })
        if (!chunkAlreadyExists) {
            this.createChunk(newChunkPosition);
        }
        chunkAlreadyExists = false;


    }


    _coordinateToChunkPosition(position: Vector3) : ChunkPosition {
        let x = Math.floor(position.x / this.SIZE);
        let z = Math.floor(position.z / this.SIZE);
        return new ChunkPosition(x,z);
    }


    _init = () => {
        const position = new ChunkPosition(0,0);
        const plane =  this._terrainChunk.generateTerrain(position);
        this._chunk_records.push(new ChunkRecord(position,plane));

    }


    private createChunk(position: ChunkPosition) {
        console.log("Generate New Chunk");

        const plane = this._terrainChunk.generateTerrain(position);
        this._chunk_records.push(new ChunkRecord(position,plane));
    }
}