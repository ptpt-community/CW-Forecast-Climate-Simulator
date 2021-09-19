import {Box2, Vector2, Vector3} from "three";
import {Position} from "three/examples/jsm/utils/ShadowMapViewer";
import {IChunkDirector} from "./IChunkDirector";
import {ChunkRecord} from "../TerrainChunkManager";

const _MIN_NODE_SIZE = 8;


interface IQuadTree {
    size: Vector2;
    children: IQuadTree[];
    center: Vector2;
    bounds: Box2;
}


export class QuadTree implements IChunkDirector{

    private readonly _root: IQuadTree;

    constructor(
        params: {
            bottomLeft: Vector2,
            topRight: Vector2
        }
    ) {
        const box = new Box2(params.bottomLeft, params.topRight);
        this._root = {
            bounds: box,
            children: [],
            center: box.getCenter(new Vector2()),
            size: box.getSize(new Vector2())
        }
    }



    getNodes() {
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

    getChunksFrom(position: Vector3) {
        this._Insert(this._root, new Vector2(position.x, position.z));

        const nodes =  this.getNodes();
        const chunkRecords: ChunkRecord[] = []
        nodes.map(child=>{
            chunkRecords.push(new ChunkRecord(child.bounds));
        })

        return chunkRecords;
    }

    private _Insert(node: IQuadTree, position: Vector2) {
        const distanceToNode = this._DistanceToNode(node, position);

        if (distanceToNode < node.size.x && node.size.x > _MIN_NODE_SIZE) {
            node.children = this._CreateChildren(node);

            for (let c of node.children) {
                this._Insert(c, position);
            }
        }
    }

    private _DistanceToNode(node: IQuadTree, position: Vector2) {
        return node.center.distanceTo(position);
    }


    private _CreateChildren(node: IQuadTree) {
        const midpoint = node.bounds.getCenter(new Vector2());

        // Bottom left
        const bottomLeft = new Box2(node.bounds.min, midpoint);

        // Bottom right
        const bottomRight = new Box2(
            new Vector2(midpoint.x, node.bounds.min.y),
            new Vector2(node.bounds.max.x, midpoint.y));

        // Top left
        const topLeft = new Box2(
            new Vector2(node.bounds.min.x, midpoint.y),
            new Vector2(midpoint.x, node.bounds.max.y));

        // Top right
        const topRight = new Box2(midpoint, node.bounds.max);

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


