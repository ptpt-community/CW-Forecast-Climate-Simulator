import {
    Box2,
    Camera, FrontSide, Group,
    Scene,
    ShaderMaterial,

    Vector2, Vector3,

} from "three";

import {TerrainChunk, TerrainChunkRebuilder} from "./TerrainChunk";
import {QuadTree} from "./QuadTree";
//@ts-ignore
import groundVertexShader from "../shaders/ground/vertex.glsl";
//@ts-ignore
import groundFragmentShader from "../shaders/ground/fragment.glsl";



interface IChunkChild{
         position: number[],
        dimensions: number[],
        bounds: Box2|undefined,
        chunk: TerrainChunk|undefined

}





export default class TerrainChunkManager {

    _group: Group;

    _camera: Camera;

    _builder =  new TerrainChunkRebuilder({});

    private readonly _MIN_CELL_RESOLUTION = 64;

    constructor(scene: Scene, camera: Camera) {
        this._group = new Group();
        scene.add(this._group);
        this._camera = camera;
    }


    _chunks :IChunkChild[] = [];



    private checkCameraAndAddTerrain() {


        function _Key(c:IChunkChild) {
            return c.position[0] + '/' + c.position[1] + ' [' + c.dimensions[0] + ']';
        }

        const quadTree = new QuadTree({
            bottomLeft: new Vector2(-32000,-32000),
            topRight: new Vector2(32000,32000)
        })

        quadTree.insert(this._camera.position);

        const nodes = quadTree.getNodes();


        function dictionaryIntersection<T>(dictA:T[], dictB:T[]) {
            const intersection : T[]= [];
            for (let k in dictB) {
                if (k in dictA) {
                    intersection[k] = dictA[k];
                }
            }
            return intersection
        }


        function dictionaryDifference <T>(dictA:T[], dictB:T[]):T[] {
            const diff = {...dictA};
            for (let k in dictB) {
                delete diff[k];
            }
            return diff;
        }



        let newTerrainChunks: any = {}








        const center = new Vector2();
        const dimensions = new Vector2();

        for(let node of nodes){
            node.bounds.getCenter(center);
            node.bounds.getSize(dimensions);
            const child:IChunkChild = {
                position: [center.x,center.y],
                bounds: node.bounds,
                dimensions: [dimensions.x,dimensions.y],
                chunk: undefined
            }

            const k = _Key(child);
            newTerrainChunks[k] = child;

        }

        const intersection = dictionaryIntersection(this._chunks, newTerrainChunks);
        const difference = dictionaryDifference(newTerrainChunks,this._chunks);
        const recycle = Object.values(dictionaryDifference(this._chunks, newTerrainChunks));

        this._builder.old.push(...recycle);

        newTerrainChunks = intersection;

        for(let k in difference){
            const [xp,zp] = difference[k].position;
            const offset = new Vector2(xp,zp);
            newTerrainChunks[k] = {
                position: [xp,zp],
                chunk:this._CreateTerrainChunk(offset,difference[k].dimensions[0])
            }
        }

        this._chunks = newTerrainChunks;



    }





    private _CreateTerrainChunk(offset: Vector2, width: number) : TerrainChunk{

        const params = {
            group: this._group,
            material: this._material,
            width: width,
            offset:offset,
            resolution: this._MIN_CELL_RESOLUTION,
            // heightGenerators: [new HeightGenerator(this._noise, offset, 100000, 100000 + 1)],
        };

        return this._builder.AllocateChunk(params);

    }

    Update() {
        this._builder.Update();
        if (!this._builder.Busy) {
            this.checkCameraAndAddTerrain();
        }
    }




    _material = new ShaderMaterial({
        wireframe: true,
        wireframeLinewidth: 1,
        side: FrontSide,
        vertexShader:groundVertexShader,
        fragmentShader:groundFragmentShader

    });



}

