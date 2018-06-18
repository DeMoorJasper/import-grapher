const importGrapher = require('../src/index');
const path = require('path');
const fs = require('fs-extra');

async function test() {
  let jsonData = await importGrapher(path.join(__dirname, './project/index.js'), {
    processNode: async (asset, deps) => {
      return {
        name: asset.name,
        contents: (await fs.readFile(asset.name)).toString(),
        deps
      }; 
    }
  });

  fs.writeFileSync(path.join(__dirname, 'parcel-assetTree.json'), JSON.stringify(jsonData));
}

test();