import { Camera, MOUSE, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
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
button#in-3d {
  background: url("./files/cube.svg");
  border: none;
}
</style>
<div>
  <button id="from-left">From left</button>
  <button id="from-right">From right</button>
  <button id="from-top">From top</button>
  <button id="from-bottom">From bottom</button>
  <button id="from-front">From front</button>
  <button id="from-back">From back</button>
  <button id="in-3d">3D</button>
</div>
<canvas id="canvas"></canvas>`;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot?.appendChild(template.content.cloneNode(true));

    this.canvas = this.shadowRoot?.querySelector(
      '#canvas'
    ) as HTMLCanvasElement;
    this.scene = new Scene();

    this.camera = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    this.camera.position.set(0, 0, 500);
    this.camera.lookAt(this.scene.position);

    this.renderer = new WebGLRenderer({ canvas: this.canvas });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableRotate = false;
    this.controls.enablePan = true;
    this.partSelector = new PartSelector(this);
    this.partSelector.register(this.canvas);

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
    this.camera.position.set(500, 0, 0);
    this.camera.lookAt(this.scene.position);
    this.cameraDirection = CameraDirection.LEFT;
    this.controls.enableRotate = false;
    this.controls.enablePan = true;
    this.controls.mouseButtons = {
      LEFT: MOUSE.ROTATE,
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.PAN,
    };
    this.controls.update();
    this.partSelector.reregister(this.canvas);
    this.render();
  }

  viewFromRight() {
    this.camera.position.set(-500, 0, 0);
    this.camera.lookAt(this.scene.position);
    this.cameraDirection = CameraDirection.RIGHT;
    this.controls.enableRotate = false;
    this.controls.enablePan = true;
    this.controls.mouseButtons = {
      LEFT: MOUSE.ROTATE,
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.PAN,
    };
    this.controls.update();
    this.partSelector.reregister(this.canvas);
    this.render();
  }

  viewFromTop() {
    this.camera.position.set(0, 500, 0);
    this.camera.lookAt(this.scene.position);
    this.cameraDirection = CameraDirection.TOP;
    this.controls.enableRotate = false;
    this.controls.enablePan = true;
    this.controls.mouseButtons = {
      LEFT: MOUSE.ROTATE,
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.PAN,
    };
    this.controls.update();
    this.partSelector.reregister(this.canvas);
    this.render();
  }

  viewFromBottom() {
    this.camera.position.set(0, -500, 0);
    this.camera.lookAt(this.scene.position);
    this.cameraDirection = CameraDirection.BOTTOM;
    this.controls.enableRotate = false;
    this.controls.enablePan = true;
    this.controls.mouseButtons = {
      LEFT: MOUSE.ROTATE,
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.PAN,
    };
    this.controls.update();
    this.partSelector.reregister(this.canvas);
    this.render();
  }

  viewFromFront() {
    this.camera.position.set(0, 0, 500);
    this.camera.lookAt(this.scene.position);
    this.cameraDirection = CameraDirection.FRONT;
    this.controls.enableRotate = false;
    this.controls.enablePan = true;
    this.controls.mouseButtons = {
      LEFT: MOUSE.ROTATE,
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.PAN,
    };
    this.controls.update();
    this.partSelector.reregister(this.canvas);
    this.render();
  }

  viewFromBack() {
    this.camera.position.set(0, 0, -500);
    this.camera.lookAt(this.scene.position);
    this.cameraDirection = CameraDirection.BACK;
    this.controls.enableRotate = false;
    this.controls.enablePan = true;
    this.controls.mouseButtons = {
      LEFT: MOUSE.ROTATE,
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.PAN,
    };
    this.controls.update();
    this.partSelector.reregister(this.canvas);
    this.render();
  }

  viewIn3D() {
    this.camera.position.set(289, 289, 289);
    this.camera.lookAt(this.scene.position);
    this.cameraDirection = CameraDirection.BACK;
    this.controls.enableRotate = true;
    this.controls.enablePan = false;
    this.controls.mouseButtons = {
      LEFT: MOUSE.PAN,
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.ROTATE,
    };
    this.controls.update();
    this.partSelector.unregister(this.canvas);
    this.render();
  }
}
