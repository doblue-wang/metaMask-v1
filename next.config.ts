import type { NextConfig } from 'next'
const { i18n } = require('./next-i18next.config');

const nextConfig: NextConfig = {
  sassOptions: {
    implementation: 'sass-embedded',
  },
  async rewrites () {
    return [
      {
        source: '/api/:path*',
        destination: 'http://154.19.85.158:85/api/:path*',
      },
    ]
  },
  i18n,
  eslint: {
    ignoreDuringBuilds: true,
  },

}

export default nextConfig