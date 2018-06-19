#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const program = require('commander');
const chalk = require('chalk');
const {version} = require('../package.json');
const importGrapher = require('.');

program.version(version);
program.usage('importgrapher [entrypoint]');
program.option('--no-cache', 'Disable cache');
program.option('--out-file <outFile>', 'Disable cache');
program.parse(process.argv);

async function createGraph(program) {
  console.log(chalk.green('Generating import graph...'));
  const startTime = Date.now();
  const entrypoint = program.args[0];
  try {
    const graph = await importGrapher(entrypoint, program);
    const outFile = path.join(process.cwd(), program.outFile || 'import-graph.json');
    fs.writeFileSync(outFile, JSON.stringify(graph, null, 2));
    console.log(chalk.green(`Import graph written to: ${outFile}! (Took ${Date.now() - startTime}ms)`));
  } catch (e) {
    console.error(chalk.red('Error occured while generating graph :('));
    console.error(e);
  }
}

createGraph(program);
