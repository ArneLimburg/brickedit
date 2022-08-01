import { Matrix4 } from 'three';
import { ModelLine } from './ModelLine.js';

export interface PartTransformation {
  line: ModelLine;
  matrix: Matrix4;
}
