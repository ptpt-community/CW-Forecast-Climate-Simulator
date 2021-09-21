import {BufferGeometry, Material, Mesh} from "three";

export class PlaneCreator {
    get plane(): Mesh {
        return this._plane;
    }


    private _plane: Mesh;

    constructor(size: number, positionX: number, positionZ: number, geometry: BufferGeometry, material: Material) {


        this._plane = new Mesh(geometry, material);

        this._plane.rotation.x = Math.PI * (-.5);

        this._plane.position.set(positionX, 0, positionZ );

        this._plane.frustumCulled=false;
        //can there be a better solution while keeping this true? This is for scene disappearing when camera is near


    }


}