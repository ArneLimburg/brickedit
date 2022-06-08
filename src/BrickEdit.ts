/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import { AmbientLight, Group, PointLight, Scene } from 'three';
import { LDrawLoader } from './loaders/LDrawLoader.js';
import { ModelPane } from './ModelPane.js';
// import { OrbitControls } from './controls/OrbitControls.js';

export class BrickEdit extends HTMLElement {
  scene: Scene;

  modelPane: ModelPane;

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

#c {
	width: 100%;
	height: 100%;
	display: block;
	border:0px solid red;
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
  }

  connectedCallback() {
    this.init();
  }

  // eslint-disable-next-line class-methods-use-this
  init() {
    const ldrawPath = 'models/ldraw/officialLibrary/';

    var model: Group;
    const lDrawLoader = new LDrawLoader();
    const { scene, modelPane } = this;
    lDrawLoader.setPath(ldrawPath).load(
      'models/car.ldr_Packed.mpd',
      (group: Group) => {
        if (model) {
          scene.remove(model);
        }

        model = group;

        // Convert from LDraw coordinates: rotate 180 degrees around OX
        model.rotation.x = Math.PI;

        scene.add(model);

        // Adjust camera and light

        // var bbox = new Box3().setFromObject(model);
        // var size = bbox.getSize(new Vector3());
        // var radius = Math.max(size.x, Math.max(size.y, size.z)) * 0.5;

        // this.pointLight.position.normalize().multiplyScalar(radius * 3);
        modelPane.scene = scene;
        modelPane.render();
      },
      () => {},
      () => {}
    );
  }
}
