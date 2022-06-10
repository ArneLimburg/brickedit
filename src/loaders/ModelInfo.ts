import { Group, Material } from "three";
import { ConditionalLineSegment } from "./ConditionalLineSegment.js";
import { FilledPolygon } from "./FilledPolygon.js";
import { LineSegment } from "./LineSegment.js";
import { Submodel } from "./Submodel.js";

export interface ModelInfo {
    faces: FilledPolygon[],
    conditionalSegments: ConditionalLineSegment[],
    lineSegments: LineSegment[],
    type: string,
    category: string,
    keywords: string,
    subobjects: Submodel[],
    totalFaces: number,
    startingConstructionStep: boolean,
    materials: Material[],
    fileName: string,
    group: Group | null;
}