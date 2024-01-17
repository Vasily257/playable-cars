import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import { ASSETS } from './scripts/assets';
import { changeCursorOnHover } from './scripts/cursor';
import { type AssetOptions } from './types/assets.js';
import './styles/index.css';

/** x и y координаты якоря */
const ANCHOR_COORS = 0.5;

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
    sprite.anchor.set(ANCHOR_COORS);
    sprite.x = app.screen.width * assetOptions.x;
    sprite.y = app.screen.height * assetOptions.y;
  }
};

/** Переместить указатель (руку) до цели (красной парковки) */
const moveHandToRedParking = (): void => {
  let endX = 0;
  let endY = 0;

  const offsetX = 0.005;
  const offsetY = 0.15;

  const parkingMarkRed = ixAssets.parkingMarkRed;

  endX = app.screen.width * (parkingMarkRed?.x + offsetX);
  endY = app.screen.height * (parkingMarkRed?.y + offsetY);

  const handSprite = ixAssets.hand.sprite;

  if (handSprite !== null) {
    new TWEEN.Tween(handSprite)
      .to(
        {
          x: endX,
          y: endY,
        },
        1000,
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

/** Обработать изменение размера экрана */
const handleResize = (): void => {
  resizeApp();
  moveHandToRedParking();
};

// Добавить слушатели
window.addEventListener('resize', handleResize);
