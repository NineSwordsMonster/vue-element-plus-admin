import type { Plugin } from 'vite';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';
import PurgeIcons from 'vite-plugin-purge-icons';

import { ViteEnv } from '../../utils';
import { configHtmlPlugin } from './html';
import { configWindiCssPlugin } from './windicss';
import { configMockPlugin } from './mock';
import { configVisualizerConfig } from './visualizer';
import { configImageminPlugin } from './imagemin';
import { configCompressPlugin } from './compress';
import { configPwaConfig } from './pwa';
import { configStyleImportPlugin } from './styleImport';

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const { VITE_USE_IMAGEMIN, VITE_USE_MOCK, VITE_LEGACY, VITE_BUILD_COMPRESS } = viteEnv;

  const vitePlugins: (Plugin | Plugin[])[] = [
    // have to
    vue(),
    // have to
    vueJsx(),
  ];

  // @vitejs/plugin-legacy
  VITE_LEGACY && isBuild && vitePlugins.push(legacy());

  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild));

  // vite-plugin-windicss
  vitePlugins.push(configWindiCssPlugin());

  // vite-plugin-mock
  VITE_USE_MOCK && vitePlugins.push(configMockPlugin(isBuild));

  // vite-plugin-purge-icons
  vitePlugins.push(PurgeIcons());

  // vite-plugin-style-import
  vitePlugins.push(configStyleImportPlugin());

  // rollup-plugin-visualizer
  vitePlugins.push(configVisualizerConfig());

  //vite-plugin-theme
  //   vitePlugins.push(configThemePlugin());

  // The following plugins only work in the production environment
  if (isBuild) {
    //vite-plugin-imagemin
    VITE_USE_IMAGEMIN && vitePlugins.push(configImageminPlugin());

    // rollup-plugin-gzip
    vitePlugins.push(configCompressPlugin(VITE_BUILD_COMPRESS));

    // vite-plugin-pwa
    vitePlugins.push(configPwaConfig(viteEnv));
  }

  return vitePlugins;
}
