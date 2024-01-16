import carBluePng from '../assets/car-blue.png';
import carRedPng from '../assets/car-red.png';
import carGreenPng from '../assets/car-green.png';
import carYellowPng from '../assets/car-yellow.png';
import handPng from '../assets/hand.png';
import parkingLinePng from '../assets/parking-line.png';
import parkingMarkRedPng from '../assets/parking-mark-red.png';
import parkingMarkYellowPng from '../assets/parking-mark-yellow.png';
import gameLogoPng from '../assets/game-logo.png';
import playNowPng from '../assets/play-now.png';
import failPng from '../assets/fail.png';

import { type AssetOptions } from '../types/assets';

/** Ресурсы и их относительные позиции на сцене */
const STATIC_ASSETS: Record<string, AssetOptions> = {
  carGreen: {
    source: carGreenPng,
    x: 0.195,
    y: 0.21,
    sprite: null,
  },
  carBlue: {
    source: carBluePng,
    x: 0.795,
    y: 0.21,
    sprite: null,
  },
  carRed: {
    source: carRedPng,
    x: 0.295,
    y: 0.555,
    sprite: null,
  },
  carYellow: {
    source: carYellowPng,
    x: 0.7,
    y: 0.555,
    sprite: null,
  },
  hand: {
    source: handPng,
    x: 0.475,
    y: 0.525,
    sprite: null,
  },
  parkingLine1: {
    source: parkingLinePng,
    x: 0.905,
    y: 0.025,
    sprite: null,
  },
  parkingLine2: {
    source: parkingLinePng,
    x: 0.702,
    y: 0.025,
    sprite: null,
  },
  parkingLine3: {
    source: parkingLinePng,
    x: 0.499,
    y: 0.025,
    sprite: null,
  },
  parkingLine4: {
    source: parkingLinePng,
    x: 0.293,
    y: 0.025,
    sprite: null,
  },
  parkingLine5: {
    source: parkingLinePng,
    x: 0.09,
    y: 0.025,
    sprite: null,
  },

  parkingMarkYellow: {
    source: parkingMarkYellowPng,
    x: 0.394,
    y: 0.183,
    sprite: null,
  },
  parkingMarkRed: {
    source: parkingMarkRedPng,
    x: 0.609,
    y: 0.183,
    sprite: null,
  },
  gameLogo: {
    source: gameLogoPng,
    x: 2,
    y: 2,
    sprite: null,
  },
  playNow: {
    source: playNowPng,
    x: 2,
    y: 2,
    sprite: null,
  },
  fail: {
    source: failPng,
    x: 2,
    y: 2,
    sprite: null,
  },
};

export { STATIC_ASSETS };
