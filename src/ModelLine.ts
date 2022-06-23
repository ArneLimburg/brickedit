import { Group } from 'three';

export class ModelLine {
  readonly line: string;

  readonly lineIndex: number;

  readonly group: Group;

  constructor(line: string, lineIndex: number, group: Group) {
    this.line = line;
    this.lineIndex = lineIndex;
    this.group = group;
  }
}
