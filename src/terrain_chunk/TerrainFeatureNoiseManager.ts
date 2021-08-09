import {BiomeManager} from "./Biome/BiomeManager";
import {AxesHelper, Mesh, Vector3} from "three";

export class TerrainFeatureNoiseManager {


    private static amplitude = 400;
    private _biomeManager;

    constructor(biomeManager: BiomeManager) {
        this._biomeManager = biomeManager;
    }

    applyFeatures(plane: Mesh, offset: { x: number, z: number }) {

        function getOffsetX(x: number) {
            return offset.x + x;
        }

        function getOffsetZ(y: number) {
            return offset.z - y;
        }

        const axesHelper = new AxesHelper(3);
        plane.add(axesHelper);
        const vertex = new Vector3();

        const position = plane.geometry.attributes.position;

        for (let i = 0; i < position.count; i++) {

            const biome = this._biomeManager.calculateBiome(getOffsetX(position.getX(i)), getOffsetZ(position.getY(i)));
            position.setZ(i, biome.getHeight());


        }


        position.needsUpdate = true


    }
}