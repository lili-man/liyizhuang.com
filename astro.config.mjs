import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import prefetch from '@astrojs/prefetch'
import mdx from '@astrojs/mdx'

// https://astro.build/config
export default defineConfig({
  site: 'https://liyizhuang.com/',
  build: {
    assets: 'static',
    // assetsPrefix: 'https://static.lihaha.cn'
  },
  server: {
    port: 6001,
    host: true,
  },
  integrations: [tailwind(), prefetch(), mdx()],
})
