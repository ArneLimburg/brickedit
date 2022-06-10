import { Vector3 } from "three";
import { AbstractElement } from "./AbstractElement.js";

export interface FilledPolygon extends AbstractElement {
    faceNormal: Vector3 | null,
	vertices: Vector3[],
	normals: number[],
}