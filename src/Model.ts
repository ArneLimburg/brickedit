import { Group } from 'three';
import { LDrawLoader } from './loaders/LDrawLoader.js';
import { ModelInfo } from './loaders/ModelInfo.js';
import { Submodel } from './loaders/Submodel.js';

export class Model {
  readonly fileName;

  readonly lines;

  readonly loader;

  readonly modelGroup;

  readonly submodelGroups;

  constructor(
    fileName: string,
    content: string,
    info: ModelInfo,
    loader: LDrawLoader
  ) {
    this.fileName = fileName;
    this.lines = content.split('\n');
    this.loader = loader;
    this.modelGroup = new Group();
    // Convert from LDraw coordinates: rotate 180 degrees around OX
    this.modelGroup.rotation.x = Math.PI;
    this.submodelGroups = this.buildGroups(info);
  }

  private buildGroups(info: ModelInfo): Promise<Group[]> {
    if (!info.subobjects) {
      return Promise.resolve([]);
    }
    const groups = info.subobjects.map(submodel => this.buildGroup(submodel));
    return Promise.all(groups).then(loadedGroups => {
      loadedGroups.forEach(group => this.modelGroup.add(group));
      return loadedGroups;
    });
  }

  async loadGroups() {
    return this.submodelGroups;
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
