// eslint-disable-next-line max-classes-per-file
import {
  BoxGeometry,
  Camera,
  Color,
  Material,
  Mesh,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from './controls/OrbitControls.js';

// eslint-disable-next-line no-shadow
enum CameraDirection {
  FRONT,
  BACK,
  LEFT,
  RIGHT,
  TOP,
  BOTTOM,
  _3D,
}

export class ModelPane extends HTMLElement {
  canvas: HTMLCanvasElement;

  renderer: WebGLRenderer;

  scene: Scene;

  camera: Camera;

  cameraDirection = CameraDirection.FRONT;

  controls: OrbitControls;

  selectedEventListener: (event: MouseEvent) => void;

  selectionColor = new Color(0x0000ff);

  selection?: Mesh;

  originalMaterialOfSelection?: Material | Material[];

  originalColorOfSelection?: Color;

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
    const modelPane = this;
    this.selectedEventListener = (event: MouseEvent) => {
      const mousePointer = new Vector2();
      mousePointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      modelPane.updateSelection(mousePointer);
      modelPane.render();
    };
    this.canvas.addEventListener('click', this.selectedEventListener);
    this.selection = new Mesh(new BoxGeometry(1, 1, 1));

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
    this.controls.update();
    this.canvas.removeEventListener('click', this.selectedEventListener);
    this.canvas.addEventListener('click', this.selectedEventListener);
    this.render();
  }

  viewFromRight() {
    this.camera.position.set(-500, 0, 0);
    this.camera.lookAt(this.scene.position);
    this.cameraDirection = CameraDirection.RIGHT;
    this.controls.enableRotate = false;
    this.controls.enablePan = true;
    this.controls.update();
    this.canvas.removeEventListener('click', this.selectedEventListener);
    this.canvas.addEventListener('click', this.selectedEventListener);
    this.render();
  }

  viewFromTop() {
    this.camera.position.set(0, 500, 0);
    this.camera.lookAt(this.scene.position);
    this.cameraDirection = CameraDirection.TOP;
    this.controls.enableRotate = false;
    this.controls.enablePan = true;
    this.controls.update();
    this.canvas.removeEventListener('click', this.selectedEventListener);
    this.canvas.addEventListener('click', this.selectedEventListener);
    this.render();
  }

  viewFromBottom() {
    this.camera.position.set(0, -500, 0);
    this.camera.lookAt(this.scene.position);
    this.cameraDirection = CameraDirection.BOTTOM;
    this.controls.enableRotate = false;
    this.controls.enablePan = true;
    this.controls.update();
    this.canvas.removeEventListener('click', this.selectedEventListener);
    this.canvas.addEventListener('click', this.selectedEventListener);
    this.render();
  }

  viewFromFront() {
    this.camera.position.set(0, 0, 500);
    this.camera.lookAt(this.scene.position);
    this.cameraDirection = CameraDirection.FRONT;
    this.controls.enableRotate = false;
    this.controls.enablePan = true;
    this.controls.update();
    this.canvas.removeEventListener('click', this.selectedEventListener);
    this.canvas.addEventListener('click', this.selectedEventListener);
    this.render();
  }

  viewFromBack() {
    this.camera.position.set(0, 0, -500);
    this.camera.lookAt(this.scene.position);
    this.cameraDirection = CameraDirection.BACK;
    this.controls.enableRotate = false;
    this.controls.enablePan = true;
    this.controls.update();
    this.canvas.removeEventListener('click', this.selectedEventListener);
    this.canvas.addEventListener('click', this.selectedEventListener);
    this.render();
  }

  viewIn3D() {
    this.camera.position.set(289, 289, 289);
    this.camera.lookAt(this.scene.position);
    this.cameraDirection = CameraDirection.BACK;
    this.controls.enableRotate = true;
    this.controls.enablePan = false;
    this.controls.update();
    this.canvas.removeEventListener('click', this.selectedEventListener);
    this.render();
  }

  updateSelection(clickLocation: Vector2) {
    const raycaster = new Raycaster();
    raycaster.setFromCamera(clickLocation, this.camera);
    const intersections = raycaster.intersectObjects(this.scene.children);
    if (intersections.length > 0) {
      let selectedObject = intersections[0];
      intersections.forEach(intersection => {
        if (intersection.distance < selectedObject.distance) {
          selectedObject = intersection;
        }
      });
      if (this.selection && this.originalMaterialOfSelection) {
        this.selection.material = this.originalMaterialOfSelection;
      }
      this.selection = selectedObject.object as Mesh;
      this.originalMaterialOfSelection = this.selection.material;
      if ((this.selection.material as Material).isMaterial) {
        const newMaterial = (
          this.selection.material as Material
        ).clone() as any;
        newMaterial.color = this.selectionColor;
        this.selection.material = newMaterial;
      } else {
        const materials = this.selection.material as Material[];
        const cloned = new Array(materials.length);
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < materials.length; i++) {
          cloned[i] = materials[i].clone();
          cloned[i].color = this.selectionColor;
        }
        this.selection.material = cloned;
      }
    }
  }
}
