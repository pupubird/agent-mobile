import { Command } from 'commander';
import { getDriver } from '../lib/appium.js';
import { getRef } from '../lib/session.js';

export const fillCommand = new Command('fill')
  .description('Fill text into input by ref\n\nExamples:\n  agent-mobile fill @e1 "Hello World"\n  agent-mobile fill @e2 "append" --no-clear')
  .argument('<ref>', 'Element ref (e.g., @e1)')
  .argument('<text>', 'Text to enter')
  .option('--no-clear', 'Do not clear existing text')
  .action(async (ref: string, text: string, options: { clear: boolean }) => {
    try {
      const driver = await getDriver();

      if (!ref.startsWith('@')) {
        console.error('Error: Ref must start with @ (e.g., @e1)');
        process.exit(1);
      }

      const refData = getRef(ref);
      if (!refData) {
        console.error(`Error: Ref ${ref} not found. Run: agent-mobile snapshot`);
        process.exit(1);
      }

      // Check if it's an input type
      const inputTypes = ['textField', 'secureTextField', 'textView', 'searchField'];
      if (!inputTypes.includes(refData.type)) {
        console.error(`Error: ${ref} is not a text input (type: ${refData.type})`);
        process.exit(1);
      }

      const element = await driver.$(refData.xpath);

      if (options.clear) {
        await element.clearValue();
      }

      await element.setValue(text);
      console.log(`Filled ${ref} with "${text}"`);
    } catch (error) {
      const err = error as Error;
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  });
