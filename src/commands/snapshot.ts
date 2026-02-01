import { Command } from 'commander';
import { getDriver } from '../lib/appium.js';
import { takeSnapshot } from '../lib/snapshot.js';

export const snapshotCommand = new Command('snapshot')
  .description('Get UI elements with refs\n\nExamples:\n  agent-mobile snapshot\n  agent-mobile snapshot -a')
  .option('-a, --all', 'Show all elements, not just interactive')
  .action(async (options: { all?: boolean }) => {
    try {
      const driver = await getDriver();
      const result = await takeSnapshot(driver, {
        interactive: !options.all,
        all: options.all,
      });

      if (result.count === 0) {
        console.log('No elements found');
      } else {
        console.log(result.text);
      }
    } catch (error) {
      const err = error as Error;
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  });
