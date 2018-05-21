const Bundler = require('parcel-bundler');
const parcelVisualiser = require('../src/index');
const path = require('path');

async function test() {
  let bundler = new Bundler(path.join(__dirname, './project/index.js'), {
    outDir: path.join(__dirname, 'dist'),
    publicUrl: './',
    watch: false,
    cache: false,
    target: 'browser'
  });

  parcelVisualiser(bundler);

  await bundler.bundle();
}

test();