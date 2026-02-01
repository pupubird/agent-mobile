import { Command } from 'commander';
import { closeSession } from '../lib/appium.js';

export const closeCommand = new Command('close')
  .description('Close the current session\n\nExample:\n  agent-mobile close')
  .action(async () => {
    try {
      await closeSession();
      console.log('Session closed');
    } catch (error) {
      const err = error as Error;
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  });
