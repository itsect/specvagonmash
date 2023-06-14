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

    integrations: [mdx(), sitemap(), preact(), tailwind()],
    output: 'static',
    adapter: node({
        mode: 'standalone'
    }),
    build: {
        site: 'https://itsect.github.io',
        assetsPrefix: 'https://itsect.github.io/specvagonmash',
        base: '/specvagonmash',
    },
    markdown: {
        extendDefaultPlugins: true,
    },
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
