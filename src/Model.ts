import { FileLoader, Group } from 'three';
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
    console.log('build groups');
    const groups = info.subobjects.map(submodel => this.buildGroup(submodel));
    console.log('groups built');
    return Promise.all(groups).then(loadedGroups => {
      loadedGroups.forEach(group => this.modelGroup.add(group));
      console.log('added to model group');
      return loadedGroups;
    });
  }

  async loadGroups() {
    console.log('loadGroups');
    return this.submodelGroups;
  }

  async buildGroup(model: Submodel) {
    console.log(`build group ${model.fileName}`);
    let loaded: (group: Group) => void;
    let failed: () => void;
    const loadedGroup = new Promise<Group>(
      (resolve: (group: Group) => void, reject: () => void) => {
        loaded = resolve;
        failed = reject;
      }
    );
    console.log(`load models/ldraw/models/${model.fileName}`);
    this.loadPart(
      `models/ldraw/parts/${model.fileName}`,
      model.colorCode,
      (group: Group) => {
        console.log(`group ${model.fileName} built`);
        group.applyMatrix4(model.matrix);
        console.log(`model.colorCode = ${model.colorCode}`);
        // this.loader.applyMaterialsToMesh(group, model.colorCode, this.loader.materialLibrary, true);
        console.log(`matrix for ${model.fileName} applied`);
        loaded(group);
      },
      () => {},
      () => failed()
    );
    return loadedGroup;
  }

  loadPart(
    url: string,
    colorCode: string,
    onLoad: (group: Group) => void,
    onProgress: () => void,
    onError: () => void
  ) {
    const fileLoader = new FileLoader(this.loader.manager);
    fileLoader.setPath(this.loader.path);
    fileLoader.setRequestHeader(this.loader.requestHeader);
    fileLoader.setWithCredentials(this.loader.withCredentials);
    fileLoader.load(
      url,
      text => {
        this.loader.partsCache
          .parseModel(text)
          .then(group => {
            this.loader.applyMaterialsToMesh(
              group,
              colorCode,
              this.loader.materialLibrary,
              true
            );
            this.loader.computeConstructionSteps(group);
            onLoad(group);
          })
          .catch(onError);
      },
      onProgress,
      onError
    );
  }
}
