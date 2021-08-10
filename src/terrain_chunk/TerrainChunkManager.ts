import {
    Box2,
    Camera, FrontSide,
    Mesh, MeshStandardMaterial,
    Plane,
    PlaneBufferGeometry,
    Scene,
    ShaderMaterial,
    TextureLoader,
    Vector2,
    Vector3
} from "three";

import {TerrainChunk} from "./TerrainChunk";
import {QuadTree} from "./QuadTree";
//@ts-ignore
import groundVertexShader from "../shaders/ground/vertex.glsl";
//@ts-ignore
import groundFragmentShader from "../shaders/ground/fragment.glsl";

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
        bounds: Box2|undefined,
        child: TerrainChunk|undefined

}





export default class TerrainChunkManager {
    _scene: Scene;

    _camera: Camera;

    SIZE = 512;




    constructor(scene: Scene, camera: Camera) {
        this._scene = scene;
        this._camera = camera;
    }


    _chunks :IChunkChild[] = [];



    public checkCameraAndAddTerrain() {

        function _Key(c:IChunkChild) {
            return c.position[0] + '/' + c.position[1] + ' [' + c.dimensions[0] + ']';
        }

        let newTerrainChunks: any = {}


        const quadTree = new QuadTree({
            bottomLeft: new Vector2(-32000,-32000),
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
            const child:IChunkChild = {
                position: [center.x,center.y],
                bounds: node.bounds,
                dimensions: [dimensions.x,dimensions.y],
                child: undefined
            }

            const k = _Key(child);
            newTerrainChunks[k] = child;

        }


        const difference = dictionaryDifference(newTerrainChunks,this._chunks)

        for(let k in difference){
            const [xp,zp] = difference[k].position;
            const offset = new Vector2(xp,zp);
            this._chunks[k] = {
                bounds: undefined,
                dimensions: [],
                position: [xp,zp],
                child:this._CreateTerrainChunk(offset,difference[k].dimensions[0])
            }
        }



    }


    private _CreateTerrainChunk(offset: Vector2, size: number) : TerrainChunk{
        return new TerrainChunk(this._scene,size,offset,this._planeMaterial);

    }





    _coordinateToChunkPosition(position: Vector3) : ChunkPosition {
        let x = Math.floor(position.x / this.SIZE);
        let z = Math.floor(position.z / this.SIZE);
        return new ChunkPosition(x,z);
    }



    _planeMaterial = new ShaderMaterial({
        wireframe: false,
        wireframeLinewidth: 1,
        side: FrontSide,
        vertexShader:groundVertexShader,
        fragmentShader:groundFragmentShader

    });



}

