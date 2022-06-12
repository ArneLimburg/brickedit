import { Group } from 'three';
import { LDrawLoader } from './loaders/LDrawLoader.js';
import { ModelInfo } from './loaders/ModelInfo.js';
import { Submodel } from './loaders/Submodel.js';

export class Model {
  readonly fileName;

  readonly lines;

  readonly loader;

  readonly groups;

  constructor(
    fileName: string,
    content: string,
    info: ModelInfo,
    loader: LDrawLoader
  ) {
    this.fileName = fileName;
    this.lines = content.split('\n');
    this.loader = loader;
    this.groups = this.buildGroups(info);
  }

  private buildGroups(info: ModelInfo): Promise<Group[]> {
    console.log(`info=${info}`);
    console.log(info.category);
    console.log(info.category);
    console.log(info.category);
    console.log(info.category);
    if (!info.subobjects) {
      return Promise.resolve([]);
    }
    const groups = info.subobjects.map(submodel => this.buildGroup(submodel));
    return Promise.all(groups);
  }

  async loadGroups() {
    return this.groups;
  }

  async buildGroup(model: Submodel) {
    let loaded: (group: Group) => void;
    let failed: () => void;
    const loadedGroup = new Promise<Group>(
      (resolve: (group: Group) => void, reject: () => void) => {
        loaded = resolve;
        failed = reject;
      }
    );
    this.loader.load(
      `models/ldraw/models/${model.fileName}`,
      (group: Group) => {
        group.applyMatrix4(model.matrix);
        loaded(group);
      },
      () => {},
      () => failed()
    );
    return loadedGroup;
  }
}
