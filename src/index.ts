#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { openCommand } from './commands/open.js';
import { snapshotCommand } from './commands/snapshot.js';
import { tapCommand } from './commands/tap.js';
import { fillCommand } from './commands/fill.js';
import { swipeCommand } from './commands/swipe.js';
import { screenshotCommand } from './commands/screenshot.js';
import { closeCommand } from './commands/close.js';
import { doctorCommand } from './commands/doctor.js';
import { setupCommand } from './commands/setup.js';

// Read version from package.json dynamically
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));

const program = new Command();

program
  .name('agent-mobile')
  .description('Mobile automation CLI for AI agents - control iOS simulators\n\nCommands:\n  open        Launch an iOS app by bundle ID\n  snapshot    Get UI elements with refs (@e1, @e2, ...)\n  tap         Tap element by ref or coordinates\n  fill        Fill text into input by ref\n  swipe       Swipe in a direction\n  screenshot  Take a screenshot\n  close       Close the current session\n  doctor      Check system requirements\n  setup       First-time setup (Xcode, simulators, WDA)\n\nFirst time? Run:\n  agent-mobile setup\n\nWorkflow:\n  1. agent-mobile open com.apple.Preferences\n  2. agent-mobile snapshot\n  3. agent-mobile tap @e1')
  .version(packageJson.version);

program.addCommand(openCommand);
program.addCommand(snapshotCommand);
program.addCommand(tapCommand);
program.addCommand(fillCommand);
program.addCommand(swipeCommand);
program.addCommand(screenshotCommand);
program.addCommand(closeCommand);
program.addCommand(doctorCommand);
program.addCommand(setupCommand);

program.parse();
