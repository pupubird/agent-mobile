import { Command } from 'commander';
import { runDoctor } from '../lib/server.js';

export const doctorCommand = new Command('doctor')
  .description('Check system requirements and diagnose issues\n\nExample:\n  agent-mobile doctor')
  .action(async () => {
    console.log('Checking system requirements...\n');

    const result = await runDoctor();

    const check = (ok: boolean) => ok ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m';

    console.log(`${check(result.xcode.ok)} Xcode: ${result.xcode.message}`);
    console.log(`${check(result.simulator.ok)} Simulator: ${result.simulator.message}`);
    console.log(`${check(result.appium.ok)} Appium: ${result.appium.message}`);
    console.log(`${check(result.xcuitest.ok)} XCUITest Driver: ${result.xcuitest.message}`);

    const allOk = result.xcode.ok && result.simulator.ok;

    console.log('');
    if (allOk) {
      console.log('\x1b[32mAll checks passed!\x1b[0m Ready to use agent-mobile.');
    } else {
      console.log('\x1b[33mSome issues found.\x1b[0m Fix the items marked with ✗ above.');
      if (!result.xcode.ok) {
        console.log('\nTo install Xcode:');
        console.log('  1. Open App Store');
        console.log('  2. Search for "Xcode"');
        console.log('  3. Install and open once to accept license');
      }
      if (!result.simulator.ok && result.xcode.ok) {
        console.log('\nTo boot a simulator:');
        console.log('  xcrun simctl boot "iPhone 16 Pro"');
        console.log('  open -a Simulator');
      }
    }
  });
