import { Color, Material, Mesh, Raycaster, Vector2 } from 'three';
import { ModelPane } from '../ModelPane.js';

export class PartSelector {
  readonly modelPane: ModelPane;

  selectionColor = new Color(0x0000ff);

  selection?: Mesh;

  originalMaterialOfSelection?: Material | Material[];

  originalColorOfSelection?: Color;

  readonly selectionListener = (event: MouseEvent) =>
    this.updateSelection(event);

  constructor(modelPane: ModelPane) {
    this.modelPane = modelPane;
  }

  register(canvas: HTMLCanvasElement) {
    canvas.addEventListener('click', this.selectionListener);
  }

  reregister(canvas: HTMLCanvasElement) {
    this.unregister(canvas);
    this.register(canvas);
  }

  unregister(canvas: HTMLCanvasElement) {
    canvas.removeEventListener('click', this.selectionListener);
  }

  updateSelection(mouseEvent: MouseEvent) {
    const clickLocation = new Vector2();
    clickLocation.x = (mouseEvent.clientX / window.innerWidth) * 2 - 1;
    clickLocation.y = -(mouseEvent.clientY / window.innerHeight) * 2 + 1;
    const raycaster = new Raycaster();
    raycaster.setFromCamera(clickLocation, this.modelPane.camera);
    const intersections = raycaster.intersectObjects(
      this.modelPane.scene.children
    );
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
    } else if (this.selection && this.originalMaterialOfSelection) {
      this.selection.material = this.originalMaterialOfSelection;
      this.selection = undefined;
    }
    this.modelPane.render();
  }
}
