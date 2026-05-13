/** @type {import('stylelint').Config} */
export default {
  plugins: ['./scripts/stylelint-tier-guard.mjs'],

  rules: {},

  overrides: [
    {
      files: ['design-system/geeklego.css'],
      rules: {
        'geeklego/no-tier1-in-component-tokens': [true, { severity: 'warning' }],
      },
    },
  ],

  ignoreFiles: ['design-system/geeklego.default.css'],
};
