import {
  Camera,
  MOUSE,
  OrthographicCamera,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import { CameraDirection } from './CameraDirection.js';
import { CameraSwitch } from './CameraSwitch.js';
import { OrbitControls } from '../controller/OrbitController.js';
import { Model } from '../model/Model.js';
import { PartSelectionController } from '../controller/PartSelectionController.js';

export class ModelPane extends HTMLElement {
  static readonly cameraPositions: {
    [key: string]: Vector3;
  } = {
    FRONT: new Vector3(0, 0, 500),
    RIGHT: new Vector3(500, 0, 0),
    TOP: new Vector3(0, 500, 0),
    LEFT: new Vector3(-500, 0, 0),
    BOTTOM: new Vector3(0, -500, 0),
    BACK: new Vector3(0, 0, -500),
    _3D: new Vector3(289, 289, 289),
  };

  canvas: HTMLCanvasElement;

  renderer: WebGLRenderer;

  _model?: Model;

  _scene: Scene;

  camera: Camera;

  cameraDirection = CameraDirection.FRONT;

  controls: OrbitControls;

  partSelector: PartSelectionController;

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = `
<style>
:host {
	display: block;
  position: relative;
	margin: 0;
	height: 100%;
}
div {
  position: absolute;
  display: flex;
  flex-direction: row;
}
</style>
<div>
  <button id="switch" is="camera-switch"></button>
</div>
<canvas id="canvas"></canvas>`;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot?.appendChild(template.content.cloneNode(true));

    this.canvas = this.shadowRoot?.querySelector(
      '#canvas'
    ) as HTMLCanvasElement;
    this._scene = new Scene();

    this.renderer = new WebGLRenderer({ canvas: this.canvas });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.partSelector = new PartSelectionController(this);
    this.partSelector.register(this.canvas);

    this.camera = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    this.controls = new OrbitControls(this.camera, this.canvas);

    //    const pane = this;
    const switchButton = this.shadowRoot?.querySelector(
      '#switch'
    ) as CameraSwitch;
    switchButton.addEventListener('cameradirectionchanged', ((
      event: CustomEvent<CameraDirection>
    ) => {
      this.transformCamera(
        event.detail,
        ModelPane.cameraPositions[event.detail]
      );
      // eslint-disable-next-line no-undef
    }) as EventListener);
  }

  connectedCallback() {
    this.transformCamera(
      CameraDirection._3D,
      ModelPane.cameraPositions[CameraDirection._3D]
    );
    this.render();
  }

  set scene(scene: Scene) {
    this._scene = scene;
    this.render();
  }

  set model(model: Model) {
    this._model = model;
    this.render();
  }

  render() {
    requestAnimationFrame(() => this.render());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  transformCamera(cameraDirection: CameraDirection, position: Vector3) {
    if (cameraDirection === CameraDirection._3D) {
      this.activate3D();
    } else {
      this.deactivate3D();
    }
    this.camera.position.set(position.x, position.y, position.z);
    this.camera.lookAt(this.scene.position);
    this.cameraDirection = cameraDirection;
    this.controls.update();
    this.partSelector.reregister(this.canvas);
    this.render();
  }

  activate3D() {
    this.camera = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableRotate = true;
    this.controls.enablePan = false;
    this.controls.mouseButtons = {
      LEFT: MOUSE.PAN,
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.ROTATE,
    };
  }

  deactivate3D() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera = new OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      -1000000,
      1000000
    );
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableRotate = false;
    this.controls.enablePan = true;
    this.controls.mouseButtons = {
      LEFT: MOUSE.ROTATE,
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.PAN,
    };
  }
}
