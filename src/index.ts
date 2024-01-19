import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';

import { initSprites, initGraphics } from './pixi-elements';
import {
  PIXI_CONFIG,
  ANIMATION,
  ASSETS_OPTIONS,
  LINE_OPTIONS,
} from './constants';
import {
  AssetName,
  LineName,
  type CarAndParkingSprites,
  type FlatTween,
  type GraphicOption,
} from './types';

import './styles/index.css';

/** PIXI-приложение */
const app = new PIXI.Application<HTMLCanvasElement>(PIXI_CONFIG);

/** Спрайты, индексированные по названию ресурсов */
const ixSprites = initSprites(app);

/** Линии к парковочным местам, индексированные по названию линий */
const ixGraphics = initGraphics();

/**
 * Cпрайты интерактивных машин и связанных парковочных мест,
 * индексированные по названию линий
 */
const interactiveCarAndParkingSprites: CarAndParkingSprites = {
  [LineName.Red]: {
    car: ixSprites[AssetName.CarRed],
    parking: ixSprites[AssetName.ParkingRed],
  },
  [LineName.Yellow]: {
    car: ixSprites[AssetName.CarYellow],
    parking: ixSprites[AssetName.ParkingYellow],
  },
};

/** Скрыта ли рука-подсказка */
let isHandHidden = false;

/** Добавить canvas приложения в DOM */
const addAppToDOM = (): void => {
  document.body.appendChild(app.view);
};

/** Добавить спрайты на сцену */
const addSpritesToStage = (): void => {
  for (const sprite of Object.values(ixSprites)) {
    app.stage.addChild(sprite);
  }
};

/** Добавить линии на сцену */
const addGraphicToStage = (): void => {
  for (const graphic of Object.values(ixGraphics)) {
    app.stage.addChild(graphic.pixi);
  }
};

/** Перемещать руку до красной парковки */
const moveHandToRedParking = (): void => {
  const { x, y } = ASSETS_OPTIONS[AssetName.ParkingRed];
  const { offsetX, offsetY, duration } = ANIMATION.hand;

  const endX = app.screen.width * (x + offsetX);
  const endY = app.screen.height * (y + offsetY);

  // Инициализировать и запустить анимацию
  new TWEEN.Tween(ixSprites[AssetName.Hand].position)
    .to({ x: endX, y: endY }, duration.movement)
    .repeat(Infinity)
    .easing(TWEEN.Easing.Linear.None)
    .start();
};

/** Обработать нажатие кнопки мыши */
const handleMouseDown = (event: PIXI.FederatedMouseEvent): void => {
  const currentPosition = new PIXI.Point(event.pageX, event.pageY);
  const ixSprites = interactiveCarAndParkingSprites;

  // Определить машину, по которой кликнули, и активировать соответствующую линию
  for (const [name, sprite] of Object.entries(ixSprites)) {
    const isCarClick = sprite.car.containsPoint(currentPosition);
    const lineName = name as LineName;

    // Начать рисование и добавить первую точку
    if (isCarClick && !ixGraphics[lineName].isFinished) {
      ixGraphics[lineName].isDrawing = true;
      ixGraphics[lineName].points.push(currentPosition);
    }
  }
};

/** Плавно скрыть руку и удалить её */
const hideAndRemoveHand = (): void => {
  const handSprite = ixSprites[AssetName.Hand];

  // Инициализировать и запустить анимацию
  new TWEEN.Tween(handSprite)
    .to({ alpha: 0 }, ANIMATION.hand.duration.hiding)
    .easing(TWEEN.Easing.Linear.None)
    .onComplete(() => app.stage.removeChild(handSprite))
    .start();

  isHandHidden = true;
};

/** Обработать перемещение курсора */
const handleMouseMove = (event: PIXI.FederatedMouseEvent): void => {
  const currentPosition = new PIXI.Point(event.pageX, event.pageY);

  for (const [name, graphic] of Object.entries(ixGraphics)) {
    const linename = name as LineName;

    if (graphic.isDrawing) {
      // Скрыть руку
      if (!isHandHidden) {
        hideAndRemoveHand();
      }

      // Добавить новую точку
      graphic.points.push(currentPosition);

      // Задать стиль графики
      const { size, hexColor } = LINE_OPTIONS[linename];
      graphic.pixi.lineStyle(size, hexColor);

      // Построить линию по точкам
      for (let i = 1; i < graphic.points.length; i += 1) {
        const startPoint = graphic.points[i - 1];
        const endPoint = graphic.points[i];

        graphic.pixi.moveTo(startPoint.x, startPoint.y);
        graphic.pixi.lineTo(endPoint.x, endPoint.y);
      }
    }
  }
};

/** Отключить интерактивность */
const disableInteractivity = (sprite: PIXI.Sprite): void => {
  sprite.eventMode = 'none';
  sprite.cursor = 'auto';
};

/** Проверить, нарисованы ли все линии */
const checkLinesFinality = (
  ixGraphics: Record<LineName, GraphicOption>,
): boolean => {
  const isAllLinesFinished = Object.values(ixGraphics)
    .map((graphic) => graphic.isFinished)
    .every((value) => value);

  return isAllLinesFinished;
};

/** Переместить машины до своих парковочных мест */
const moveCarsToParking = (): void => {
  const tweens: FlatTween[] = [];
  const ixSprites = interactiveCarAndParkingSprites;

  for (const [name, sprite] of Object.entries(ixSprites)) {
    const points = ixGraphics[name as LineName].points;

    // Получить массивы координат отдельно по осям
    const xPoints = points.map((point) => point.x);
    const yPoints = points.map((point) => point.y);

    const startPosition = { x: xPoints[0], y: yPoints[0] };

    // Инициализировать анимацию
    const tween = new TWEEN.Tween(startPosition)
      .to({ x: xPoints, y: yPoints }, ANIMATION.car.duration)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate((currentPosition) => {
        sprite.car.position.set(currentPosition.x, currentPosition.y);
      });

    tweens.push(tween);
  }

  // Запустить анимации
  tweens.every((tween) => tween.start());
};

/** Обработать отпускание кнопки мыши */
const handleMouseUp = (event: PIXI.FederatedMouseEvent): void => {
  const currentPosition = new PIXI.Point(event.pageX, event.pageY);
  const ixSprites = interactiveCarAndParkingSprites;

  for (const [name, sprite] of Object.entries(ixSprites)) {
    const isParkingClick = sprite.parking.containsPoint(currentPosition);
    const lineName = name as LineName;

    ixGraphics[lineName].isDrawing = false;

    if (isParkingClick) {
      ixGraphics[lineName].isFinished = true;

      disableInteractivity(sprite.car);

      const isAllLinesFinished = checkLinesFinality(ixGraphics);

      if (isAllLinesFinished) {
        moveCarsToParking();
      }
    } else if (!ixGraphics[lineName].isFinished) {
      // Очистить линию
      ixGraphics[lineName].pixi.clear();
      ixGraphics[lineName].points = [];
    }
  }
};

/** Изменить размер сцены */
const resizeApp = (): void => {
  // Задать новые размеры сцены
  app.renderer.resize(window.innerWidth, window.innerHeight);

  const assetOptions = Object.entries(ASSETS_OPTIONS);

  for (let i = 0; i < assetOptions.length; i += 1) {
    const [name, options] = assetOptions[i];
    const assetName = name as AssetName;

    // Сохранить относительное положение спрайтов
    ixSprites[assetName].x = app.screen.width * options.x;
    ixSprites[assetName].y = app.screen.height * options.y;
  }
};

// Инициализировать приложение
addAppToDOM();
addSpritesToStage();
addGraphicToStage();
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
