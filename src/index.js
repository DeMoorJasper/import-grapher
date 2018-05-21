const Bundler = require('parcel-bundler');
const buildDataJson = require('./buildDataJson');
const path = require('path');

async function generateGraph(entryPoint, options = {}) {
  let cwd = process.cwd();
  let bundler = new Bundler(entryPoint, {
    outDir: path.join(cwd, '.import-grapher', 'dist'),
    cacheDir: path.join(cwd, '.import-grapher', '.cache'),
    publicUrl: './',
    watch: false,
    cache: options.cache || true,
    target: 'node',
    logLevel: 0
  });
  
  let bundle = await bundler.bundle();

  return await buildDataJson(bundle);
}

module.exports = generateGraph;