const buildDataJson = require('./buildDataJson');
const path = require('path');
const fs = require('fs');

module.exports = (bundler) => {
  bundler.on('bundled', bundle => {
    fs.writeFileSync(path.join(bundler.options.outDir, 'visualiser.json'), JSON.stringify(buildDataJson(bundle)));
  });
};