import { Command } from 'commander';
import { getDriver } from '../lib/appium.js';
import { getRef } from '../lib/session.js';

export const tapCommand = new Command('tap')
  .description('Tap element by ref (@e1) or coordinates (x,y)\n\nExamples:\n  agent-mobile tap @e1\n  agent-mobile tap 100,200')
  .argument('<target>', 'Element ref or coordinates')
  .action(async (target: string) => {
    try {
      const driver = await getDriver();

      if (target.startsWith('@')) {
        // Tap by ref
        const ref = getRef(target);
        if (!ref) {
          console.error(`Error: Ref ${target} not found. Run: agent-mobile snapshot`);
          process.exit(1);
        }

        const element = await driver.$(ref.xpath);
        await element.click();

        const label = ref.label ? `: "${ref.label}"` : '';
        console.log(`Tapped ${target} (${ref.type}${label})`);
      } else if (target.includes(',')) {
        // Tap by coordinates
        const [xStr, yStr] = target.split(',');
        const x = parseInt(xStr, 10);
        const y = parseInt(yStr, 10);

        if (isNaN(x) || isNaN(y)) {
          console.error('Error: Invalid coordinates. Use format: x,y (e.g., 100,200)');
          process.exit(1);
        }

        await driver
          .action('pointer', { parameters: { pointerType: 'touch' } })
          .move({ x, y })
          .down()
          .up()
          .perform();

        console.log(`Tapped (${x}, ${y})`);
      } else {
        console.error('Error: Invalid target. Use ref (@e1) or coordinates (x,y)');
        process.exit(1);
      }
    } catch (error) {
      const err = error as Error;
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  });
