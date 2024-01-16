import { type Sprite } from 'pixi.js';

/** Опции ресурсов */
export interface AssetOptions {
  source: string;
  x: number;
  y: number;
  sprite: Sprite | null;
}
