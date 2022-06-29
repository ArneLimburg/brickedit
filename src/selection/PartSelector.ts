import {
  Color,
  Group,
  Material,
  Mesh,
  Plane,
  Raycaster,
  Vector2,
  Vector3,
} from 'three';
import { ModelLine } from '../model/ModelLine.js';
import { ModelPane } from '../ModelPane.js';

export class PartSelector {
  readonly modelPane: ModelPane;

  selectionColor = new Color(0x0000ff);

  selection?: Mesh;

  distanceOfSelectionFromCamera?: number;

  movementStart?: Vector3;

  originalMaterialOfSelection?: Material | Material[];

  originalColorOfSelection?: Color;

  readonly selectionListener = (event: MouseEvent) =>
    this.updateSelection(event);

  readonly moveListener = (event: MouseEvent) => this.moveSelection(event);

  readonly moveFinishedListener = (event: MouseEvent) =>
    this.selectionMoved(event);

  constructor(modelPane: ModelPane) {
    this.modelPane = modelPane;
  }

  register(canvas: HTMLCanvasElement) {
    canvas.addEventListener('mousedown', this.selectionListener);
  }

  reregister(canvas: HTMLCanvasElement) {
    this.unregister(canvas);
    this.register(canvas);
  }

  unregister(canvas: HTMLCanvasElement) {
    canvas.removeEventListener('mousedown', this.selectionListener);
    canvas.removeEventListener('mousemove', this.moveListener);
  }

  updateSelection(mouseEvent: MouseEvent) {
    mouseEvent.target?.addEventListener('mousemove', this.moveListener as any);
    mouseEvent.target?.addEventListener(
      'mouseup',
      this.moveFinishedListener as any
    );
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
      this.distanceOfSelectionFromCamera = selectedObject.distance;
      this.movementStart = new Vector3();
      this.selection?.getWorldPosition(this.movementStart);

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
    if (this.modelPane.model) {
      const parent = this.selection?.parent as Group;
      this.selected(parent);
    }
    this.modelPane.render();
  }

  moveSelection(mouseEvent: MouseEvent) {
    if (this.distanceOfSelectionFromCamera && this.movementStart) {
      const plane = new Plane(new Vector3(0, 1, 0), 0);
      const clickLocation = new Vector2();
      clickLocation.x = (mouseEvent.clientX / window.innerWidth) * 2 - 1;
      clickLocation.y = -(mouseEvent.clientY / window.innerHeight) * 2 + 1;
      const raycaster = new Raycaster();
      raycaster.setFromCamera(clickLocation, this.modelPane.camera);
      const intersection = new Vector3();
      raycaster.ray.intersectPlane(plane, intersection);
      this.selection?.position.set(
        intersection.x,
        intersection.y,
        intersection.z
      );

      this.modelPane.render();
    }
  }

  selectionMoved(mouseEvent: MouseEvent) {
    mouseEvent.target?.removeEventListener(
      'mousemove',
      this.moveListener as any
    );
  }

  async selected(group?: Group) {
    if (this.modelPane.model && group) {
      const line = await this.modelPane.model.findLine(group);
      if (line) {
        this.modelPane.dispatchEvent(
          new CustomEvent<ModelLine>('partselected', { detail: line })
        );
      }
    } else {
      this.modelPane.dispatchEvent(
        new CustomEvent<ModelLine>('partdeselected')
      );
    }
  }
}
