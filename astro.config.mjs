import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import {defineConfig} from 'astro/config';

import preact from '@astrojs/preact';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';


export default defineConfig({
    site: 'https://itsect.github.io',
    assetsPrefix: 'https://itsect.github.io/specvagonmash',
    base: '/specvagonmash',
    integrations: [mdx(), sitemap(), preact(), tailwind()],
    output: 'static',
    adapter: node({
        mode: 'standalone'
    }),
    experimental: {
        assets: true
    },
    image: {
        // Example: Enable the Sharp-based image service
        service: {entrypoint: 'astro/assets/services/sharp'},
    },
    vite: {
        resolve: {
            alias: {
                '~': path.resolve(__dirname, './src'),
            },
        },
    },
});
