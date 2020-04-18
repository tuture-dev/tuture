const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  fixBabelImports('emotion'),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': '#02b875',
      '@text-selection-bg': '#d8d8dc',
      '@text-color-inverse': 'inherit',
    },
  }),
);
