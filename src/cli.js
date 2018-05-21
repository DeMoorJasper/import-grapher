var program = require('commander');
var pkg = require('../package.json');
var importGrapher = require('./index');

program
  .version(pkg.version, '-v, --version')
  .command('importgrapher <entrypoint>')
  .option('--no-cache', 'Disable cache')
  .option('--out-file <outFile>', 'Disable cache')
  .action(function (entrypoint, options) {
    console.log(options);
    importGrapher(entrypoint, options).then(graph => {
      let outFile = path.join(process.cwd(), options.outFile || 'import-graph.json');
      fs.writeFileSync(outFile, JSON.stringify(jsonData));
      console.log(`Import graph written to: ${outFile}!`);
    }).catch(e => console.error(e));
  });

program.parse(process.argv);