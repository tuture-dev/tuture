module.exports = {
  // ...
  pluginOptions: {
    vite: {
      ///**
      // * deprecated since v0.2.2. we can auto-resolve alias from vue.config.js
      // * @ is setted by the plugin, you can set others used in your projects, like @components
      // * Record<string, string>
      // * @default {}
      // */
      // alias: {
      //   '@components': path.resolve(__dirname, './src/components'),
      // },
      /**
       * Plugin[]
       * @default []
       */
      plugins: [], // other vite plugins list, will be merge into this plugin\'s underlying vite.config.ts
      /**
       * you can enable jsx support by setting { jsx: true }
       * @see https://github.com/underfin/vite-plugin-vue2#options
       * @default {}
       */
      vitePluginVue2Options: {},
      /**
       * Vite UserConfig.optimizeDeps options
       * @default {}
       */
      optimizeDeps: {},
    },
  },
};
