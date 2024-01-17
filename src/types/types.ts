import type * as PIXI from 'pixi.js';

/** Ресурс */
export interface Asset {
  source: string;
  x: number;
  y: number;
  sprite: PIXI.Sprite | null;
}

/** Названия ресурсов */
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
  ParkingMarkYellow = 'parkingMarkYellow',
  ParkingMarkRed = 'parkingMarkRed',
  GameLogo = 'gameLogo',
  PlayNow = 'playNow',
  Fail = 'fail',
}

/** Линия */
export interface Line {
  size: number;
  hexColor: string;
  isDrawn: boolean;
  points: PIXI.Point[];
  graphics: PIXI.Graphics | null;
}

/** Названия линий */
export enum LineName {
  Red = 'red',
  Yellow = 'yellow',
}
