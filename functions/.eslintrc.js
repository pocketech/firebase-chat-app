module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.dev.json'],
    sourceType: 'module',
  },
  env: {
    es6: true,
    node: true,
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  ignorePatterns: [
    '/lib/**/*', // Ignore built files.
  ],
  rules: {
    'import/no-unresolved': 0,
    'no-var-requires': 'off',
    // 単なるconsole.logはエラーにする
    'no-console': ['error', { allow: ['warn', 'info', 'error'] }],
    // enumの使用をエラーにする(ユニオン型を推奨)
    'no-restricted-syntax': [
      'error',
      { selector: 'TSEnumDeclaration', message: "Don't declare enums" },
    ],
    // 変数宣言と return 周辺を改行必須に
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
      { blankLine: 'always', prev: '*', next: 'return' },
    ],
    // コールバック関数は必ずarrow-functionにする
    'prefer-arrow-callback': 'error',
    // functin宣言はエラー
    'func-style': 'error',
    // arrow-functionの記法
    'arrow-body-style': 'off',
    // 明示的なanyは許容する
    '@typescript-eslint/no-explicit-any': 'off',
    // 関数の引数や返り値に必ず型をつけるルールを off にする
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // 型は明示的にtype-importする
    '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
  },
}
