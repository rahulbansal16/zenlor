const CracoLessPlugin = require('craco-less');
const { getThemeVariables } = require('antd/dist/theme');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
                // '@primary-color': '#2D89F4',
                '@primary-color': 'green',
                '@secondary-color': '#F76C8E',
                '@font-family': "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
                '@font-size-base': '15px',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};