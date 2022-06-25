import { Group } from 'three';
import { ModelLine } from './ModelLine.js';

export class Model {
  readonly fileName;

  readonly lines: string[];

  readonly modelGroup;

  readonly modelLines: ModelLine[];

  constructor(
    fileName: string,
    content: string,
    modelGroup: Group,
    modelLines: ModelLine[]
  ) {
    this.fileName = fileName;
    this.lines = content.split('\n');
    this.modelGroup = modelGroup;
    this.modelLines = modelLines;
  }

  findLine(group: Group) {
    return this.modelLines.find(line => line.group === group);
  }
}
