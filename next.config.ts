import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // /writing → /thoughts (renomeado em 2026-05-21). 308 = permanente,
      // mantém método e indica que o link antigo deve atualizar.
      { source: '/writing', destination: '/thoughts', permanent: true },
      { source: '/writing/:slug', destination: '/thoughts/:slug', permanent: true },
    ]
  },
}

export default nextConfig
