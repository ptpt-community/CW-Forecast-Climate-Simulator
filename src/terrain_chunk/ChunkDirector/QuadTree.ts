import {Box2, Vector2, Vector3} from "three";
import {Position} from "three/examples/jsm/utils/ShadowMapViewer";
import {IChunkDirector} from "./IChunkDirector";
import {ChunkRecord} from "../TerrainChunkManager";

const _MIN_NODE_SIZE = 500;


interface IQuadTree {
    size: Vector2;
    children: IQuadTree[];
    center: Vector2;
    bounds: Box2;
}


export class QuadTree implements IChunkDirector{

    private _root: IQuadTree;

    constructor(
        params: {
            min: Vector2,
            max: Vector2
        }
    ) {
        const box = new Box2(params.min, params.max);
        this._root = {
            bounds: box,
            children: [],
            center: box.getCenter(new Vector2()),
            size: box.getSize(new Vector2())
        }
    }


    getChildren() {
        const children: IQuadTree[] = [];
        this._GetChildren(this._root, children);
        return children;
    }


    private _GetChildren(node: IQuadTree, target: IQuadTree[]) {
        if (node.children.length == 0) {
            target.push(node);
            return
        }
        for (let c of node.children) {
            this._GetChildren(c, target);
        }

    }


    getChunksFrom(position: Vector3):ChunkRecord[] {
        this._Insert(this._root, new Vector2(position.x, position.z));
        const children =  this.getChildren();
        const chunkRecords: ChunkRecord[] = []
        children.map(child=>{
            chunkRecords.push(new ChunkRecord(child.bounds));
        })

        return chunkRecords;
    }


    private _Insert(child: IQuadTree, position: Vector2) {
        const distToChild = this._DistanceToChild(child, position);

        if (distToChild < child.size.x && child.size.x > _MIN_NODE_SIZE) {
            child.children = this._CreateChildren(child);

            for (let c of child.children) {
                this._Insert(c, position);
            }
        }
    }

    private  _DistanceToChild(child: IQuadTree, position: Vector2) {
        return child.center.distanceTo(position);
    }


    private _CreateChildren(child: IQuadTree) {
        const midpoint = child.bounds.getCenter(new Vector2());

        // Bottom left
        const bottomLeft = new Box2(child.bounds.min, midpoint);

        // Bottom right
        const bottomRight = new Box2(
            new Vector2(midpoint.x, child.bounds.min.y),
            new Vector2(child.bounds.max.x, midpoint.y));

        // Top left
        const topLeft = new Box2(
            new Vector2(child.bounds.min.x, midpoint.y),
            new Vector2(midpoint.x, child.bounds.max.y));

        // Top right
        const topRight = new Box2(midpoint, child.bounds.max);

        const children = [bottomLeft, bottomRight, topLeft, topRight].map(
            box => {
                return {
                    bounds: box,
                    children: [],
                    center: box.getCenter(new Vector2()),
                    size: box.getSize(new Vector2())
                };
            });

        return children;
    }
}


