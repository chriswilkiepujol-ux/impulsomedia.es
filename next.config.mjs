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
  async redirects() {
    return [
      { source: '/precios', destination: '/contacto', permanent: true },
      { source: '/en/pricing', destination: '/en/contact', permanent: true },
    ]
  },
}

export default nextConfig
