import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import svgr from 'vite-plugin-svgr'
import { parsePublicEnv } from './src/lib/parsePublicEnv'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const publicEnv = parsePublicEnv(env)

  // if (env.HOST_ENV !== 'local') {
  //   if (!env.SENTRY_AUTH_TOKEN) {
  //     throw new Error('SENTRY_AUTH_TOKEN is not defined')
  //   }
  //   if (!env.SOURCE_VERSION) {
  //     throw new Error('SOURCE_VERSION is not defined')
  //   }
  // }

  return {
    plugins: [react(), svgr()],
    server: {
      port: +env.PORT,
    },
    preview: {
      port: +env.PORT,
    },
    define: {
      'process.env': publicEnv,
    },
  }
})
