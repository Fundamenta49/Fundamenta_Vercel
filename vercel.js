// This file enables better server and client integration on Vercel

module.exports = {
  rootDir: 'client',
  generateBuildId: async () => {
    return 'fundamenta-build'
  },
  devIndicators: {
    autoPrerender: false,
  },
  env: {
    SERVER_URL: process.env.SERVER_URL || 'http://localhost:3000'
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  }
}