const path = require('path');

async function findAsset(bundle, name, previous, processNode) {
  for (let asset of bundle.assets) {
    let withExt = name + path.extname(asset.name);
    if (asset.name === name || asset.name === withExt) {
      let dependencies = await buildAssetTree(bundle, asset, processNode, previous);
      return processNode
      ? processNode(asset, dependencies)
      : {
        name: asset.relativeName,
        type: asset.type,
        dependencies
      };
    }
  }
}

function normalizeName(assetName, dep) {
  if (dep[0] === '.') {
    return path.join(path.dirname(assetName), dep);
  }
  return dep;
}

async function buildAssetTree(bundle, asset, processNode, previous = []) {
  let tree = [];

  for (let [dep, depProps] of asset.dependencies) {
    let depName = normalizeName(asset.name, depProps.name);
    if (previous.indexOf(depName) === -1) {
      if (!depProps.includedInParent) {
        previous.push(depName);
        let assetTree = await findAsset(bundle, depName, previous, processNode);
        if (assetTree) {
          tree.push(assetTree);
        }
      }
    } else {
      tree.push({
        name: depName,
        isCircularDependency: true
      });
    }
  }

  return tree;
}

async function buildTree(bundle, processNode) {
  let entryAsset = bundle.entryAsset;

  if (!entryAsset) {
    return;
  }

  let bundleData = {
    name: entryAsset.name,
    type: entryAsset.type,
    dependencies: await buildAssetTree(bundle, entryAsset, processNode)
  }

  return bundleData;
}

module.exports = buildTree;