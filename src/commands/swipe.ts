import { Command } from 'commander';
import { getDriver } from '../lib/appium.js';

type Direction = 'up' | 'down' | 'left' | 'right';

export const swipeCommand = new Command('swipe')
  .description('Swipe in a direction\n\nExamples:\n  agent-mobile swipe down\n  agent-mobile swipe up --distance 75')
  .argument('<direction>', 'Direction: up, down, left, right')
  .option('--distance <percent>', 'Swipe distance as percentage of screen', '50')
  .action(async (direction: string, options: { distance: string }) => {
    try {
      const validDirections: Direction[] = ['up', 'down', 'left', 'right'];
      if (!validDirections.includes(direction as Direction)) {
        console.error('Error: Invalid direction. Use: up, down, left, right');
        process.exit(1);
      }

      const distance = parseInt(options.distance, 10);
      if (isNaN(distance) || distance < 1 || distance > 100) {
        console.error('Error: Distance must be a number between 1 and 100');
        process.exit(1);
      }

      const driver = await getDriver();
      const { width, height } = await driver.getWindowSize();

      const centerX = Math.floor(width / 2);
      const centerY = Math.floor(height / 2);
      const distanceFraction = distance / 100;

      let startX = centerX;
      let startY = centerY;
      let endX = centerX;
      let endY = centerY;

      switch (direction as Direction) {
        case 'up':
          startY = Math.floor(height * 0.7);
          endY = Math.floor(height * (0.7 - distanceFraction * 0.5));
          break;
        case 'down':
          startY = Math.floor(height * 0.3);
          endY = Math.floor(height * (0.3 + distanceFraction * 0.5));
          break;
        case 'left':
          startX = Math.floor(width * 0.8);
          endX = Math.floor(width * (0.8 - distanceFraction * 0.6));
          break;
        case 'right':
          startX = Math.floor(width * 0.2);
          endX = Math.floor(width * (0.2 + distanceFraction * 0.6));
          break;
      }

      await driver
        .action('pointer', { parameters: { pointerType: 'touch' } })
        .move({ x: startX, y: startY })
        .down()
        .move({ x: endX, y: endY, duration: 300 })
        .up()
        .perform();

      console.log(`Swiped ${direction}`);
    } catch (error) {
      const err = error as Error;
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  });
