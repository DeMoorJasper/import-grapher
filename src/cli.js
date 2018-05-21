#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const importGrapher = require('./index');
const version = require('../package.json').version;
const path = require('path');
const fs = require('fs');

program.version(version);
program.usage('importgrapher [entrypoint]');
program.option('--no-cache', 'Disable cache');
program.option('--out-file <outFile>', 'Disable cache');
program.parse(process.argv);

async function createGraph(program) {
  console.log(chalk.green('Generating import graph...'));
  let startTime = Date.now();
  let entrypoint = program.args[0];
  try {
    let graph = await importGrapher(entrypoint, program);
    let outFile = path.join(process.cwd(), program.outFile || 'import-graph.json');
    fs.writeFileSync(outFile, JSON.stringify(graph, null, 2));
    console.log(chalk.green(`Import graph written to: ${outFile}! (Took ${Date.now() - startTime}ms)`));
  } catch(e) {
    console.error(chalk.red('Error occured while generating graph :('));
    console.error(e);
  }
}

createGraph(program);
