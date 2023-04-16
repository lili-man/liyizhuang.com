/**
 * @type {import('prettier').Options}
 */
module.exports = {
  plugins: [
    require.resolve('prettier-plugin-astro'),
    require('prettier-plugin-tailwindcss'),
  ],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
  printWidth: 80,
  tabWidth: 2,
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  semi: false,
  useTabs: false,
  arrowParens: 'avoid',
  pluginSearchDirs: false,
}
