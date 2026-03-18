/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/**',
      'node_modules/webpack/**',
      'node_modules/terser/**',
      'node_modules/esbuild/**',
      'node_modules/rollup/**',
      'node_modules/typescript/**',
      'node_modules/prettier/**',
    ],
  },
}

module.exports = nextConfig
