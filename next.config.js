/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    esmExternals: true
  },
  eslint: {
    dirs: ['graphql', 'pages', 'components', 'app', 'features', 'layouts', 'lib']
  },
  images: {
    domains: ['tailwindui.com'],
  },
};
