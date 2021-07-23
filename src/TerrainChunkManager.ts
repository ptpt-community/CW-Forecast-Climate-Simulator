import {
    AxesHelper,
    Camera,
    MeshBasicMaterial,
    Plane, PlaneGeometry,
    RepeatWrapping,
    Scene,
    Texture,
    TextureLoader,
    Vector3
} from "three";
import {PlaneCreator} from "./PlaneCreator";


export default class TerrainChunkManager{
     _scene: Scene;

     _camera: Camera;

      SIZE = 512;

     _loader:TextureLoader = new TextureLoader();

     _chunk_positions: { x_position:number, z_position: number }[] = [];
    private _terrainChunk: TerrainChunk;


    constructor(scene :Scene, camera: Camera) {

        this._scene = scene;
        this. _terrainChunk = new TerrainChunk(  this._scene, this._loader, this.SIZE);
        this._init();
        this._camera = camera;

    }

    public checkCameraAndAddTerrain(){
        const camera =this._camera;
        const newChunkPosition = this._coordinateToChunkPosition(camera.position);
        let chunkAlreadyExists  = false;
      //  console.log(newChunkPosition);
        //if (this._chunk_positions.includes(newChunkPosition)) return;
        this._chunk_positions.forEach( (positions) =>{
            if(positions.x_position === newChunkPosition.x_position && positions.z_position === newChunkPosition.z_position) {
                chunkAlreadyExists = true;
            }
        })
        if(!chunkAlreadyExists) {

            this.createChunk(newChunkPosition);
        }
        chunkAlreadyExists = false;



    }




    _coordinateToChunkPosition (position : Vector3){
        let x = Math.floor(position.x/this.SIZE);
        let z = Math.floor(position.z/this.SIZE);
        return {x_position: x, z_position: z}
    }



    _init = ()=>{
        const position = {x_position: 0, z_position: 0};
        this._terrainChunk.generateTerrain(position);
        this._chunk_positions.push(position);


    }


    private createChunk(position :{x_position : number, z_position: number}) {
        console.log("Generate New Chunk");

         this._terrainChunk.generateTerrain(position);
        this._chunk_positions.push(position);
    }
}




class TerrainChunk{

    _loader: TextureLoader;
    _scene: Scene;
    _size: number;
    _texture: Texture;
    private _planeMaterial: MeshBasicMaterial;
    private _planeGeometry: PlaneGeometry;

        constructor( scene : Scene, loader: TextureLoader, size: number) {
            this._loader = loader;
            this._scene = scene;
            this._size = size;

            const texture = loader.load("https://www.the3rdsequence.com/texturedb/download/26/texture/png/256/cracked+rock-256x256.png",()=>{
                texture.repeat.set(size, size);
                texture.wrapS = RepeatWrapping;
                texture.wrapT = RepeatWrapping;
                texture.needsUpdate = true;
            });
            this._texture = texture;

            this._planeMaterial =new MeshBasicMaterial({

                wireframe: false,
                map: texture
            })
            this._planeGeometry = new PlaneGeometry(size, size, 128,128);
    }




    generateTerrain( position :{x_position : number, z_position : number} ){
        const plane = new PlaneCreator(this._size,position.x_position*this._size,position.z_position*this._size,this._planeGeometry,this._planeMaterial).plane;
        this._scene.add(plane);
    }
}