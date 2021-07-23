import {AxesHelper, Mesh} from "three";

export class Noisifier {
    noisify(plane: Mesh) {
        const axesHelper = new AxesHelper(3);
        plane.add(axesHelper);

        const position = plane.geometry.attributes.position;

        for (let i = 0; i< position.count; i++){
            position.setZ (i, this.getHeight());
        }

        position.needsUpdate = true
    }


    private getHeight() {
        return Math.random() * 20;
    }
}