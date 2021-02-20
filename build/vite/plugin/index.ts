import type { Plugin } from 'vite';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';

import windiCSS from 'vite-plugin-windicss';
import PurgeIcons from 'vite-plugin-purge-icons';

import { ViteEnv } from '../../utils';
import { configHtmlPlugin } from './html';
import { configPwaConfig } from './pwa';
import { configMockPlugin } from './mock';
import { configCompressPlugin } from './compress';
import { configStyleImportPlugin } from './styleImport';
import { configVisualizerConfig } from './visualizer';
import { configImageminPlugin } from './imagemin';

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const { VITE_USE_IMAGEMIN, VITE_USE_MOCK, VITE_LEGACY, VITE_BUILD_COMPRESS } = viteEnv;

  const vitePlugins: (Plugin | Plugin[])[] = [
    // have to
    vue(),
    // have to
    vueJsx(),
    ...windiCSS(),
  ];

  // @vitejs/plugin-legacy
  VITE_LEGACY && isBuild && vitePlugins.push(legacy());

  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild));

  // vite-plugin-mock
  VITE_USE_MOCK && vitePlugins.push(configMockPlugin(isBuild));

  // vite-plugin-purge-icons
  vitePlugins.push(PurgeIcons());

  // vite-plugin-style-import
  vitePlugins.push(configStyleImportPlugin());

  // rollup-plugin-visualizer
  vitePlugins.push(configVisualizerConfig());
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