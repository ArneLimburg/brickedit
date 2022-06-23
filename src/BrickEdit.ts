/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import { AmbientLight, PointLight, Scene } from 'three';
import { LDrawLoader } from './loaders/LDrawLoader.js';
import { ModelInfo } from './loaders/ModelInfo.js';
import { Model } from './model/Model.js';
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
    const fileName = 'models/car.ldr';
    const { lDrawLoader } = this;
    await lDrawLoader.preloadMaterials(`${lDrawPath}LDConfig.ldr`);
    this.lDrawLoader.load(
      `${lDrawPath}${fileName}`,
      () => {
        const content = `0 Example Car for Demonstration of LDRAW Library
        0 Name: car.ldr
        0 Author: James Jessiman
        
        0 // This file demonstrates how you can assemble a model from part files.
        0 // Each line starting with "1" adds one part. It states its color, position and orientation.
        0 // Each line reading "0 STEP" begins another step in building the model.
        0 // To watch these steps and look at the model, open this file in program LDView.
        0 // There, you can go forward and backward through the build steps of this file.
        0 // This file intentionally is kept as simple as possible.
        0 // LDRAW offers many more things. For more information, visit http://www.ldraw.org
        
        1 0 0 0 -90 1 0 0 0 1 0 0 0 1 4315.dat
        1 7 0 0 -60 1 0 0 0 1 0 0 0 1 4600.dat
        1 0 0 0 0 1 0 0 0 1 0 0 0 1 3031.dat
        1 7 0 0 60 1 0 0 0 1 0 0 0 1 4600.dat
        1 0 0 0 90 -1 0 0 0 1 0 0 0 -1 4315.dat
        
        0 STEP
        
        1 46 30 -8 -90 1 0 0 0 1 0 0 0 1 3024.dat
        1 46 -30 -8 -90 1 0 0 0 1 0 0 0 1 3024.dat
        1 4 0 -8 -60 0 0 1 0 1 0 -1 0 0 3020.dat
        1 4 30 -8 -10 0 0 1 0 1 0 -1 0 0 3623.dat
        1 4 -30 -8 -10 0 0 1 0 1 0 -1 0 0 3623.dat
        1 4 30 -8 30 1 0 0 0 1 0 0 0 1 3024.dat
        1 4 -30 -8 30 1 0 0 0 1 0 0 0 1 3024.dat
        1 4 0 -8 50 0 0 1 0 1 0 -1 0 0 3021.dat
        1 4 0 -8 90 1 0 0 0 1 0 0 0 1 3710.dat
        1 1 0 -8 0 1 0 0 0 1 0 0 0 1 4079.dat
        
        0 STEP
        
        1 46 30 -16 90 1 0 0 0 1 0 0 0 1 3024.dat
        1 46 -30 -16 90 1 0 0 0 1 0 0 0 1 3024.dat
        1 4 0 -16 -30 1 0 0 0 1 0 0 0 1 3829c01.dat
        
        0 STEP
        
        1 4 0 -24 -60 1 0 0 0 1 0 0 0 1 3788.dat
        1 4 0 -24 60 1 0 0 0 1 0 0 0 1 3788.dat
        1 36 30 -24 90 1 0 0 0 1 0 0 0 1 3024.dat
        1 36 -30 -24 90 1 0 0 0 1 0 0 0 1 3024.dat
        
        0 STEP
        
        1 7 0 -32 -90 1 0 0 0 1 0 0 0 1 3937.dat
        1 7 0 -32 -90 1 0 0 0 1 0 0 0 1 3938.dat
        1 4 30 -32 -90 1 0 0 0 1 0 0 0 1 4070.dat
        1 4 -30 -32 -90 1 0 0 0 1 0 0 0 1 4070.dat
        1 46 30 -22 -104 1 0 0 0 0 -1 0 1 0 6141.dat
        1 46 -30 -22 -104 1 0 0 0 0 -1 0 1 0 6141.dat
        1 4 30 -32 -60 0 0 1 0 1 0 -1 0 0 3023.dat
        1 4 -30 -32 -60 0 0 1 0 1 0 -1 0 0 3023.dat
        1 4 30 -32 -30 1 0 0 0 1 0 0 0 1 3822.dat
        1 4 -30 -32 -30 1 0 0 0 1 0 0 0 1 3821.dat
        1 4 30 -32 30 1 0 0 0 1 0 0 0 1 3005.dat
        1 4 -30 -32 30 1 0 0 0 1 0 0 0 1 3005.dat
        1 4 30 -32 70 0 0 1 0 1 0 -1 0 0 3623.dat
        1 4 -30 -32 70 0 0 1 0 1 0 -1 0 0 3623.dat
        1 4 0 -32 90 1 0 0 0 1 0 0 0 1 3004.dat
        
        0 STEP
        
        1 4 0 -40 -80 1 0 0 0 1 0 0 0 1 3068b.dat
        1 4 30 -40 -80 0 0 1 0 1 0 -1 0 0 3023.dat
        1 4 -30 -40 -80 0 0 1 0 1 0 -1 0 0 3023.dat
        1 4 0 -40 -50 1 0 0 0 1 0 0 0 1 3004.dat
        1 4 30 -40 -40 0 0 1 0 1 0 -1 0 0 3023.dat
        1 4 -30 -40 -40 0 0 1 0 1 0 -1 0 0 3023.dat
        1 0 30 -40 40 0 0 1 0 1 0 -1 0 0 3023.dat
        1 0 -30 -40 40 0 0 1 0 1 0 -1 0 0 3023.dat
        1 0 30 -40 70 1 0 0 0 1 0 0 0 1 3024.dat
        1 0 -30 -40 70 1 0 0 0 1 0 0 0 1 3024.dat
        1 0 0 -40 90 1 0 0 0 1 0 0 0 1 3710.dat
        
        0 STEP
        
        1 39 0 -88 -30 1 0 0 0 1 0 0 0 1 3823.dat
        1 0 0 -88 30 1 0 0 0 1 0 0 0 1 4214.dat
        1 39 0 -88 70 -1 0 0 0 1 0 0 0 -1 3823.dat
        
        0 STEP
        
        1 0 0 -96 0 1 0 0 0 1 0 0 0 1 4213.dat
        1 0 0 -96 60 1 0 0 0 1 0 0 0 1 3020.dat
        1 7 -30 6 60 0 0 1 0 1 0 -1 0 0 4624.dat
        1 7 30 6 60 0 0 -1 0 1 0 1 0 0 4624.dat
        1 7 -30 6 -60 0 0 1 0 1 0 -1 0 0 4624.dat
        1 7 30 6 -60 0 0 -1 0 1 0 1 0 0 4624.dat
        1 0 -30 6 60 0 0 1 0 1 0 -1 0 0 3641.dat
        1 0 30 6 60 0 0 -1 0 1 0 1 0 0 3641.dat
        1 0 -30 6 -60 0 0 1 0 1 0 -1 0 0 3641.dat
        1 0 30 6 -60 0 0 -1 0 1 0 1 0 0 3641.dat
        
        0 STEP`;
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
    await this.model.loadLines();
    this.scene.add(this.model.modelGroup);
    if (this.modelPane) {
      this.modelPane.scene = this.scene;
      this.modelPane.render();
    }
  }
}
