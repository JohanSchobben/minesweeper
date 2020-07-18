import { newSpecPage } from '@stencil/core/testing';
import { GameMinesweeper } from './game-minesweeper';

describe('game-minesweeper', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [GameMinesweeper],
      html: `<game-minesweeper></game-minesweeper>`,
    });
    expect(page.root).toEqualHtml(`
      <game-minesweeper>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </game-minesweeper>
    `);
  });
});
