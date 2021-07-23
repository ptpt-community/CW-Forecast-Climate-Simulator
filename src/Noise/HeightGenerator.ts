import {AxesHelper, CurveUtils, Mesh, Object3D, Vector3} from "three";
import seedrandom from "seedrandom";
import interpolate = CurveUtils.interpolate;


export class HeightGenerator {

    private static amplitude = 30;
    private static blend = 3;
     private static seed = ''+100100;
    applyHeight(plane: Mesh , offset:{x: number, z: number}) {
        const axesHelper = new AxesHelper(3);
        plane.add(axesHelper);
        const vertex = new Vector3();

        const position = plane.geometry.attributes.position;

        for (let i = 0; i< position.count; i++){;
            position.setZ (i, HeightGenerator.getHeight( offset.x+position.getX(i), offset.z - position.getY(i)) );
        }

        position.needsUpdate = true
    }


    private static getHeight(x:number, y:number) {
        return this.getInterpolatedNoise(x/16, y/16)*this.amplitude;

    }

    private static getInterpolatedNoise(x:number, z:number){
        const integerX = Math.floor(x);
        const integerZ = Math.floor(z);
        const fractX = x - integerX;
        const fractZ = z - integerZ;

        const v1 = this.getSmoothNoise(integerX,integerZ);
        const v2 = this.getSmoothNoise(integerX+1,integerZ);
        const v3 = this.getSmoothNoise(integerX,integerZ+1);
        const v4 = this.getSmoothNoise(integerX+1,integerZ+1);

        const i1 = this.interpolate(v1,v2,fractX);
        const i2 = this.interpolate(v3,v4,fractX);

        return this.interpolate(i1,i2,fractZ);

    }

    private static interpolate(a:number,b:number, blend: number){
        const theta = blend*Math.PI;
        const f = (1-Math.cos(theta))*.5;
        return a*(1-f) +b*f;
    }

    private static getSmoothNoise(x:number, y:number){
        const corners = (this.getNoise(x-1,y-1)+this.getNoise(x+1,y-1)+this.getNoise(x-1,y+1)+this.getNoise(x+1,y+1))/16;
        const edges = (this.getNoise(x-1,y)+this.getNoise(x,y-1)+this.getNoise(x+1,y)+this.getNoise(x,y+1))/8;
        const center = this.getNoise(x,y)/4;
        return corners +edges +center;
    }


    private static getNoise(x: number, y: number) {
        const seeder = seedrandom.alea(HeightGenerator.seed + x * 30000 + y * 90000);
        return (seeder()- .5)*2;
    }
}