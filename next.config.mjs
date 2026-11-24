/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  // The slide renderer (Impulso Social) reads its fonts from disk at runtime.
  outputFileTracingIncludes: {
    '/api/social/**/*': ['./lib/social/fonts/**/*'],
  },
}

export default nextConfig
