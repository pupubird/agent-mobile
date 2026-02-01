#!/usr/bin/env node

import { Command } from 'commander';
import { openCommand } from './commands/open.js';
import { snapshotCommand } from './commands/snapshot.js';
import { tapCommand } from './commands/tap.js';
import { fillCommand } from './commands/fill.js';
import { swipeCommand } from './commands/swipe.js';
import { screenshotCommand } from './commands/screenshot.js';
import { closeCommand } from './commands/close.js';

const program = new Command();

program
  .name('agent-mobile')
  .description('Mobile automation CLI for AI agents - control iOS simulators')
  .version('0.1.0');

program.addCommand(openCommand);
program.addCommand(snapshotCommand);
program.addCommand(tapCommand);
program.addCommand(fillCommand);
program.addCommand(swipeCommand);
program.addCommand(screenshotCommand);
program.addCommand(closeCommand);

program.parse();
