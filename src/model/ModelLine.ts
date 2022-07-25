import { Group, Matrix4 } from 'three';

export class ModelLine {
  readonly line: string;

  readonly lineIndex: number;

  readonly matrix: Matrix4;

  readonly group: Group;

  constructor(line: string, lineIndex: number, matrix: Matrix4, group: Group) {
    this.line = line;
    this.lineIndex = lineIndex;
    this.matrix = matrix;
    this.group = group;
  }
}
