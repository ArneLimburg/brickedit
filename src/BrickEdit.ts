/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import {
  AmbientLight,
  Box3,
  BufferGeometry,
  Camera,
  Group,
  Material,
  Mesh,
  PerspectiveCamera,
  PointLight,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import { LDrawLoader } from './loaders/LDrawLoader.js';
// import { OrbitControls } from './controls/OrbitControls.js';

export class BrickEdit extends HTMLElement {
  host: HTMLElement | undefined;

  canvas: any;

  renderer: any;

  scene: any;

  camera: Camera | undefined;

  geometry: BufferGeometry | undefined;

  material: Material | undefined;

  cube: Mesh<BufferGeometry, Material> | undefined;

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
<canvas id="c"></canvas>`;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot?.appendChild(template.content.cloneNode(true));
    this.host = this.shadowRoot?.host as HTMLElement; // use of host might be unnecessary
    this.canvas = this.shadowRoot?.querySelector('#c');
  }

  connectedCallback() {
    // fires with constructor is done.
    this.init();
    this.renderer.render(this.scene, this.camera);
  }

  // eslint-disable-next-line class-methods-use-this
  init() {
    this.camera = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    this.camera.position.set(0, 0, 500);

    // scene

    this.scene = new Scene();

    const ambientLight = new AmbientLight(0xcccccc, 0.4);
    this.scene.add(ambientLight);

    const pointLight = new PointLight(0xffffff, 1);
    pointLight.position.set(-1000, 1200, 1500);
    this.scene.add(pointLight);

    //

    this.renderer = new WebGLRenderer({ canvas: this.canvas });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    //    const controls = new OrbitControls( this.camera, this.renderer.domElement );
    const ldrawPath = 'models/ldraw/officialLibrary/';

    var model: Group;
    const lDrawLoader = new LDrawLoader();
    const { camera, canvas, renderer, scene } = this;
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

        var bbox = new Box3().setFromObject(model);
        var size = bbox.getSize(new Vector3());
        var radius = Math.max(size.x, Math.max(size.y, size.z)) * 0.5;

        pointLight.position.normalize().multiplyScalar(radius * 3);
        renderer.render(scene, camera);
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        const { width, height } = canvas;
        renderer.setSize(width, height, false);
      },
      () => {},
      () => {}
    );
  }
}
