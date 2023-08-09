import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import {defineConfig, sharpImageService} from 'astro/config';

import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';


export default defineConfig({
    site: 'https://svs-msk.ru',
    // base: '/specvagonmash',
    integrations: [react(), mdx(), sitemap(), tailwind({
        configFile: fileURLToPath(new URL('./tailwind.config.cjs', import.meta.url)),
        // blocklist: []
    })],
    output: 'static',
    compressHTML: true,
    experimental: {
        assets: true
    },
    image: {
        service: sharpImageService(),
    },
    vite: {
        resolve: {
            alias: {
                '~': path.resolve(__dirname, './src'),
            },
        },
    },
});
