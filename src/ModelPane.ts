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

    this.renderer = new WebGLRenderer({ canvas: this.canvas });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
