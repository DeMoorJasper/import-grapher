# Import Grapher

Uses Parcel in the background to generate an asset graph

## Install

```
npm install import-grapher
```

## CLI

Generates a `import-graph.json` file in the current working directory.

```bash
importgrapher <entrypoint>
```

### Options

- `--no-cache`, disables the caching mechanism
- `--out-file <filename>`, sets the output filename

## API

You can also use Import Grapher as a Node.js API

```Javascript
const importGrapher = require('import-grapher');
const path = require('path');

async function getGraph() {
  // graph = a JSON Object containing the asset import tree
  let graph = await importGrapher(path.join(__dirname, './index.js'));

  // do something with the graph...
}

getGraph();
```

## License

MIT