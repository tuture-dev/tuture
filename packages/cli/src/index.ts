#!/usr/bin/env node

import { Command } from 'commander';
import { makeInitCommand } from './commands/init.js';
import { makeUpCommand } from './commands/up.js';
import { makeDestroyCommand } from './commands/destroy.js';

const program = new Command('tuture');

program
  .version('0.1.0')
  .description('Command line interface for Tuture')
  .addCommand(makeInitCommand())
  .addCommand(makeUpCommand())
  .addCommand(makeDestroyCommand())
  .parse(process.argv);
