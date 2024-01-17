import type * as PIXI from 'pixi.js';

/**
 * Поменять курсор при наведении на спрайт
 * @param sprite экземпляр спрайта (например, изображение)
 * @param cursorType тип курсора, который появляется при наведении на спрайт
 */
const changeCursorOnHover = (sprite: PIXI.Sprite, cursorType: string): void => {
  sprite.interactive = true;

  sprite.on('mouseover', () => {
    document.body.style.cursor = cursorType;
  });

  sprite.on('mouseout', () => {
    document.body.style.cursor = 'auto';
  });
};

export { changeCursorOnHover };
