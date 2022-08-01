import { Scene } from 'three';
import { Model } from '../model/Model.js';
import { ModelFileController } from '../controller/ModelFileController.js';
import { ModelComponent } from './ModelComponent.js';
import { ModelPane } from './ModelPane.js';

export class BrickEdit extends HTMLElement implements ModelComponent {
  readonly modelFileController: ModelFileController;

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
.upload {
  background-image: url('./files/upload.svg');
}
.download {
  background-image: url('./files/download.svg');
}
</style>
<model-pane id="pane"></model-pane>
<floating-action>
  <a class="upload" target="_blank"></a>
  <a class="download" target="_blank"></a>
</floating-action>
`;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot?.appendChild(template.content.cloneNode(true));

    const modelPane = this.shadowRoot?.querySelector('#pane') as ModelPane;
    this.modelFileController = new ModelFileController(modelPane);
  }

  set model(model: Model) {
    this.getModelPanes().forEach((modelPane: ModelPane) => {
      // eslint-disable-next-line no-param-reassign
      modelPane.model = model;
    });
  }

  set scene(scene: Scene) {
    this.getModelPanes().forEach((modelPane: ModelPane) => {
      // eslint-disable-next-line no-param-reassign
      modelPane.scene = scene;
    });
  }

  connectedCallback() {
    this.modelFileController.init();
  }

  // eslint-disable-next-line no-undef
  getModelPanes(): NodeListOf<ModelPane> {
    return this.shadowRoot?.querySelectorAll(
      'ModelPane'
      // eslint-disable-next-line no-undef
    ) as NodeListOf<ModelPane>;
  }
}
