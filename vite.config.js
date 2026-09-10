import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://moderntechgraphics.africa',
      dynamicRoutes: ['/about', '/contact'],
      exclude: ['/dashboard', '/login', '/sitemap.xml'],
    }),
  ],
})











/*import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    sitemap({
      hostname: 'https://moderntechgraphics.africa',
      dynamicRoutes: ['/', '/about', '/contact'] 
    })
  ],
})*/