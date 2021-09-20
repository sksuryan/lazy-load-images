// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    src: '/dist',
    public: { url: '/', resolve: false, static: true },
  },
  plugins: ['@snowpack/plugin-react-refresh'],
  packageOptions: {},
  devOptions: {
    port: 3000,
  },
  buildOptions: {
    baseUrl: '/',
  },
};
