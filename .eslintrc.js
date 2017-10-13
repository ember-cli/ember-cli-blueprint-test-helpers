module.exports = {
  root: true,
  plugins: [
    'chai-expect',
    'mocha',
  ],
  extends: 'eslint:recommended',
  env: {
    mocha: true,
    node: true,
    es6: true,
  },
  globals: {
  },
  parserOptions: {
    ecmaVersion: 6,
  },
  rules: {
    'indent': [2, 2, {
      'SwitchCase': 0,
      'VariableDeclarator': { 'var': 2, 'let': 2, 'const': 3 }
    }],

    'camelcase': 2,
    'no-cond-assign': [2, 'except-parens'],
    'curly': 2,
    'no-use-before-define': [2, 'nofunc'],
    'no-debugger': 2,
    'eqeqeq': 2,
    'no-eval': 2,
    'linebreak-style': [2, 'unix'],
    'new-cap': [2, {
      properties: false,
    }],
    'no-caller': 2,
    'no-empty': 2,
    'no-new': 2,
    'no-undef': 2,
    'no-unused-vars': 2,
    'no-trailing-spaces': 2,
    'no-eq-null': 2,
    'no-console': 0,
    'comma-dangle': 0,
    'no-unused-expressions': 0,

    'chai-expect/missing-assertion': 2,

    'mocha/no-exclusive-tests': 2,
  },
};
