/* eslint-disable @typescript-eslint/consistent-type-assertions */
import * as PIXI from 'pixi.js';

import { ASSETS_ANCHOR_COORS, ASSETS_OPTIONS } from '../constants';
import { AssetName } from '../types';

/** Инициализировать спрайты */
const initSprites = (app: PIXI.Application): Record<AssetName, PIXI.Sprite> => {
  const ixSprites = {} as Record<AssetName, PIXI.Sprite>;

  // Создать спрайты на основе ресурсов
  for (const [name, options] of Object.entries(ASSETS_OPTIONS)) {
    const spriteName = name as AssetName;
    ixSprites[spriteName] = PIXI.Sprite.from(options.source);

    // Задать начальное положение
    ixSprites[spriteName].anchor.set(ASSETS_ANCHOR_COORS);
    ixSprites[spriteName].x = app.screen.width * options.x;
    ixSprites[spriteName].y = app.screen.height * options.y;

    // Добавить курсор-поинтер для интерактивных спрайтов
    if (spriteName === AssetName.CarRed || name === AssetName.CarYellow) {
      ixSprites[spriteName].eventMode = 'static';
      ixSprites[spriteName].cursor = 'pointer';
    }
  }

  return ixSprites;
};

export { initSprites };