import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import prefetch from '@astrojs/prefetch'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import { EnumChangefreq } from 'sitemap';

const lastmod = new Date().toString()
// https://astro.build/config
export default defineConfig({
  site: 'https://liyizhuang.com',
  build: {
    assets: 'static',
    // assetsPrefix: 'https://static.lihaha.cn'
  },
  server: {
    port: 6001,
    host: true,
  },
  integrations: [
    tailwind(),
    prefetch(),
    mdx(),
    sitemap({
      changefreq: EnumChangefreq.WEEKLY,
      priority: 1,
      serialize(item) {
        if (/work/.test(item.url)) {
          item.changefreq = EnumChangefreq.WEEKLY
          item.lastmod = lastmod
          item.priority = 0.7
        }
        if (/post/.test(item.url)) {
          item.changefreq = EnumChangefreq.DAILY
          item.lastmod = lastmod
          item.priority = 0.8
        }
        return item
      },
    }),
  ],
})
