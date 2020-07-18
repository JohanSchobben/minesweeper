import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'minesweeper',
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      baseUrl: "https://johanschobben.github.io/minesweeper/",

      serviceWorker: null // disable service workers
    }
  ]
};
