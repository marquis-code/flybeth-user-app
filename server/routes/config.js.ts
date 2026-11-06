/**
 * Exposes the API origin to the browser at runtime.
 *
 * The app is rendered as an SPA (ssr: false), so Nuxt's public runtime config
 * is not serialised into the page and `import.meta.env.VITE_*` is frozen at
 * build time. Serving this tiny script lets a platform variable such as
 * NUXT_PUBLIC_API_BASE take effect without rebuilding the image.
 */
export default defineEventHandler((event) => {
  const apiBase =
    process.env.NUXT_PUBLIC_API_BASE ||
    process.env.VITE_BASE_URL ||
    'https://api.flybeth.com/api/v1'

  setHeader(event, 'content-type', 'application/javascript; charset=utf-8')
  // Never cache: the value must follow an environment change on restart.
  setHeader(event, 'cache-control', 'no-store')
  return `window.__FLYBETH_API_BASE__=${JSON.stringify(apiBase)};`
})
