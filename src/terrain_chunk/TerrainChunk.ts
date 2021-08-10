import {
    Group,
    Material,
    Mesh,
    PlaneGeometry,
    Scene,
    Vector2
} from "three";
import {BiomeManager} from "./Biome/BiomeManager";
import {TerrainFeatureNoiseManager} from "./TerrainFeatureNoiseManager";


//@ts-ignore
import groundVertexShader from "../shaders/ground/vertex.glsl"
//@ts-ignore
import groundFragmentShader from "../shaders/ground/fragment.glsl"

export class TerrainChunk {


    private _group: Group;

    private _width: number;
    private readonly _noisifier: TerrainFeatureNoiseManager;
    _MIN_RESOLUTION = 64 ;
    private readonly _offset: Vector2;
    private  _plane : Mesh;
    private  _BiomeManager = new BiomeManager();


    constructor(group: Group, size: number, offset:Vector2, planeMaterial: Material) {
        this._group = group;
        this._width = size;
         this._offset = offset;

        const planeGeometry = new PlaneGeometry(size, size, this._MIN_RESOLUTION, this._MIN_RESOLUTION);
        this._noisifier = new TerrainFeatureNoiseManager(new BiomeManager());
        this._plane = this._generateTerrain(planeGeometry,planeMaterial);

    }


    private applyNoise = (plane: Mesh, offset:Vector2) => {
        this._noisifier.applyFeatures(plane, {x:offset.x,z:offset.y});
    }

    private _generateTerrain(planeGeometry:PlaneGeometry,planeMaterial:Material)  {
        const plane = new Mesh(planeGeometry, planeMaterial);
        plane.position.set(this._offset.x,0,this._offset.y);
        // this.applyNoise(plane,this._offset)
        plane.castShadow = true;

        this._group.add(plane);

        plane.rotation.x = Math.PI * (-.5);
        return plane;
    }

    Hide() {
        this._plane.visible = false;
    }

    get width(){
        return this._width;
    }


    *_Rebuild() {
        const NUM_STEPS = 2000;
        const offset = this._offset;
        let count = 0;
        const biomeManager = this._BiomeManager;



        //
        const position = this._plane.geometry.attributes.position;

        for (let i = 0; i < position.count; i++) {

            const biome = biomeManager.calculateBiome(offset.x+(position.getX(i)), offset.y-(position.getY(i)));
            position.setZ(i, biome.getHeight());

            count++;
            if (count > NUM_STEPS) {
                count = 0;
                yield;
            }
        }

        //

        // for (let v of this._plane.geometry.vertices) {
        //     v.z = this._GenerateHeight(v);
        //     colours.push(this._params.colourGenerator.Get(v.x + offset.x, v.z, -v.y + offset.y));
        //
        //     count++;
        //     if (count > NUM_STEPS) {
        //         count = 0;
        //         yield;
        //     }
        //
        // }
        //
        // for (let f of this._plane.geometry.faces) {
        //     const vs = [f.a, f.b, f.c];
        //
        //     const vertexColours = [];
        //     for (let v of vs) {
        //         vertexColours.push(colours[v]);
        //     }
        //     f.vertexColors = vertexColours;
        //
        //     count++;
        //     if (count > NUM_STEPS) {
        //         count = 0;
        //         yield;
        //     }
        // }

        yield;
        // this._plane.geometry.elementsNeedUpdate = true;
        // this._plane.geometry.verticesNeedUpdate = true;
        // this._plane.geometry.computeVertexNormals();
        position.needsUpdate = true;
        this._plane.position.set(offset.x,0,offset.y);

    }


    Show() {
        this._plane.visible = true;
    }

    }




export class TerrainChunkRebuilder {
    private _pool:any;
    private _params: any;
    private _queued: any;
    private _active: any;
    private _new: any;
    old: any;
    constructor(params:any) {
        this._pool = {};
        this._params = params;
        this._Reset();
    }

    AllocateChunk(params:any) {

        const w = params.width;

        if (!(w in this._pool)) {
            this._pool[w] = [];
        }

        let c = null;
        if (this._pool[w].length > 0) {
            c = this._pool[w].pop();
            c._params = params;
        } else {
            c = new TerrainChunk(params.group,params.width,params.offset,params.material);
        }

        c.Hide();

        this._queued.push(c);

        return c;
    }

    _RecycleChunks(chunks:any) {
        for (let c of chunks) {
            if (!(c.chunk.width in this._pool)) {
                this._pool[c.chunk.width] = [];
            }

            c.chunk.Hide();
            this._pool[c.chunk.width].push(c.chunk);
        }
    }

    _Reset() {
        this._active = null;
        this._queued = [];
        this.old = [];
        this._new = [];
    }

    get Busy() {
        return this._active;
    }



    // Update2() {
    //     for (let b of this._queued) {
    //         b._Rebuild().next();
    //         this._new.push(b);
    //     }
    //     this._queued = [];
    //
    //     if (this._active) {
    //         return;
    //     }
    //
    //     if (!this._queued.length) {
    //         this._RecycleChunks(this._old);
    //         for (let b of this._new) {
    //             b.Show();
    //         }
    //         this._Reset();
    //     }
    // }

    Update() {
        if (this._active) {
            const r = this._active.next();
            if (r.done) {
                this._active = null;
            }
        } else {
            const b = this._queued.pop();
            if (b) {
                this._active = b._Rebuild();
                this._new.push(b);
            }
        }

        if (this._active) {
            return;
        }

        if (!this._queued.length) {
            this._RecycleChunks(this.old);
            for (let b of this._new) {
                b.Show();
            }
            this._Reset();
        }
    }
}