
import {Mesh, MeshBasicMaterial, PlaneGeometry, RepeatWrapping, TextureLoader} from "three";

export class PlaneCreator {
    get plane(): Mesh {
        return this._plane;
    }
    loader: TextureLoader;

    private _plane: Mesh;

    constructor(loader: TextureLoader, size: number, segments: number, positionX: number, positionY: number) {
        this.loader = loader;

        const texture = this.loader.load("https://www.the3rdsequence.com/texturedb/download/26/texture/png/256/cracked+rock-256x256.png");
        texture.repeat.set(size, size);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        this._plane = new Mesh(new PlaneGeometry(size, size, segments, segments), new MeshBasicMaterial({

            wireframe: false,
            map: texture
        }));

        this._plane.position.set(positionX,positionY,0);


        texture.needsUpdate = true;

    }





}