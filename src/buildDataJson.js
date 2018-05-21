const path = require('path');

function findAsset(bundle, name, includedInParent, previous) {
  for (let asset of bundle.assets) {
    let withExt = name + path.extname(asset.name);
    if (asset.name === name || asset.name === withExt) {
      return {
        name: asset.relativeName,
        type: asset.type,
        dependencies: buildAssetTree(bundle, asset, previous)
      }
    }
  }
}

function normalizeName(assetName, dep) {
  if (dep[0] === '.') {
    return path.join(path.dirname(assetName), dep);
  }
  return dep;
}

function buildAssetTree(bundle, asset, previous = []) {
  let tree = [];

  for (let [dep, depProps] of asset.dependencies) {
    let depName = normalizeName(asset.name, depProps.name);
    if (previous.indexOf(depName) === -1) {
      if (!depProps.includedInParent) {
        previous.push(depName);
        let assetTree = findAsset(bundle, depName, false, previous);
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

function buildTree(bundle) {
  let entryAsset = bundle.entryAsset;

  if (!entryAsset) {
    return;
  }

  let bundleData = {
    name: entryAsset.name,
    type: entryAsset.type,
    dependencies: buildAssetTree(bundle, entryAsset)
  }

  return bundleData;
}

module.exports = buildTree;