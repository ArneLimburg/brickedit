import {
  Camera,
  MOUSE,
  OrthographicCamera,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { CameraDirection } from './CameraDirection.js';
import { OrbitControls } from './controls/OrbitControls.js';
import { Model } from './model/Model.js';
import { PartSelector } from './selection/PartSelector.js';

export class ModelPane extends HTMLElement {
  canvas: HTMLCanvasElement;

  renderer: WebGLRenderer;

  model?: Model;

  scene: Scene;

  camera: Camera;

  cameraDirection = CameraDirection.FRONT;

  controls: OrbitControls;

  partSelector: PartSelector;

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
button {
  margin-left: 18px;
  margin-right: 18px;
  margin-top: 36px;
  width: 60px;
  height: 60px;
}
button#from-left {
  background: url("./files/from-left.svg");
  border: none;
}
button#from-right {
  background: url("./files/from-right.svg");
  border: none;
}
button#from-top {
  background: url("./files/from-top.svg");
  border: none;
}
button#from-bottom {
  background: url("./files/from-bottom.svg");
  border: none;
}
button#from-front {
  background: url("./files/from-front.svg");
  border: none;
}
button#from-back {
  background: url("./files/from-back.svg");
  border: none;
}
button#in-3d {
  background: url("./files/cube.svg");
  border: none;
}
</style>
<div>
  <button id="from-left"></button>
  <button id="from-right"></button>
  <button id="from-top"></button>
  <button id="from-bottom"></button>
  <button id="from-front"></button>
  <button id="from-back"></button>
  <button id="in-3d"></button>
</div>
<canvas id="canvas"></canvas>`;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot?.appendChild(template.content.cloneNode(true));

    this.canvas = this.shadowRoot?.querySelector(
      '#canvas'
    ) as HTMLCanvasElement;
    this.scene = new Scene();

    this.renderer = new WebGLRenderer({ canvas: this.canvas });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.partSelector = new PartSelector(this);
    this.partSelector.register(this.canvas);

    this.camera = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.viewIn3D();

    const pane = this;
    const leftButton = this.shadowRoot?.querySelector(
      '#from-left'
    ) as HTMLButtonElement;
    leftButton.onclick = () => pane.viewFromLeft();
    const rightButton = this.shadowRoot?.querySelector(
      '#from-right'
    ) as HTMLButtonElement;
    rightButton.onclick = () => pane.viewFromRight();
    const topButton = this.shadowRoot?.querySelector(
      '#from-top'
    ) as HTMLButtonElement;
    topButton.onclick = () => pane.viewFromTop();
    const bottomButton = this.shadowRoot?.querySelector(
      '#from-bottom'
    ) as HTMLButtonElement;
    bottomButton.onclick = () => pane.viewFromBottom();
    const frontButton = this.shadowRoot?.querySelector(
      '#from-front'
    ) as HTMLButtonElement;
    frontButton.onclick = () => pane.viewFromFront();
    const backButton = this.shadowRoot?.querySelector(
      '#from-back'
    ) as HTMLButtonElement;
    backButton.onclick = () => pane.viewFromBack();
    const threeDButton = this.shadowRoot?.querySelector(
      '#in-3d'
    ) as HTMLButtonElement;
    threeDButton.onclick = () => pane.viewIn3D();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    requestAnimationFrame(() => this.render());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  viewFromLeft() {
    this.transformCamera(CameraDirection.LEFT, 500, 0, 0);
  }

  viewFromRight() {
    this.transformCamera(CameraDirection.RIGHT, -500, 0, 0);
  }

  viewFromTop() {
    this.transformCamera(CameraDirection.TOP, 0, 500, 0);
  }

  viewFromBottom() {
    this.transformCamera(CameraDirection.BOTTOM, 0, -500, 0);
  }

  viewFromFront() {
    this.transformCamera(CameraDirection.FRONT, 0, 0, 500);
  }

  viewFromBack() {
    this.transformCamera(CameraDirection.BACK, 0, 0, -500);
  }

  viewIn3D() {
    this.transformCamera(CameraDirection._3D, 289, 289, 289);
  }

  transformCamera(
    cameraDirection: CameraDirection,
    x: number,
    y: number,
    z: number
  ) {
    if (cameraDirection === CameraDirection._3D) {
      this.activate3D();
    } else {
      this.deactivate3D();
    }
    this.camera.position.set(x, y, z);
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
