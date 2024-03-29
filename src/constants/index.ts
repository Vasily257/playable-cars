import type * as PIXI from 'pixi.js';
import {
  type AssetName,
  type LineName,
  type AssetOption,
  type LineOption,
} from '../types';

import carBluePng from '../assets/car-blue.png';
import carRedPng from '../assets/car-red.png';
import carGreenPng from '../assets/car-green.png';
import carYellowPng from '../assets/car-yellow.png';
import handPng from '../assets/hand.png';
import parkingLinePng from '../assets/parking-line.png';
import parkingRedPng from '../assets/parking-mark-red.png';
import parkingYellowPng from '../assets/parking-mark-yellow.png';
import gameLogoPng from '../assets/game-logo.png';
import playNowPng from '../assets/play-now.png';
import failPng from '../assets/fail.png';

/** Координата для центрирования начала спрайта */
const CENTERED_SPRITE_COOR = 0.5;

/** Настройки анимации */
const ANIMATION = {
  hand: {
    duration: {
      movement: 1250,
      hiding: 300,
    },
  },
  car: {
    duration: 2000,
  },
};

/** Конфигурация PIXI-приложения */
const PIXI_CONFIG: Partial<PIXI.IApplicationOptions> = {
  background: '#545454',
  resizeTo: window,
  eventMode: 'passive',
  eventFeatures: {
    move: true,
    globalMove: false,
    click: true,
    wheel: true,
  },
};

/** Начальные позиции ресурсов и их источники */
const ASSETS_OPTIONS: Record<AssetName, AssetOption> = {
  greenCar: {
    x: 0.195,
    y: 0.21,
    z: 2,
    source: carGreenPng,
  },
  blueCar: {
    x: 0.795,
    y: 0.21,
    z: 2,
    source: carBluePng,
  },
  redCar: {
    x: 0.295,
    y: 0.555,
    z: 2,
    source: carRedPng,
  },
  yellowCar: {
    x: 0.7,
    y: 0.555,
    z: 2,
    source: carYellowPng,
  },
  hand: {
    x: 0.295,
    y: 0.555,
    z: 3,
    source: handPng,
  },
  parkingLine1: {
    x: 0.905,
    y: 0.025,
    z: 1,
    source: parkingLinePng,
  },
  parkingLine2: {
    x: 0.702,
    y: 0.025,
    z: 1,
    source: parkingLinePng,
  },
  parkingLine3: {
    x: 0.499,
    y: 0.025,
    z: 1,
    source: parkingLinePng,
  },
  parkingLine4: {
    x: 0.293,
    y: 0.025,
    z: 1,
    source: parkingLinePng,
  },
  parkingLine5: {
    x: 0.09,
    y: 0.025,
    z: 1,
    source: parkingLinePng,
  },
  yellowParking: {
    x: 0.393,
    y: 0.197,
    z: 1,
    source: parkingYellowPng,
  },
  redParking: {
    x: 0.609,
    y: 0.197,
    z: 1,
    source: parkingRedPng,
  },
  gameLogo: {
    x: 2,
    y: 2,
    z: 4,
    source: gameLogoPng,
  },
  playNow: {
    x: 2,
    y: 2,
    z: 4,
    source: playNowPng,
  },
  fail: {
    x: 2,
    y: 2,
    z: 4,
    source: failPng,
  },
};

/** Размер и цвет линий */
const LINE_OPTIONS: Record<LineName, LineOption> = {
  red: {
    size: 10,
    hexColor: 'D1191F',
    z: 2,
  },
  yellow: {
    size: 10,
    hexColor: 'FFC841',
    z: 2,
  },
};

export {
  CENTERED_SPRITE_COOR,
  ANIMATION,
  PIXI_CONFIG,
  ASSETS_OPTIONS,
  LINE_OPTIONS,
};
