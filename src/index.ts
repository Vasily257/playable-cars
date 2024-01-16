import * as PIXI from 'pixi.js';
import { STATIC_ASSETS } from './scripts/images';
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
  for (const [key, assetOptions] of Object.entries(STATIC_ASSETS)) {
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

// Добавить слушатели
window.addEventListener('resize', resizeApp);
