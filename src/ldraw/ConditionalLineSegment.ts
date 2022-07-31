import { Vector3 } from 'three';
import { LineSegment } from './LineSegment.js';

export interface ConditionalLineSegment extends LineSegment {
  // eslint-disable-next-line no-unused-vars
  controlPoints: Vector3[];
}
