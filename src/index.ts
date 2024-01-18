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

import { AssetName, LineName, type Asset, type Line } from './types/types';
import './styles/index.css';

/** Координаты якоря ресурсов */
const ASSETS_ANCHOR_COORS = 0.5;

/** Настройки анимации движения руки */
const HAND_ANIMATION = {
  offsetX: 0.005,
  offsetY: 0.15,
  movementDuration: 1000,
  hidingDuration: 300,
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

/** PIXI-приложение */
const app = new PIXI.Application<HTMLCanvasElement>(PIXI_CONFIG);

/** Ресурсы, индексированные по названию */
const ixAssets: Record<AssetName, Asset> = {
  [AssetName.CarGreen]: {
    source: carGreenPng,
    x: 0.195,
    y: 0.21,
    sprite: null,
  },
  [AssetName.CarBlue]: {
    source: carBluePng,
    x: 0.795,
    y: 0.21,
    sprite: null,
  },
  [AssetName.CarRed]: {
    source: carRedPng,
    x: 0.295,
    y: 0.555,
    sprite: null,
  },
  [AssetName.CarYellow]: {
    source: carYellowPng,
    x: 0.7,
    y: 0.555,
    sprite: null,
  },
  [AssetName.Hand]: {
    source: handPng,
    x: 0.475,
    y: 0.525,
    sprite: null,
  },
  [AssetName.ParkingLine1]: {
    source: parkingLinePng,
    x: 0.905,
    y: 0.025,
    sprite: null,
  },
  [AssetName.ParkingLine2]: {
    source: parkingLinePng,
    x: 0.702,
    y: 0.025,
    sprite: null,
  },
  [AssetName.ParkingLine3]: {
    source: parkingLinePng,
    x: 0.499,
    y: 0.025,
    sprite: null,
  },
  [AssetName.ParkingLine4]: {
    source: parkingLinePng,
    x: 0.293,
    y: 0.025,
    sprite: null,
  },
  [AssetName.ParkingLine5]: {
    source: parkingLinePng,
    x: 0.09,
    y: 0.025,
    sprite: null,
  },
  [AssetName.ParkingMarkYellow]: {
    source: parkingMarkYellowPng,
    x: 0.394,
    y: 0.183,
    sprite: null,
  },
  [AssetName.ParkingMarkRed]: {
    source: parkingMarkRedPng,
    x: 0.609,
    y: 0.183,
    sprite: null,
  },
  [AssetName.GameLogo]: {
    source: gameLogoPng,
    x: 2,
    y: 2,
    sprite: null,
  },
  [AssetName.PlayNow]: {
    source: playNowPng,
    x: 2,
    y: 2,
    sprite: null,
  },
  [AssetName.Fail]: {
    source: failPng,
    x: 2,
    y: 2,
    sprite: null,
  },
};

/** Линии от машин к парковочным местам, индексированные по названию */
const ixLines: Record<LineName, Line> = {
  [LineName.Red]: {
    size: 10,
    hexColor: 'D1191F',
    isDrawing: false,
    isFinished: false,
    points: [],
    graphics: null,
  },
  [LineName.Yellow]: {
    size: 10,
    hexColor: 'FFC841',
    isDrawing: false,
    isFinished: false,
    points: [],
    graphics: null,
  },
};

/** Скрыта ли рука-подсказка */
let isHandHidden = false;

/** Добавить canvas в DOM */
const addAppToDOM = (): void => {
  document.body.appendChild(app.view);
};

/** Настроить ресурсы и добавить их на сцену */
const configureAssetsAndAddThemToStage = (): void => {
  for (const [key, assetOptions] of Object.entries(ixAssets)) {
    /** Спрайт на основе ресурса */
    const sprite = PIXI.Sprite.from(assetOptions.source);

    // Задать начальное положение спрайта
    sprite.anchor.set(ASSETS_ANCHOR_COORS);
    sprite.x = app.screen.width * assetOptions.x;
    sprite.y = app.screen.height * assetOptions.y;

    // Добавить курсор-поинтер для интерактивных ресурсов
    if (key === AssetName.CarRed || key === AssetName.CarYellow) {
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
  for (const key of Object.keys(ixLines)) {
    const graphics = new PIXI.Graphics();
    ixLines[key as LineName].graphics = graphics;

    app.stage.addChild(graphics);
  }
};

/** Переместить указатель (руку) до цели (красной парковки) */
const moveHandToRedParking = (): void => {
  const parkingMarkRed = ixAssets[AssetName.ParkingMarkRed];

  const { offsetX, offsetY, movementDuration } = HAND_ANIMATION;

  const endX = app.screen.width * (parkingMarkRed?.x + offsetX);
  const endY = app.screen.height * (parkingMarkRed?.y + offsetY);

  const handSprite = ixAssets[AssetName.Hand].sprite;

  if (handSprite !== null) {
    new TWEEN.Tween(handSprite)
      .to(
        {
          x: endX,
          y: endY,
        },
        movementDuration,
      )
      .repeat(Infinity)
      .easing(TWEEN.Easing.Linear.None)
      .onComplete(() => {
        console.log('Анимация завершена!');
      })
      .start();
  }
};

/** Получить спрайты интерактивных машин, индексированные по цветам (именам линий) */
const getInteractiveCarSprites = (): Record<LineName, PIXI.Sprite | null> => {
  return {
    [LineName.Red]: ixAssets[AssetName.CarRed].sprite,
    [LineName.Yellow]: ixAssets[AssetName.CarYellow].sprite,
  };
};

/** Обработать нажатие кнопки мыши */
const handleMouseDown = (event: PIXI.FederatedMouseEvent): void => {
  const clickPoint = new PIXI.Point(event.pageX, event.pageY);
  const interactiveCarSprites = getInteractiveCarSprites();

  // Определить машину, по которой кликнули,
  // и активировать линию соответствующего цвета
  for (const [carColor, carSprite] of Object.entries(interactiveCarSprites)) {
    const isCarClick = carSprite?.containsPoint(clickPoint) ?? false;
    const lineColor = carColor as LineName;

    if (isCarClick) {
      ixLines[lineColor].isDrawing = true;
      ixLines[lineColor].points.push(clickPoint);
    }
  }
};

/** Плавно скрыть спрайт, а потом удалить его */
const hideAndRemoveHand = (): void => {
  const handSprite = ixAssets[AssetName.Hand].sprite;

  if (handSprite !== null) {
    new TWEEN.Tween(handSprite)
      .to(
        {
          alpha: 0,
        },
        HAND_ANIMATION.hidingDuration,
      )
      .onComplete(() => {
        app.stage.removeChild(handSprite);

        ixAssets[AssetName.Hand].sprite = null;
      })
      .start();
  }
};

/** Обработать перемещение курсора */
const handleMouseMove = (event: PIXI.FederatedMouseEvent): void => {
  const currentPosition = new PIXI.Point(event.pageX, event.pageY);

  // Перебрать существующие линии
  for (const line of Object.values(ixLines)) {
    if (line.isDrawing && line.graphics !== null) {
      if (!isHandHidden) {
        hideAndRemoveHand();

        isHandHidden = true;
      }

      // Добавить новую точку и определить стиль линии
      line.points.push(currentPosition);
      line.graphics.lineStyle(line.size, line.hexColor);

      // Построить линию по точкам
      for (let i = 1; i < line.points.length; i++) {
        const startPoint = line.points[i - 1];
        const endPoint = line.points[i];

        line.graphics.moveTo(startPoint.x, startPoint.y);
        line.graphics.lineTo(endPoint.x, endPoint.y);
      }
    }
  }
};

/** Обработать отпускание кнопки мыши */
const handleMouseUp = (): void => {
  for (const line of Object.values(ixLines)) {
    if (line.isDrawing && line.graphics !== null) {
      line.isDrawing = false;
      line.graphics.clear();
      line.points = [];
    }
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
configureAssetsAndAddThemToStage();
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
