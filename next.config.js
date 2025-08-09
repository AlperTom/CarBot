// Bundle analyzer (only if installed)
let withBundleAnalyzer = (config) => config
try {
  withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  })
} catch (e) {
  // Bundle analyzer not installed, skip
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  
  // Ignore linting errors during build for faster deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // CDN and Asset Optimization
  assetPrefix: process.env.NODE_ENV === 'production' ? process.env.CDN_URL || '' : '',
  
  // Image Optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: process.env.NODE_ENV === 'production' ? [
      'carbot.de',
      'www.carbot.de',
      'cdn.carbot.de'
    ] : ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'carbot.de',
      }
    ]
  },
  
  // Performance Optimization Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300'
          }
        ]
      },
      {
        source: '/widget.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          }
        ]
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  },
  
  // Performance optimization for automotive SaaS scale
  experimental: {
    optimizePackageImports: ['openai', 'stripe', '@supabase/supabase-js'],
    workerThreads: false,
    cpus: 1
  },
  
  // Build optimization
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    // Memory optimization for production builds
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          default: false,
          vendors: false,
          
          // Framework chunk (React, Next.js)
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /(?<!node_modules.*)[\/\\]node_modules[\/\\](react|react-dom|scheduler|prop-types|use-subscription)[\/\\]/,
            priority: 40,
            enforce: true
          },
          
          // Supabase chunk
          supabase: {
            name: 'supabase',
            test: /[\/\\]node_modules[\/\\]@supabase[\/\\]/,
            chunks: 'all',
            priority: 30
          },
          
          // Vendor chunk
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /[\/\\]node_modules[\/\\]/,
            priority: 20
          },
          
          // Common chunk
          common: {
            minChunks: 2,
            chunks: 'all',
            name: 'common',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true
          }
        }
      }
      
      // Minimize bundle size
      config.optimization.usedExports = true
      config.optimization.sideEffects = false
    }
    
    // SVG optimization
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })
    
    return config
  },
  
  // Environment-specific settings
  env: {
    BUILD_TIME: new Date().toISOString(),
    REDIS_ENABLED: process.env.REDIS_URL ? 'true' : 'false',
  },
}

module.exports = withBundleAnalyzer(nextConfig)