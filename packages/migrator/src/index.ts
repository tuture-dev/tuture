#!/usr/bin/env node

import { Command } from 'commander';
import { MigrateOptions, migrate } from './migrate.js';

const program = new Command('tuture');

program
  .version('0.0.1')
  .argument('[path]', 'path to legacy tutorial')
  .option('--dry-run', 'run in dry-run mode')
  .description('Migration utility for legacy Tuture tutorials')
  .action(async (path: string, options: MigrateOptions) => {
    await migrate(path, options);
  })
  .parse(process.argv);
