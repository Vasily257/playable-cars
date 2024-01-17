import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';

import carBluePng from './assets/car-blue.png';
import carRedPng from './assets/car-red.png';
import carGreenPng from './assets/car-green.png';
import carYellowPng from './assets/car-yellow.png';
import handPng from './assets/hand.png';
import parkingLinePng from './assets/parking-line.png';
import parkingMarkRedPng from './assets/parking-mark-red.png';
import parkingMarkYellowPng from './assets/parking-mark-yellow.png';
import gameLogoPng from './assets/game-logo.png';
import playNowPng from './assets/play-now.png';
import failPng from './assets/fail.png';

import type { Asset, AssetName, Line } from './types/assets.js';
import './styles/index.css';

/** Координаты якоря ресурсов */
const ASSETS_ANCHOR_COORS = 0.5;

/** Настройки анимации движения руки */
const HAND_MOVEMENT_ANIMATION = {
  offsetX: 0.005,
  offsetY: 0.15,
  duration: 1000,
};

/** Ресурсы, индексированные по названию */
const ixAssets: Record<AssetName, Asset> = {
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

/** Линии от машин к парковочным местам, индексированные по названию */
const ixGraphicLines: Record<string, Line> = {
  red: {
    isDrawn: false,
    points: [],
    graphics: null,
  },
  yellow: {
    isDrawn: false,
    points: [],
    graphics: null,
  },
};

/** Конфигурация PIXI-приложения */
const PIXIConfig: Partial<PIXI.IApplicationOptions> = {
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

/** PIXI-приложение */
const app = new PIXI.Application<HTMLCanvasElement>(PIXIConfig);

/** Добавить canvas в DOM */
const addAppToDOM = (): void => {
  document.body.appendChild(app.view);
};

/** Настроить ресурсы и добавить их на сцену */
const configurteAssetsAndAddThemToStage = (): void => {
  for (const [key, assetOptions] of Object.entries(ixAssets)) {
    /** Спрайт на основе ресурса */
    const sprite = PIXI.Sprite.from(assetOptions.source);

    // Задать начальное положение спрайта
    sprite.anchor.set(ASSETS_ANCHOR_COORS);
    sprite.x = app.screen.width * assetOptions.x;
    sprite.y = app.screen.height * assetOptions.y;

    // Добавить курсор-поинтер для интерактивных ресурсов
    if (key === 'carRed' || key === 'carYellow') {
      sprite.interactive = true;
      sprite.cursor = 'pointer';
    }

    // Добавить спрайт на сцену
    app.stage.addChild(sprite);

    // Сохранить ссылку на спрайт
    ixAssets[key as AssetName].sprite = sprite;
  }
};

/** Добавить пустые линии на сцену приложения */
const addLinesToStage = (): void => {
  for (const key of Object.keys(ixGraphicLines)) {
    const graphics = new PIXI.Graphics();
    ixGraphicLines[key].graphics = graphics;

    app.stage.addChild(graphics);
  }
};

/** Переместить указатель (руку) до цели (красной парковки) */
const moveHandToRedParking = (): void => {
  const parkingMarkRed = ixAssets.parkingMarkRed;

  const { offsetX, offsetY, duration } = HAND_MOVEMENT_ANIMATION;

  const endX = app.screen.width * (parkingMarkRed?.x + offsetX);
  const endY = app.screen.height * (parkingMarkRed?.y + offsetY);

  const handSprite = ixAssets.hand.sprite;

  if (handSprite !== null) {
    new TWEEN.Tween(handSprite)
      .to(
        {
          x: endX,
          y: endY,
        },
        duration,
      )
      .repeat(Infinity)
      .easing(TWEEN.Easing.Linear.None)
      .onComplete(() => {
        console.log('Анимация завершена!');
      })
      .start();
  }
};

/** Обработать нажатие кнопки мыши */
const handleMouseDown = (event: PIXI.FederatedMouseEvent): void => {
  const clickPoint = new PIXI.Point(event.pageX, event.pageY);

  const isRedCarClick = ixAssets.carRed.sprite?.containsPoint(clickPoint);
  const isYellowCarClick = ixAssets.carYellow.sprite?.containsPoint(clickPoint);

  if (isRedCarClick ?? false) {
    ixGraphicLines.red.isDrawn = true;
    ixGraphicLines.red.points.push(clickPoint);
  }

  if (isYellowCarClick ?? false) {
    ixGraphicLines.yellow.isDrawn = true;
    ixGraphicLines.yellow.points.push(clickPoint);
  }
};

/** Обработать перемещение курсора */
const handleMouseMove = (event: PIXI.FederatedMouseEvent): void => {
  if (ixGraphicLines.red.isDrawn) {
    const currentPosition = new PIXI.Point(event.pageX, event.pageY);

    ixGraphicLines.red.points.push(currentPosition);

    if (ixGraphicLines.red.graphics !== null) {
      ixGraphicLines.red.graphics.lineStyle(10, 'D1191F');

      for (let i = 1; i < ixGraphicLines.red.points.length; i++) {
        const startPoint = ixGraphicLines.red.points[i - 1];
        const endPoint = ixGraphicLines.red.points[i];

        ixGraphicLines.red.graphics.moveTo(startPoint.x, startPoint.y);
        ixGraphicLines.red.graphics.lineTo(endPoint.x, endPoint.y);
      }
    }
  }

  if (ixGraphicLines.yellow.isDrawn) {
    const currentPosition = new PIXI.Point(event.pageX, event.pageY);

    ixGraphicLines.yellow.points.push(currentPosition);

    if (ixGraphicLines.yellow.graphics !== null) {
      ixGraphicLines.yellow.graphics.lineStyle(10, 'FFC841');

      for (let i = 1; i < ixGraphicLines.yellow.points.length; i++) {
        const startPoint = ixGraphicLines.yellow.points[i - 1];
        const endPoint = ixGraphicLines.yellow.points[i];

        ixGraphicLines.yellow.graphics.moveTo(startPoint.x, startPoint.y);
        ixGraphicLines.yellow.graphics.lineTo(endPoint.x, endPoint.y);
      }
    }
  }
};

/** Обработать отпускание кнопки мыши */
const handleMouseUp = (): void => {
  ixGraphicLines.red.isDrawn = false;
  ixGraphicLines.yellow.isDrawn = false;

  if (ixGraphicLines.red.graphics !== null) {
    ixGraphicLines.red.graphics.clear();
    ixGraphicLines.red.points = [];
  }

  if (ixGraphicLines.yellow.graphics !== null) {
    ixGraphicLines.yellow.graphics.clear();
    ixGraphicLines.yellow.points = [];
  }
};

/** Изменить размер сцены */
const resizeApp = (): void => {
  // Задать новые размеры сцены
  app.renderer.resize(window.innerWidth, window.innerHeight);

  for (const [key, options] of Object.entries(ixAssets)) {
    const { x, y } = ixAssets[key as AssetName];

    // Сохранить позиции изображений
    if (options.sprite !== null) {
      options.sprite.x = app.screen.width * x;
      options.sprite.y = app.screen.height * y;
    }
  }
};

// Инициализировать приложение
addAppToDOM();
configurteAssetsAndAddThemToStage();
addLinesToStage();
moveHandToRedParking();

// Запустить анимацию
app.ticker.add(() => {
  TWEEN.update();
});

// Добавляем обработчики событий мыши на канвас
app.view.addEventListener(
  'mousedown',
  handleMouseDown as (event: MouseEvent) => void,
);
app.view.addEventListener(
  'mousemove',
  handleMouseMove as (event: MouseEvent) => void,
);
app.view.addEventListener(
  'mouseup',
  handleMouseUp as (event: MouseEvent) => void,
);

/** Обработать изменение размера экрана */
const handleResize = (): void => {
  resizeApp();
  moveHandToRedParking();
};

// Добавить слушатели
window.addEventListener('resize', handleResize);
