import { Vector3 } from 'three';

// eslint-disable-next-line no-shadow
export enum CameraDirection {
  FRONT,
  BACK,
  LEFT,
  RIGHT,
  TOP,
  BOTTOM,
  _3D,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getDirectionVector(direction: CameraDirection): Vector3 {
  switch (direction) {
    case CameraDirection.FRONT:
      return new Vector3(0, 0, -1);
    case CameraDirection.BACK:
      return new Vector3(0, 0, 1);
    case CameraDirection.LEFT:
      return new Vector3(-1, 0, 0);
    case CameraDirection.RIGHT:
      return new Vector3(1, 0, 0);
    case CameraDirection.TOP:
      return new Vector3(0, 1, 0);
    case CameraDirection.BOTTOM:
      return new Vector3(0, -1, 0);
    default:
      return new Vector3(0, 0, 0);
  }
}
