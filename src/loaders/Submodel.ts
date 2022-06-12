import { Matrix4 } from 'three';
import { AbstractElement } from './AbstractElement.js';

export interface Submodel extends AbstractElement {
  matrix: Matrix4;
  fileName: string;
  inverted: boolean;
  startingConstructionStep: boolean;
}
