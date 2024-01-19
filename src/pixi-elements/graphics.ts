/* eslint-disable @typescript-eslint/consistent-type-assertions */
import * as PIXI from 'pixi.js';

import { LINE_OPTIONS } from '../constants';
import { type GraphicOption, type LineName } from '../types';

/** Инициализировать спрайты */
const initGraphics = (): Record<LineName, GraphicOption> => {
  const ixGraphics = {} as Record<LineName, GraphicOption>;

  // Создать графику на основе линий
  for (const name of Object.keys(LINE_OPTIONS)) {
    const graphicName = name as LineName;

    ixGraphics[graphicName] = {
      pixi: new PIXI.Graphics(),
      isDrawing: false,
      isFinished: false,
      points: [],
    };
  }

  return ixGraphics;
};

export { initGraphics };
