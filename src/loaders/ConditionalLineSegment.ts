import { Vector3 } from "three";
import { LineSegment } from "./LineSegment.js";

export interface ConditionalLineSegment extends LineSegment {
    controlPoints: Vector3[];
}
