import {Box2, Vector2, Vector3} from "three";


export class ChunkDirector{



    private _minChunkSize;
    private _subjectPosition : Vector2 | undefined;


    constructor(minimumChunkSize:number) {
        this._minChunkSize = minimumChunkSize;
    }


    getChunksFrom(position:Vector3) {
        const boxes: Box2[] = [];
        this._subjectPosition = this.position3DToBaseBorder(position);
        console.log("Lvl 1");

        //LVL0
        const centerBox = ChunkDirector._createBoxFromBottomLeft(this._subjectPosition as Vector2,this._minChunkSize);
        boxes.push(centerBox);

        //LVL1


        const level1Neighbors =  ChunkDirector._createNeighboringBoxes(centerBox);



        //LVL2

        const level2Neighbors =  ChunkDirector._createNeighboringBoxes(level1Neighbors.greaterBox);
        boxes.concat(level2Neighbors.boxes);
        console.log(level2Neighbors.greaterBox)


        return boxes.concat(level1Neighbors.boxes,level2Neighbors.boxes);

    }











    position3DToBaseBorder (position : Vector3){
      const x =    this._minChunkSize*((position.x/this._minChunkSize)%1);
      const z =    this._minChunkSize*((position.z/this._minChunkSize)%1);


        return new Vector2(x,z)
    }


    private static _createBoxFromBottomLeft(bottomLeft: Vector2, dimension:number) :Box2{

        const otherEnd = bottomLeft.clone();
        otherEnd.addScalar(dimension);
        return new Box2(bottomLeft, otherEnd);
    }


    private static _createBoxFromTopRight(topRight: Vector2, dimension:number ) :Box2{

        const otherEnd = topRight.clone();
        otherEnd.addScalar(-dimension);
        return new Box2(otherEnd,topRight);
    }



    private static _createNeighboringBoxes(center: Box2):{boxes: Box2[], greaterBox: Box2} {
        const dimension = Math.abs((center.min.x-center.max.x));
        const bottomLeft = ChunkDirector._createBoxFromTopRight(center.min,dimension);
        const bottom= ChunkDirector._createBoxFromTopRight(new Vector2(center.max.x,center.min.y),dimension);
        const bottomRight= ChunkDirector._createBoxFromBottomLeft(new Vector2(bottom.max.x,bottom.min.y),dimension);
        const right= ChunkDirector._createBoxFromBottomLeft(bottom.max,dimension);
        const topRight= ChunkDirector._createBoxFromBottomLeft(center.max,dimension);
        const top= ChunkDirector._createBoxFromBottomLeft(new Vector2(center.min.x,center.max.y),dimension);
        const topLeft= ChunkDirector._createBoxFromTopRight(new Vector2(top.min.x,top.max.y),dimension);
        const left= ChunkDirector._createBoxFromTopRight(top.min,dimension);


        const greaterBox = new Box2(bottomLeft.min.clone(),topRight.max.clone());
        const boxes = [right,topRight,top,topLeft,left,bottomLeft,bottom,bottomRight];

        return {boxes,greaterBox};

    }
}