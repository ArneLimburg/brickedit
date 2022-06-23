import { FileLoader, Group } from 'three';
import { LDrawLoader } from '../loaders/LDrawLoader.js';
import { ModelInfo } from '../loaders/ModelInfo.js';
import { Submodel } from '../loaders/Submodel.js';
import { ModelLine } from './ModelLine.js';

export class Model {
  readonly fileName;

  readonly lines: string[];

  readonly loader;

  readonly modelGroup;

  readonly modelLines: Promise<ModelLine[]>;

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
    this.modelLines = this.buildLines(info);
  }

  private buildLines(info: ModelInfo): Promise<ModelLine[]> {
    if (!info.subobjects) {
      return Promise.resolve([]);
    }
    const lines = info.subobjects.map(submodel => this.buildLine(submodel));
    return Promise.all(lines).then(loadedLines => {
      loadedLines.forEach(line => this.modelGroup.add(line.group));
      return loadedLines;
    });
  }

  async loadLines() {
    return this.modelLines;
  }

  async findLine(group: Group) {
    const modelLines = await this.loadLines();
    return modelLines.find(line => line.group === group);
  }

  async buildLine(model: Submodel) {
    let loaded: (line: ModelLine) => void;
    let failed: () => void;
    const loadedLine = new Promise<ModelLine>(
      (resolve: (line: ModelLine) => void, reject: () => void) => {
        loaded = resolve;
        failed = reject;
      }
    );
    this.loadPart(
      `models/ldraw/parts/${model.fileName}`,
      model.colorCode,
      (group: Group) => {
        group.applyMatrix4(model.matrix);

        loaded(new ModelLine(model.line, model.lineIndex, group));
      },
      () => {},
      () => failed()
    );
    return loadedLine;
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
