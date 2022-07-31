import { Group } from 'three';
import { ConditionalLineSegment } from './ConditionalLineSegment.js';
import { FilledPolygon } from './FilledPolygon.js';
import { LineSegment } from './LineSegment.js';
import { Submodel } from './Submodel.js';
import { Materials } from './Materials.js';

export interface ModelInfo {
  faces: FilledPolygon[];
  conditionalSegments: ConditionalLineSegment[];
  lineSegments: LineSegment[];
  type: string;
  category: string;
  keywords: string[];
  subobjects: Submodel[];
  totalFaces: number;
  startingConstructionStep: boolean;
  materials: Materials;
  fileName: string | null;
  group: Group | null;
}
