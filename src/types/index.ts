import type * as PIXI from 'pixi.js';
import type * as TWEEN from '@tweenjs/tween.js';

/** 2D-координаты */
export interface Coors {
  x: number;
  y: number;
}

/** Название ресурса */
export type AssetName =
  | 'greenCar'
  | 'blueCar'
  | 'redCar'
  | 'yellowCar'
  | 'hand'
  | 'parkingLine1'
  | 'parkingLine2'
  | 'parkingLine3'
  | 'parkingLine4'
  | 'parkingLine5'
  | 'yellowParking'
  | 'redParking'
  | 'gameLogo'
  | 'playNow'
  | 'fail';

/** Опции ресурса */
export type AssetOption = Coors & { z: number; source: string };

/** Линия */
export interface LineOption {
  size: number;
  hexColor: string;
  z: number;
}

/** Названия линий */
export type LineName = 'red' | 'yellow';

/** График */
export interface GraphicOption {
  pixi: PIXI.Graphics;
  isDrawing: boolean;
  isFinished: boolean;
  points: PIXI.Point[];
}

/** Спрайты машин и парковочных мест, индексированные по названию линии */
export type CarAndParkingSprites = Record<
  LineName,
  { car: PIXI.Sprite; parking: PIXI.Sprite }
>;

/** Твин, принимающий x и y координаты */
export type FlatTween = TWEEN.Tween<Coors>;
