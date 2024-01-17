import type * as PIXI from 'pixi.js';

/** Опции ресурсов */
export interface AssetOptions {
  source: string;
  x: number;
  y: number;
  sprite: PIXI.Sprite | null;
}

/** Опции ресурсов */
export interface Line {
  points: PIXI.Point[];
  isDrawn: boolean;
  graphics: PIXI.Graphics | null;
}
