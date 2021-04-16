module.exports = {
  // VUE Cli 相关的配置
  configureWebpack: {
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
        },
      ],
    },
  },
  css: {
    loaderOptions: {
      less: {
        // If you are using less-loader@5 please spread the lessOptions to options directly
        modifyVars: {
          'primary-color': '#02b875',
          'text-selection-bg': '#d8d8dc',
          'text-color-inverse': 'inherit',
        },
        javascriptEnabled: true,
      },
    },
  },
};
