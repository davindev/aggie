module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'airbnb/hooks',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    // .tsx 확장자에서 JSX 문법을 허용한다.
    'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }],
    // .ts, .tsx 파일을 import 할 때 확장자를 생략한다.
    'import/extensions': ['warn', 'ignorePackages', { ts: 'never', tsx: 'never' }],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
