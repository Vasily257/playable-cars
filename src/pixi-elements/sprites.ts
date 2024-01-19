/* eslint-disable @typescript-eslint/consistent-type-assertions */
import * as PIXI from 'pixi.js';

import { CENTERED_SPRITE_COOR, ASSETS_OPTIONS } from '../constants';
import { type AssetName } from '../types';

/** Инициализировать спрайты */
const initSprites = (app: PIXI.Application): Record<AssetName, PIXI.Sprite> => {
  const ixSprites = {} as Record<AssetName, PIXI.Sprite>;

  // Создать спрайты на основе ресурсов
  for (const [name, options] of Object.entries(ASSETS_OPTIONS)) {
    const spriteName = name as AssetName;
    ixSprites[spriteName] = PIXI.Sprite.from(options.source);

    // Задать начальное положение
    ixSprites[spriteName].x = app.screen.width * options.x;
    ixSprites[spriteName].y = app.screen.height * options.y;

    // Отцентрировать начало координат для всех спрайтов, кроме руки
    if (spriteName !== 'hand') {
      ixSprites[spriteName].anchor.set(CENTERED_SPRITE_COOR);
    }

    // Добавить курсор-поинтер для интерактивных спрайтов
    if (spriteName === 'redCar' || spriteName === 'yellowCar') {
      ixSprites[spriteName].eventMode = 'static';
      ixSprites[spriteName].cursor = 'pointer';
    }
  }

  return ixSprites;
};

export { initSprites };
