const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");

module.exports = {
  devServer: {
    proxy: {
      "/": {
        target: `${process.env.VUE_APP_API_BASE_URL}/`,
        ws: true,
        changeOrigin: true,
      },
    },
  },
  pwa: {
    themeColor: "#f0ce6a",
    msTileColor: "#f0ce6a",
    appleMobileWebAppCache: "yes",
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/sw.js",
    },
    manifestOptions: {
      name: "Barebone Aventis",
      short_name: "Aventis",
      start_url: "./index.html",
      display: "standalone",
      background_color: "",
    },
  },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "Barebone Aventis";
      return args;
    });
  },
  configureWebpack: {
    plugins: [
      new SWPrecacheWebpackPlugin({
        cacheId: "barebone-v1.0.0",
        filename: "sw.js",
        staticFileGlobs: ["dist/**/*.{js,css}", "/"],
        minify: true,
        stripPrefix: "dist/",
        dontCacheBustUrlsMatching: /\.\w{6}\./,
      }),
    ],
  },
};
