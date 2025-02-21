/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lastfm.freetls.fastly.net'],
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

module.exports = nextConfig;
