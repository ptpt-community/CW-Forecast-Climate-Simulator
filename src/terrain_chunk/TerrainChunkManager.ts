import {Camera, Scene, TextureLoader, Vector3} from "three";
import {TerrainChunk} from "./TerrainChunk";

export default class TerrainChunkManager {
    _scene: Scene;

    _camera: Camera;

    SIZE = 512;

    _loader: TextureLoader = new TextureLoader();

    _chunk_positions: { x_position: number, z_position: number }[] = [];
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
        this._chunk_positions.forEach((positions) => {
            if (positions.x_position === newChunkPosition.x_position && positions.z_position === newChunkPosition.z_position) {
                chunkAlreadyExists = true;
            }
        })
        if (!chunkAlreadyExists) {

            this.createChunk(newChunkPosition);
        }
        chunkAlreadyExists = false;


    }


    _coordinateToChunkPosition(position: Vector3) {
        let x = Math.floor(position.x / this.SIZE);
        let z = Math.floor(position.z / this.SIZE);
        return {x_position: x, z_position: z}
    }


    _init = () => {
        const position = {x_position: 0, z_position: 0};
        this._terrainChunk.generateTerrain(position);
        this._chunk_positions.push(position);


    }


    private createChunk(position: { x_position: number, z_position: number }) {
        console.log("Generate New Chunk");

        this._terrainChunk.generateTerrain(position);
        this._chunk_positions.push(position);
    }
}