module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  plugins: ['@typescript-eslint'],
  settings: {
    'import/extensions': ['.js', '.ts', '.jsx', '.tsx'],
  },
};
