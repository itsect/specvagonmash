import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import {defineConfig} from 'astro/config';

import preact from '@astrojs/preact';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import image from '@astrojs/image';
import node from '@astrojs/node';


export default defineConfig({
    site: 'https://itsect.github.io',
    base: '/specvagonmash',
    integrations: [mdx(), sitemap(), preact(), tailwind(), image({
        serviceEntryPoint: '@astrojs/image/sharp'
    })],
    output: 'server',
    adapter: node({
        mode: 'standalone'
    }),
    markdown: {
        extendDefaultPlugins: true,
    },
    vite: {
        resolve: {
            alias: {
                '~': path.resolve(__dirname, './src'),
            },
        },
    },
});
