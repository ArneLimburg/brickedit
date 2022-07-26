import { CameraDirection } from './CameraDirection.js';

export class CameraSwitch extends HTMLButtonElement {
  static readonly nextStates: {
    [key: string]: CameraDirection;
  } = {
    FRONT: CameraDirection.RIGHT,
    RIGHT: CameraDirection.TOP,
    TOP: CameraDirection.LEFT,
    LEFT: CameraDirection.BOTTOM,
    BOTTOM: CameraDirection.BACK,
    BACK: CameraDirection._3D,
    _3D: CameraDirection.FRONT,
  };

  static readonly imageUrls: {
    [key: string]: string;
  } = {
    FRONT: "url('./files/from-front.svg')",
    RIGHT: "url('./files/from-right.svg')",
    TOP: "url('./files/from-top.svg')",
    LEFT: "url('./files/from-left.svg')",
    BOTTOM: "url('./files/from-bottom.svg')",
    BACK: "url('./files/from-back.svg')",
    _3D: "url('./files/cube-3d.svg')",
  };

  state: CameraDirection = CameraDirection._3D;

  connectedCallback() {
    this.style.backgroundImage = CameraSwitch.imageUrls[this.state];
    this.style.backgroundColor = 'transparent';
    this.style.margin = '18px';
    this.style.width = '60px';
    this.style.height = '60px';
    this.style.border = 'none';
    this.addEventListener('click', this.onClick);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.onClick);
  }

  private onClick() {
    this.state = CameraSwitch.nextStates[this.state];
    this.style.backgroundImage = CameraSwitch.imageUrls[this.state];
    this.dispatchEvent(
      new CustomEvent<CameraDirection>('cameradirectionchanged', {
        detail: this.state,
      })
    );
  }
}
