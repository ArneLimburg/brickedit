import { ModelFileController } from './controller/ModelFileController.js';
import { ModelPane } from './ModelPane.js';

export class BrickEdit extends HTMLElement {
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

  connectedCallback() {
    this.modelFileController.init();
  }
}
