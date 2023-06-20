import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import {defineConfig, sharpImageService} from 'astro/config';

import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';


export default defineConfig({
    site: 'http://itsect.github.io',
    base: '/specvagonmash',
    integrations: [react(), mdx(), sitemap(), tailwind()],
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
