import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
}

async function getProductRoutes(env) {
  const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  }

  console.log('[sitemap] Firebase config check:', {
    hasApiKey: !!firebaseConfig.apiKey,
    hasProjectId: !!firebaseConfig.projectId,
  })

  try {
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    const snapshot = await getDocs(collection(db, 'products'))

    console.log(`[sitemap] Fetched ${snapshot.docs.length} products from Firestore`)

    const routes = snapshot.docs.map((docSnap) => {
      const data = docSnap.data()
      const slug = `${slugify(data.name || '')}-${docSnap.id}`
      return `/product/${slug}`
    })

    console.log('[sitemap] Sample routes:', routes.slice(0, 3))
    return routes
  } catch (err) {
    console.error('[sitemap] Failed to fetch product routes:', err.message)
    return []
  }
}

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  // Load .env, .env.production etc. based on current mode
  const env = loadEnv(mode, process.cwd(), '')

  const productRoutes = await getProductRoutes(env)

  return {
    plugins: [
      react(),
      sitemap({
        hostname: 'https://moderntechgraphics.africa',
        dynamicRoutes: ['/about', '/contact', ...productRoutes],
        exclude: ['/dashboard', '/login'],
      }),
    ],
  }
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