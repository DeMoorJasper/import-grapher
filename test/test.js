const importGrapher = require('../src/index');
const path = require('path');
const fs = require('fs');

async function test() {
  let jsonData = await parcelVisualiser(path.join(__dirname, './project/index.js'));

  fs.writeFileSync(path.join(__dirname, 'parcel-assetTree.json'), JSON.stringify(jsonData));
}

test();