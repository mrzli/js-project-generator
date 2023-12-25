const { getEsLintConfig } = require('@gmjs/eslint-config');

const config = getEsLintConfig({ projectType: 'browser' });

module.exports = {
  ...config,
};
