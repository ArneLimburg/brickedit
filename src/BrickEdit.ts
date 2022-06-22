/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import { AmbientLight, PointLight, Scene } from 'three';
import { LDrawLoader } from './loaders/LDrawLoader.js';
import { ModelInfo } from './loaders/ModelInfo.js';
import { Model } from './Model.js';
import { ModelPane } from './ModelPane.js';

export class BrickEdit extends HTMLElement {
  scene: Scene;

  modelPane: ModelPane;

  lDrawLoader: LDrawLoader;

  model?: Model;

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = `
<style>
:host {
	display: block;
	margin: 0;
	height: 100%;
}
</style>
<model-pane id="pane"></model-pane>`;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot?.appendChild(template.content.cloneNode(true));

    this.scene = new Scene();
    const ambientLight = new AmbientLight(0xcccccc, 0.4);
    this.scene.add(ambientLight);

    const pointLight = new PointLight(0xffffff, 1);
    pointLight.position.set(-1000, 1200, 1500);
    this.scene.add(pointLight);

    this.modelPane = this.shadowRoot?.querySelector('#pane') as ModelPane;
    this.modelPane.scene = this.scene;

    this.lDrawLoader = new LDrawLoader();
  }

  connectedCallback() {
    this.init();
  }

  // eslint-disable-next-line class-methods-use-this
  async init() {
    const lDrawPath = 'models/ldraw/';
    this.lDrawLoader.setPartsLibraryPath(lDrawPath);
    await this.loadModel();
  }

  async loadModel() {
    let loadingSuccessful: (model: Model) => void;
    let loadingError: (reason: any) => void;
    const modelLoaded = new Promise<Model>((resolve, reject) => {
      loadingSuccessful = resolve;
      loadingError = reject;
    });
    const lDrawPath = 'models/ldraw/';
    this.lDrawLoader.setPartsLibraryPath(lDrawPath);
    const fileName = 'models/car.dat';
    const { lDrawLoader } = this;
    await lDrawLoader.preloadMaterials(`${lDrawPath}LDConfig.ldr`);
    this.lDrawLoader.load(
      `${lDrawPath}${fileName}`,
      () => {
        const content = `0 ~Moved to car.ldr
      0 Name: car.dat
      0 Author: [PTadmin]
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      
      0 BFC CERTIFY CCW
      
      0 // This file is just a redirection file.
      0 // It expresses that the previous official file car.dat nowadays has been moved to car.ldr
      0 // Please only refer to that file, not this one. This one is obsolete.
      
      1 16 0 0 0 1 0 0 0 1 0 0 0 1 car.ldr`;

        const modelInfo = lDrawLoader.partsCache.parseCache.parse(
          content
        ) as ModelInfo;

        const model = new Model(fileName, content, modelInfo, lDrawLoader);
        loadingSuccessful(model);
      },
      () => {},
      (reason: any) => loadingError(reason)
    );
    this.model = await modelLoaded;
    await this.model.loadGroups();
    this.scene.add(this.model.modelGroup);
    // groups.forEach(g => this.scene.add(g));
    if (this.modelPane) {
      this.modelPane.scene = this.scene;
      this.modelPane.render();
    }
  }
}
