import { Material } from 'three';

export interface AbstractElement {
  line: string;
  lineIndex: number;
  material?: Material;
  colorCode: string;
}
