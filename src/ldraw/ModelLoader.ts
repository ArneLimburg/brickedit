import { FileLoader, Group } from 'three';
import { LDrawLoader } from './LDrawLoader.js';
import { ModelInfo } from './ModelInfo.js';
import { Submodel } from './Submodel.js';
import { ModelLine } from '../model/ModelLine.js';
import { Model } from '../model/Model.js';

export class ModelLoader {
  readonly lDrawLoader;

  constructor(loader: LDrawLoader) {
    this.lDrawLoader = loader;
  }

  async load(fileName: string, content: string): Promise<Model> {
    const modelGroup = new Group();
    // Convert from LDraw coordinates: rotate 180 degrees around OX
    modelGroup.rotation.x = Math.PI;
    await this.fillCache(this.lDrawLoader.partsLibraryPath + fileName);
    const info = this.lDrawLoader.partsCache.parseCache.parse(
      content
    ) as ModelInfo;

    const modelLines = await this.buildLines(info, modelGroup);
    return new Model(fileName, content, modelGroup, modelLines);
  }

  private async fillCache(url: string) {
    let loadingSuccessful: () => void;
    let loadingFailed: (reason: any) => void;
    const loading = new Promise<void>((resolve, reject) => {
      loadingSuccessful = resolve;
      loadingFailed = reject;
    });
    this.lDrawLoader.load(
      url,
      () => loadingSuccessful(),
      () => {},
      (reason?: any) => loadingFailed(reason)
    );
    return loading;
  }

  private async buildLines(
    info: ModelInfo,
    modelGroup: Group
  ): Promise<ModelLine[]> {
    if (!info.subobjects) {
      return Promise.resolve([]);
    }
    const lines = info.subobjects.map(submodel => this.buildLine(submodel));
    return Promise.all(lines).then(loadedLines => {
      loadedLines.forEach(line => modelGroup.add(line.group));
      return loadedLines;
    });
  }

  private async buildLine(model: Submodel) {
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

        loaded(new ModelLine(model.line, model.lineIndex, model.matrix, group));
      },
      () => {},
      () => failed()
    );
    return loadedLine;
  }

  private loadPart(
    url: string,
    colorCode: string,
    onLoad: (group: Group) => void,
    onProgress: () => void,
    onError: () => void
  ) {
    const fileLoader = new FileLoader(this.lDrawLoader.manager);
    fileLoader.setPath(this.lDrawLoader.path);
    fileLoader.setRequestHeader(this.lDrawLoader.requestHeader);
    fileLoader.setWithCredentials(this.lDrawLoader.withCredentials);
    fileLoader.load(
      url,
      text => {
        this.lDrawLoader.partsCache
          .parseModel(text)
          .then(group => {
            this.lDrawLoader.applyMaterialsToMesh(
              group,
              colorCode,
              this.lDrawLoader.materialLibrary,
              true
            );
            this.lDrawLoader.computeConstructionSteps(group);
            onLoad(group);
          })
          .catch(onError);
      },
      onProgress,
      onError
    );
  }
}
