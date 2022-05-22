// https://github.com/intlify/vue-i18n-composable/issues/9
module.exports = {
  configureWebpack: (config) => {
    config.module.rules.push({
      test: /\.mjs$/,
      type: 'javascript/auto',
    });
  },
};
