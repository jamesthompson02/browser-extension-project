import type { Configuration } from 'webpack';

module.exports = {
  entry: { 'content': { import: 'src/content.ts', runtime: false } },
} as Configuration;