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
    // 타입스크립트의 interface에서 타입을 지정할 때 발생하는 충돌을 해결한다.
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    // 파일에서 named export를 할 때, default export의 여부를 확인하지 않는다.
    'import/prefer-default-export': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
