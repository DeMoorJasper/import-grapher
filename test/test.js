const importGrapher = require('../src/index');
const path = require('path');
const fs = require('fs-extra');

async function test() {
  let jsonData = await importGrapher(path.join(__dirname, './project/index.js'), {
    postProcessor: async asset => {
      return {
        contents: (await fs.readFile(asset.name)).toString()
      }; 
    }
  });

  fs.writeFileSync(path.join(__dirname, 'parcel-assetTree.json'), JSON.stringify(jsonData));
}

test();