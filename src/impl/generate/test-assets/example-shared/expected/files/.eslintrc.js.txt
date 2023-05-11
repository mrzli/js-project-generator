const { getEsLintConfig } = require('@gmjs/eslint-config');

const config = getEsLintConfig({ projectType: 'shared' });

module.exports = {
  ...config,
};
