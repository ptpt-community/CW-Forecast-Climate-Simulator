import {Vector3} from "three";
import {ChunkRecord} from "../TerrainChunkManager";

export interface IChunkDirector {
    getChunksFrom(position: Vector3): ChunkRecord[];

}