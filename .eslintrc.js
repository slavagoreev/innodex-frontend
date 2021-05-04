module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
      globalReturn: true,
    },
    project: ['./tsconfig.json'],
    extraFileExtensions: ['.css', '.scss'],
    tsconfigRootDir: __dirname,
  },
  plugins: [
    '@typescript-eslint',
    'css-modules',
    'react-hooks',
    'simple-import-sort',
    'import',
    'prettier',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'eslint:recommended',
    'stylelint',
    'prettier',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  env: {
    node: true,
    browser: true,
  },
  ignorePatterns: ['*.js', 'node_modules', '.next'],
  rules: {
    quotes: [2, 'single', { avoidEscape: true }],
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'import/no-self-import': 'error',
    'import/no-useless-path-segments': ['error', { noUselessIndex: true }],
    'import/prefer-default-export': 'off',
    'react/destructuring-assignment': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/prop-types': 'off',

    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',

    // Allow monorepo-styled imports
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'node/no-extraneous-import': 'off',
    'node/no-missing-import': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
    'sort-imports': 'off',

    /*** IDE fixes ***/
    // Ignore unused variables that starts with `_`, for example `.map((_el, idx) => idx))`
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-undef': 'off',
    'no-console': 'off',

    '@typescript-eslint/ban-types': 'off',

    // Fixes the bug of enums to be suspected shadowing itself
    // https://stackoverflow.com/a/65768375/4239577
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],

    // Starting from React 17.0, React import is not required
    'react/react-in-jsx-scope': 'off',

    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': [
      'warn',
      { functions: false, classes: false, variables: false, typedefs: false },
    ],

    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Node.js builtins. You could also generate this regex if you use a `.js` config.
          // For example: `^(${require("module").builtinModules.join("|")})(/|$)`
          [
            '^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)',
          ],
          // Packages. `react` related packages come first.
          ['^react$', '^lodash', '^clsx', '^react'],
          // Side effect imports.
          ['^\\u0000'],
          // Parent imports. Put `..` last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and `.` last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          // Style imports.
          ['^.+\\.s?css'],
        ],
      },
    ],
  },
};
