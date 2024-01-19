import type * as PIXI from 'pixi.js';
import type * as TWEEN from '@tweenjs/tween.js';

/** 2D-координаты */
export interface Coors {
  x: number;
  y: number;
}

/** Название ресурса */
export enum AssetName {
  CarGreen = 'carGreen',
  CarBlue = 'carBlue',
  CarRed = 'carRed',
  CarYellow = 'carYellow',
  Hand = 'hand',
  ParkingLine1 = 'parkingLine1',
  ParkingLine2 = 'parkingLine2',
  ParkingLine3 = 'parkingLine3',
  ParkingLine4 = 'parkingLine4',
  ParkingLine5 = 'parkingLine5',
  ParkingYellow = 'parkingYellow',
  ParkingRed = 'parkingRed2',
  GameLogo = 'gameLogo',
  PlayNow = 'playNow',
  Fail = 'fail',
}

/** Опции ресурса */
export type AssetOption = Coors & { source: string };

/** Линия */
export interface LineOption {
  size: number;
  hexColor: string;
}

/** Названия линий */
export enum LineName {
  Red = 'red',
  Yellow = 'yellow',
}

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
