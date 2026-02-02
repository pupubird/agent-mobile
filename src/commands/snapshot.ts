import { Command } from 'commander';
import { getDriver, updateSnapshotSettings } from '../lib/appium.js';
import { takeSnapshot } from '../lib/snapshot.js';

export const snapshotCommand = new Command('snapshot')
  .description('Get UI elements with refs\n\nExamples:\n  agent-mobile snapshot\n  agent-mobile snapshot -a\n  agent-mobile snapshot --depth 80')
  .option('-a, --all', 'Show all elements, not just interactive')
  .option('--depth <number>', 'Max view hierarchy depth (default: 62, increase for React Native)')
  .option('--timeout <ms>', 'Snapshot timeout in milliseconds (default: 50000)')
  .action(async (options: { all?: boolean; depth?: string; timeout?: string }) => {
    try {
      const driver = await getDriver();

      // Apply custom snapshot settings if provided
      if (options.depth || options.timeout) {
        await updateSnapshotSettings({
          depth: options.depth ? parseInt(options.depth) : undefined,
          timeout: options.timeout ? parseInt(options.timeout) : undefined,
        });
      }

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
