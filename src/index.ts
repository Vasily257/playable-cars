import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import { ASSETS } from './scripts/assets';
import { changeCursorOnHover } from './scripts/cursor';
import { type AssetOptions } from './types/assets.js';
import './styles/index.css';

/** Координаты якоря ресурсов */
const ASSETS_ANCHOR_COORS = 0.5;

/** Настройки ресурсов (изображений), индексированные по названию */
const ixAssets: Record<string, AssetOptions> = {};

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

const graphics = new PIXI.Graphics();
app.stage.addChild(graphics);

/** Включен ли режим рисования */
let isDrawing = false;

/** Точки нарисованной линии */
let linePoints: PIXI.Point[] = [];

/** Добавить canvas в DOM */
const addAppToDOM = (): void => {
  document.body.appendChild(app.view);
};

/** Добавить изображения на сцену приложения */
const addImagesToStage = (): void => {
  for (const [key, assetOptions] of Object.entries(ASSETS)) {
    const sprite = PIXI.Sprite.from(assetOptions.source);
    ixAssets[key] = { ...assetOptions, sprite };

    // Добавить изображения на сцену
    app.stage.addChild(sprite);

    // Задать начальное положение ресурсов
    sprite.anchor.set(ASSETS_ANCHOR_COORS);
    sprite.x = app.screen.width * assetOptions.x;
    sprite.y = app.screen.height * assetOptions.y;
  }
};

/** Переместить указатель (руку) до цели (красной парковки) */
const moveHandToRedParking = (): void => {
  let endX = 0;
  let endY = 0;

  const OFFSET_X = 0.005;
  const OFFSET_Y = 0.15;
  const MOVING_TIME = 1000;

  const parkingMarkRed = ixAssets.parkingMarkRed;

  endX = app.screen.width * (parkingMarkRed?.x + OFFSET_X);
  endY = app.screen.height * (parkingMarkRed?.y + OFFSET_Y);

  const handSprite = ixAssets.hand.sprite;

  if (handSprite !== null) {
    new TWEEN.Tween(handSprite)
      .to(
        {
          x: endX,
          y: endY,
        },
        MOVING_TIME,
      )
      .repeat(Infinity)
      .easing(TWEEN.Easing.Linear.None)
      .onComplete(() => {
        console.log('Анимация завершена!');
      })
      .start();
  }
};

/** Поменять курсор при наведении на машины */
const changeCarCursors = (): void => {
  const redCar = ixAssets.carRed.sprite;
  const yellowCar = ixAssets.carYellow.sprite;

  if (redCar !== null && yellowCar !== null) {
    changeCursorOnHover(redCar, 'pointer');
    changeCursorOnHover(yellowCar, 'pointer');
  }
};

/** Обработать нажатие кнопки мыши */
const handleMouseDown = (event: PIXI.FederatedMouseEvent): void => {
  isDrawing = true;

  linePoints = [];
  linePoints.push(new PIXI.Point(event.pageX, event.pageY));
};

/** Обработать перемещение курсора */
const handleMouseMove = (event: PIXI.FederatedMouseEvent): void => {
  if (isDrawing) {
    const currentPosition = new PIXI.Point(event.pageX, event.pageY);

    linePoints.push(currentPosition);

    graphics.lineStyle(10, 'D1191F1A');

    for (let i = 1; i < linePoints.length; i++) {
      const startPoint = linePoints[i - 1];
      const endPoint = linePoints[i];

      graphics.moveTo(startPoint.x, startPoint.y);
      graphics.lineTo(endPoint.x, endPoint.y);
    }
  }
};

/** Обработать отпускание кнопки мыши */
const handleMouseUp = (): void => {
  isDrawing = false;

  graphics.clear();
};

/** Изменить размер сцены */
const resizeApp = (): void => {
  // Задать новые размеры сцены
  app.renderer.resize(window.innerWidth, window.innerHeight);

  for (const [key, options] of Object.entries(ixAssets)) {
    const { x, y } = ixAssets[key];

    // Сохранить позиции изображений
    if (options.sprite !== null) {
      options.sprite.x = app.screen.width * x;
      options.sprite.y = app.screen.height * y;
    }
  }
};

// Инициализировать приложение
addAppToDOM();
addImagesToStage();
moveHandToRedParking();
changeCarCursors();

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
