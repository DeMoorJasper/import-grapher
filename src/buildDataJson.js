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
  return {
    name: name,
    includedInParent: includedInParent
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
      previous.push(depName);
      if (depProps.includedInParent) {
        if (bundle.parentBundle) {
          tree.push(findAsset(bundle.parentBundle, depName, true, previous));
        } else {
          tree.push({
            name: depName,
            includedInParent: true
          });
        }
      } else {
        tree.push(findAsset(bundle, depName, false, previous));
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
    type: bundle.type,
    name: bundle.name,
    childBundles: [],
    assetTree: {
      entry: entryAsset.name,
      type: entryAsset.type,
      dependencies: buildAssetTree(bundle, entryAsset)
    }
  }

  for (let childBundle of bundle.childBundles) {
    let bundleTree = buildTree(childBundle);
    if (bundleTree) {
      bundleData.childBundles.push(bundleTree);
    }
  }

  return bundleData;
}

module.exports = buildTree;