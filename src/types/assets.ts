import type * as PIXI from 'pixi.js';

/** Опции ресурсов */
export interface Asset {
  source: string;
  x: number;
  y: number;
  sprite: PIXI.Sprite | null;
}

/** Названия ресурсов */
export type AssetName =
  | 'carGreen'
  | 'carBlue'
  | 'carRed'
  | 'carYellow'
  | 'hand'
  | 'parkingLine1'
  | 'parkingLine2'
  | 'parkingLine3'
  | 'parkingLine4'
  | 'parkingLine5'
  | 'parkingMarkYellow'
  | 'parkingMarkRed'
  | 'gameLogo'
  | 'gameLogo'
  | 'playNow'
  | 'fail';

/** Опции ресурсов */
export interface Line {
  points: PIXI.Point[];
  isDrawn: boolean;
  graphics: PIXI.Graphics | null;
}
