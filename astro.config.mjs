import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import {defineConfig, sharpImageService} from 'astro/config';
import preact from '@astrojs/preact';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';


export default defineConfig({
    // site: 'https://itsect.github.io',
    // base: '/specvagonmash',
    integrations: [mdx(), sitemap(), preact(), tailwind()],
    output: 'static',
    experimental: {
        assets: true
    },
    vite: {
        resolve: {
            alias: {
                '~': path.resolve(__dirname, './src'),
            },
        },
    },
});
