import {
  Color,
  Group,
  Material,
  Matrix4,
  Mesh,
  Plane,
  Raycaster,
  Vector2,
  Vector3,
} from 'three';
import { getDirectionVector } from '../CameraDirection.js';
import { ModelLine } from '../model/ModelLine.js';
import { ModelPane } from '../ModelPane.js';
import { PartTransformation } from '../PartTransformation.js';

interface PointerLocation {
  readonly clientX: number;
  readonly clientY: number;
}

export class PartSelector {
  readonly modelPane: ModelPane;

  selectionColor = new Color(0x0000ff);

  selection?: Mesh;

  distanceOfSelectionFromCamera?: number;

  movementStart?: Vector3;

  originalMaterialOfSelection?: Material | Material[];

  originalColorOfSelection?: Color;

  readonly selectionListener = (event: MouseEvent | TouchEvent) =>
    this.updateSelection(event);

  readonly moveListener = (event: MouseEvent | TouchEvent) =>
    this.moveSelection(event);

  readonly moveFinishedListener = (event: MouseEvent | TouchEvent) =>
    this.selectionMoved(event);

  constructor(modelPane: ModelPane) {
    this.modelPane = modelPane;
  }

  register(canvas: HTMLCanvasElement) {
    canvas.addEventListener('mousedown', this.selectionListener);
    canvas.addEventListener('touchstart', this.selectionListener);
  }

  reregister(canvas: HTMLCanvasElement) {
    this.unregister(canvas);
    this.register(canvas);
  }

  unregister(canvas: HTMLCanvasElement) {
    canvas.removeEventListener('mousedown', this.selectionListener);
    canvas.removeEventListener('touchstart', this.selectionListener);
    canvas.removeEventListener('mousemove', this.moveListener);
    canvas.removeEventListener('touchmove', this.moveListener);
    canvas.removeEventListener('mouseup', this.moveFinishedListener);
    canvas.removeEventListener('touchend', this.moveFinishedListener);
  }

  updateSelection(mouseEvent: MouseEvent | TouchEvent) {
    mouseEvent.target?.addEventListener('mousemove', this.moveListener as any);
    mouseEvent.target?.addEventListener('touchmove', this.moveListener as any);
    mouseEvent.target?.addEventListener(
      'mouseup',
      this.moveFinishedListener as any
    );
    mouseEvent.target?.addEventListener(
      'touchend',
      this.moveFinishedListener as any
    );
    const pointerLocation = PartSelector.getPointerLocation(mouseEvent);
    const clickLocation = new Vector2();
    clickLocation.x = (pointerLocation.clientX / window.innerWidth) * 2 - 1;
    clickLocation.y = -(pointerLocation.clientY / window.innerHeight) * 2 + 1;
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

  moveSelection(mouseEvent: MouseEvent | TouchEvent) {
    if (this.distanceOfSelectionFromCamera && this.movementStart) {
      const directionVector = getDirectionVector(
        this.modelPane.cameraDirection
      );
      const plane = new Plane(directionVector, 0);
      const pointerLocation = PartSelector.getPointerLocation(mouseEvent);
      const clickLocation = new Vector2();
      clickLocation.x = (pointerLocation.clientX / window.innerWidth) * 2 - 1;
      clickLocation.y = -(pointerLocation.clientY / window.innerHeight) * 2 + 1;
      const raycaster = new Raycaster();
      raycaster.setFromCamera(clickLocation, this.modelPane.camera);
      const intersection = new Vector3();
      raycaster.ray.intersectPlane(plane, intersection);

      // rotate to coordinate system
      intersection.applyAxisAngle(new Vector3(1, 0, 0), Math.PI);

      this.selection?.position.set(
        intersection.x,
        intersection.y,
        intersection.z
      );

      this.modelPane.render();
    }
  }

  private static getPointerLocation(
    event: MouseEvent | TouchEvent
  ): PointerLocation {
    if (event.type === 'MouseEvent') {
      return event as PointerLocation;
    }
    return (event as TouchEvent).touches.item(0) as PointerLocation;
  }

  selectionMoved(mouseEvent: MouseEvent | TouchEvent) {
    mouseEvent.target?.removeEventListener(
      'mousemove',
      this.moveListener as any
    );
    mouseEvent.target?.removeEventListener(
      'touchend',
      this.moveListener as any
    );
    if (this.selection) {
      this.moved(this.selection?.parent as Group);
    }
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

  async moved(group?: Group) {
    if (this.modelPane.model && group && this.movementStart) {
      const line = await this.modelPane.model.findLine(group);
      if (line) {
        const source = this.movementStart;
        const target = group.position;
        this.modelPane.dispatchEvent(
          new CustomEvent<PartTransformation>('partmoved', {
            detail: {
              line,
              matrix: new Matrix4().makeTranslation(
                target.x - source.x,
                target.y - source.y,
                target.z - source.z
              ),
            },
          })
        );
      }
    }
  }
}
