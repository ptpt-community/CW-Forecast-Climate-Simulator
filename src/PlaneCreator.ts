
import {Mesh, MeshBasicMaterial, PlaneGeometry, RepeatWrapping, TextureLoader} from "three";

export class PlaneCreator {
    get plane(): Mesh {
        return this._plane;
    }
    loader: TextureLoader;

    private _plane: Mesh;

    constructor(loader: TextureLoader, size: number, segments: number, positionX: number, positionZ: number) {
        this.loader = loader;

        const texture = this.loader.load("https://www.the3rdsequence.com/texturedb/download/26/texture/png/256/cracked+rock-256x256.png",()=>{
            texture.repeat.set(size, size);
            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
            texture.needsUpdate = true;
        });

        this._plane = new Mesh(new PlaneGeometry(size, size, segments, segments), new MeshBasicMaterial({

            wireframe: false,
            map: texture
        }));



        this._plane.rotation.x = Math.PI*(-.5);

        this._plane.position.set(positionX,0,positionZ);




    }





}