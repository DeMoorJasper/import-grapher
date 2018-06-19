const path = require('path');

async function findAsset(bundle, name, previous, processNode) {
  for (const asset of bundle.assets) {
    const withExt = name + path.extname(asset.name);
    if (asset.name === name || asset.name === withExt) {
      const dependencies = await buildAssetTree(bundle, asset, processNode, previous);
      return processNode ?
        processNode(asset, dependencies) :
        {
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
  const tree = [];

  for (const depProps of asset.dependencies.values()) {
    const depName = normalizeName(asset.name, depProps.name);
    if (previous.indexOf(depName) === -1) {
      if (!depProps.includedInParent) {
        previous.push(depName);
        const assetTree = await findAsset(bundle, depName, previous, processNode);
        if (assetTree) {
          tree.push(assetTree);
        }
      }
    } else {
      tree.push(
        processNode ?
          processNode(Object.assign(asset, {isCircularDependency: true})) :
          {
            name: asset.relativeName,
            type: asset.type,
            isCircularDependency: true
          }
      );
    }
  }

  return tree;
}

async function buildTree(bundle, processNode) {
  const entryAsset = bundle.entryAsset;

  if (!entryAsset) {
    return;
  }

  const bundleData = {
    name: entryAsset.name,
    type: entryAsset.type,
    dependencies: await buildAssetTree(bundle, entryAsset, processNode)
  };

  return bundleData;
}

module.exports = buildTree;
