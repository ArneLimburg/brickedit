import { Scene } from 'three';
import { Model } from '../model/Model.js';

export interface ModelComponent {
  model: Model;
  scene: Scene;
}
