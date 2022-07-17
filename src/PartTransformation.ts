import { Matrix4 } from 'three';
import { ModelLine } from './model/ModelLine.js';

export interface PartTransformation {
  line: ModelLine;
  matrix: Matrix4;
}
