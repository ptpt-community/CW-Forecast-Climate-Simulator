import {Box2, Vector2, Vector3} from "three";
import {ChunkPosition} from "./TerrainChunkManager";


export class ChunkDirector {


    private readonly _minChunkSize;
    private _lastPosition: undefined | Vector2 = undefined;

    private _subjectPosition: Vector2 | undefined;
    private _saved: ChunkPosition[] | undefined = undefined;


    constructor(minimumChunkSize: number) {
        this._minChunkSize = minimumChunkSize;
    }


    getChunksFrom(position: Vector3): ChunkPosition[] {


        this._subjectPosition = this.position3DToBaseBorder(position);
        if (this._lastPosition === this._subjectPosition) return this._saved as ChunkPosition[];
        this._lastPosition = this._subjectPosition;

        const chunkPositions: ChunkPosition[] = [];

        //LVL0
        const centerBox = ChunkDirector._createBoxFromBottomLeft(this._subjectPosition as Vector2, this._minChunkSize);
        chunkPositions.push(new ChunkPosition(centerBox));

        //LVL1
        const level1Neighbors = ChunkDirector._createNeighboringBoxes(centerBox);


        //LVL2
        const level2Neighbors = ChunkDirector._createNeighboringBoxes(level1Neighbors.greaterBox);



        this._saved = chunkPositions.concat(level1Neighbors.chunkPositions, level2Neighbors.chunkPositions);
        return this._saved;

    }


    position3DToBaseBorder(position: Vector3) {
        const x = ChunkDirector.distanceAtCycle(position.x,this._minChunkSize)
        const z = ChunkDirector.distanceAtCycle(position.z,this._minChunkSize);


        return new Vector2(x, z)
    }

    private static distanceAtCycle(distance: number, cycleLength: number) {
        const numberOfCycles = Math.floor(distance / cycleLength);
        return numberOfCycles  * cycleLength
    }


    private static _createBoxFromBottomLeft(bottomLeft: Vector2, dimension: number): Box2 {

        const otherEnd = bottomLeft.clone();
        otherEnd.addScalar(dimension);
        return new Box2(bottomLeft, otherEnd);
    }


    private static _createBoxFromTopRight(topRight: Vector2, dimension: number): Box2 {

        const otherEnd = topRight.clone();
        otherEnd.addScalar(-dimension);
        return new Box2(otherEnd, topRight);
    }


    private static _createNeighboringBoxes(center: Box2): { chunkPositions: ChunkPosition[], greaterBox: Box2 } {
        const dimension = Math.abs((center.min.x - center.max.x));
        const bottomLeft = ChunkDirector._createBoxFromTopRight(center.min, dimension);
        const bottom = ChunkDirector._createBoxFromTopRight(new Vector2(center.max.x, center.min.y), dimension);
        const bottomRight = ChunkDirector._createBoxFromBottomLeft(new Vector2(bottom.max.x, bottom.min.y), dimension);
        const right = ChunkDirector._createBoxFromBottomLeft(bottom.max, dimension);
        const topRight = ChunkDirector._createBoxFromBottomLeft(center.max, dimension);
        const top = ChunkDirector._createBoxFromBottomLeft(new Vector2(center.min.x, center.max.y), dimension);
        const topLeft = ChunkDirector._createBoxFromTopRight(new Vector2(top.min.x, top.max.y), dimension);
        const left = ChunkDirector._createBoxFromTopRight(top.min, dimension);


        const greaterBox = new Box2(bottomLeft.min.clone(), topRight.max.clone());
        const chunkPositions:ChunkPosition[] = [];
        [right, topRight, top, topLeft, left, bottomLeft, bottom, bottomRight].map(box=>{
            chunkPositions.push(new ChunkPosition(box));
        });
        return {chunkPositions, greaterBox};

    }
}