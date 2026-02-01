import { Command } from 'commander';
import { createSession } from '../lib/appium.js';

export const openCommand = new Command('open')
  .description('Launch an iOS app by bundle ID')
  .argument('<bundleId>', 'App bundle ID (e.g., com.apple.calculator)')
  .option('-d, --device <name>', 'Device name', 'iPhone Simulator')
  .action(async (bundleId: string, options: { device: string }) => {
    try {
      const driver = await createSession({
        bundleId,
        deviceName: options.device,
      });
      console.log(`Session started: ${driver.sessionId}`);
      console.log(`App: ${bundleId}`);
      console.log(`Device: ${options.device}`);
    } catch (error) {
      const err = error as Error;
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  });
