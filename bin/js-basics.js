#!/usr/bin/env node
import { runCli } from '../src/cli/main.js';

process.exitCode = runCli(process.argv.slice(2), {
  stdout: (line) => console.log(line),
  stderr: (line) => console.error(line),
});
