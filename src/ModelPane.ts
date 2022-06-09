import { Camera, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
// import { OrbitControls } from './controls/OrbitControls.js';

export class ModelPane extends HTMLElement {
  canvas: HTMLCanvasElement;

  renderer: WebGLRenderer;

  scene: Scene;

  camera: Camera;

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
}
button {
  margin-left: 18px;
  margin-right: 18px;
  margin-top: 36px;
  width: 60px;
  height: 60px;
}
</style>
<div>
<button id="from-left">From left</button>
<button id="from-right">From right</button>
<button id="from-top">From top</button>
<button id="from-bottom">From bottom</button>
<button id="from-front">From front</button>
<button id="from-back">From back</button>
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
    this.camera.position.set(0, 500, 0);
    // this.camera.rotateY( Math.PI /2 );
    this.camera.lookAt(this.scene.position);

    this.renderer = new WebGLRenderer({ canvas: this.canvas });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

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
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  viewFromLeft() {
    this.camera.position.set(500, 0, 0);
    this.camera.lookAt(this.scene.position);
    this.render();
  }

  viewFromRight() {
    this.camera.position.set(-500, 0, 0);
    this.camera.lookAt(this.scene.position);
    this.render();
  }

  viewFromTop() {
    this.camera.position.set(0, 500, 0);
    this.camera.lookAt(this.scene.position);
    this.render();
  }

  viewFromBottom() {
    this.camera.position.set(0, -500, 0);
    this.camera.lookAt(this.scene.position);
    this.render();
  }

  viewFromFront() {
    this.camera.position.set(0, 0, 500);
    this.camera.lookAt(this.scene.position);
    this.render();
  }

  viewFromBack() {
    this.camera.position.set(0, 0, -500);
    this.camera.lookAt(this.scene.position);
    this.render();
  }
}
