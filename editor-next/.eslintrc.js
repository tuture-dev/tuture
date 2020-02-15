module.exports = {
  extends: ['airbnb', 'plugin:prettier/recommended'],
  parser: 'babel-eslint',
  rules: {
    'consistent-return': 'off',
    'no-param-reassign': 'off',
    'max-len': ['error', { code: 114 }],
    'jsx-a11y/html-has-lang': 'off',
    'import/prefer-default-export': 'warn',
    'react/prop-types': 'off',
    'react/jsx-filename-extension': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-closing-bracket-location': 'off',
    'react/jsx-curly-newline': 'off',
  },
};
