import { Vector3 } from "three";
import { AbstractElement } from "./AbstractElement.js";

export interface LineSegment extends AbstractElement {
	vertices: Vector3[];
}