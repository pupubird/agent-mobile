import { Command } from 'commander';
import { getDriver } from '../lib/appium.js';
import * as fs from 'fs';
import * as path from 'path';

export const screenshotCommand = new Command('screenshot')
  .description('Take a screenshot\n\nExamples:\n  agent-mobile screenshot\n  agent-mobile screenshot /tmp/debug.png')
  .argument('[filename]', 'Output filename', 'screenshot.png')
  .action(async (filename: string) => {
    try {
      const driver = await getDriver();
      const screenshot = await driver.takeScreenshot();

      const filepath = path.isAbsolute(filename)
        ? filename
        : path.resolve(process.cwd(), filename);

      fs.writeFileSync(filepath, screenshot, 'base64');
      console.log(`Screenshot saved: ${filepath}`);
    } catch (error) {
      const err = error as Error;
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  });
