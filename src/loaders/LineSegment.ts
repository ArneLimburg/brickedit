import { Vector3 } from 'three';
import { AbstractElement } from './AbstractElement.js';

export interface LineSegment extends AbstractElement {
  // eslint-disable-next-line no-unused-vars
  vertices: Vector3[];
}
