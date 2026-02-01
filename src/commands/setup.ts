import { Command } from 'commander';
import { execSync, spawnSync } from 'child_process';

export const setupCommand = new Command('setup')
  .description('First-time setup: configure Xcode, simulators, and build WDA\n\nExample:\n  agent-mobile setup')
  .option('--skip-wda', 'Skip WDA build (faster but first run will be slow)')
  .action(async (options) => {
    console.log('Running first-time setup...\n');

    let hasError = false;

    // Step 1: Check Xcode
    console.log('1. Checking Xcode...');
    try {
      const xcodeVersion = execSync('xcodebuild -version 2>/dev/null | head -1', { encoding: 'utf-8' }).trim();
      console.log(`   ✓ ${xcodeVersion}`);
    } catch {
      console.log('   ✗ Xcode not found');
      console.log('   → Install Xcode from the App Store, then re-run setup');
      process.exit(1);
    }

    // Step 2: Check/install CLI tools
    console.log('2. Checking Xcode CLI tools...');
    try {
      execSync('xcode-select -p 2>/dev/null', { encoding: 'utf-8' });
      console.log('   ✓ CLI tools installed');
    } catch {
      console.log('   → Installing CLI tools...');
      try {
        execSync('xcode-select --install', { stdio: 'inherit' });
        console.log('   ✓ CLI tools installed');
      } catch {
        console.log('   ✗ Failed to install CLI tools');
        console.log('   → Run manually: xcode-select --install');
        hasError = true;
      }
    }

    // Step 3: Accept license
    console.log('3. Checking Xcode license...');
    try {
      execSync('xcodebuild -checkFirstLaunchStatus 2>/dev/null', { encoding: 'utf-8' });
      console.log('   ✓ License accepted');
    } catch {
      console.log('   → Running first launch setup (may require password)...');
      try {
        execSync('sudo xcodebuild -license accept 2>/dev/null', { stdio: 'inherit' });
        execSync('xcodebuild -runFirstLaunch 2>/dev/null', { stdio: 'inherit', timeout: 300000 });
        console.log('   ✓ First launch setup complete');
      } catch {
        console.log('   ⚠ Could not auto-accept. Run manually:');
        console.log('     sudo xcodebuild -license accept');
        console.log('     xcodebuild -runFirstLaunch');
        hasError = true;
      }
    }

    // Step 4: Check simulator runtimes
    console.log('4. Checking iOS simulator runtimes...');
    try {
      const sdkOutput = execSync('xcodebuild -showsdks 2>/dev/null | grep iphonesimulator | head -1', { encoding: 'utf-8' });
      const sdkMatch = sdkOutput.match(/iphonesimulator(\d+)\.(\d+)/);
      const sdkMajor = sdkMatch ? parseInt(sdkMatch[1]) : 0;

      const runtimesOutput = execSync('xcrun simctl list runtimes 2>/dev/null', { encoding: 'utf-8' });
      const runtimeVersions = [...runtimesOutput.matchAll(/iOS (\d+)\.(\d+)/g)].map(m => ({
        major: parseInt(m[1]),
        minor: parseInt(m[2]),
        full: `${m[1]}.${m[2]}`
      }));

      const hasMatchingRuntime = runtimeVersions.some(r => r.major === sdkMajor);

      if (hasMatchingRuntime) {
        const matching = runtimeVersions.filter(r => r.major === sdkMajor).map(r => r.full).join(', ');
        console.log(`   ✓ Compatible runtime(s): iOS ${matching}`);
      } else {
        console.log(`   ✗ No iOS ${sdkMajor}.x runtime found (SDK is ${sdkMajor}.x)`);
        console.log(`   → Downloading iOS ${sdkMajor} runtime (this may take a while)...`);
        try {
          execSync('xcodebuild -downloadPlatform iOS', { stdio: 'inherit', timeout: 1800000 }); // 30 min timeout
          console.log(`   ✓ iOS runtime downloaded`);
        } catch {
          console.log(`   ⚠ Could not auto-download. Run manually:`);
          console.log(`     xcodebuild -downloadPlatform iOS`);
          hasError = true;
        }
      }
    } catch (e) {
      console.log('   ⚠ Could not check runtimes');
      hasError = true;
    }

    // Step 5: Find or create a compatible simulator
    console.log('5. Checking simulator...');
    try {
      const sdkOutput = execSync('xcodebuild -showsdks 2>/dev/null | grep iphonesimulator | head -1', { encoding: 'utf-8' });
      const sdkMatch = sdkOutput.match(/iphonesimulator(\d+)/);
      const sdkMajor = sdkMatch ? parseInt(sdkMatch[1]) : 0;

      // Check for booted simulator
      const bootedOutput = execSync('xcrun simctl list devices booted -j 2>/dev/null', { encoding: 'utf-8' });
      const bootedDevices = JSON.parse(bootedOutput);

      type DeviceInfo = { name: string; udid: string; runtime: string };
      let bootedDevice: DeviceInfo | null = null;
      let compatibleBootedDevice: DeviceInfo | null = null;

      for (const [runtime, devices] of Object.entries(bootedDevices.devices) as [string, any][]) {
        for (const device of devices) {
          if (device.state === 'Booted') {
            const versionMatch = runtime.match(/iOS[- ](\d+)/i);
            const runtimeMajor = versionMatch ? parseInt(versionMatch[1]) : 0;
            bootedDevice = { name: device.name, udid: device.udid, runtime };
            if (runtimeMajor === sdkMajor) {
              compatibleBootedDevice = bootedDevice;
            }
          }
        }
      }

      if (compatibleBootedDevice) {
        console.log(`   ✓ Compatible simulator booted: ${compatibleBootedDevice.name}`);
      } else if (bootedDevice) {
        console.log(`   ⚠ Booted simulator (${bootedDevice.name}) may not be compatible with SDK ${sdkMajor}.x`);
        console.log(`   → Looking for compatible simulator to boot...`);
        await bootCompatibleSimulator(sdkMajor);
      } else {
        console.log(`   → No simulator booted. Looking for one to boot...`);
        await bootCompatibleSimulator(sdkMajor);
      }
    } catch (e) {
      console.log('   ⚠ Could not check simulators');
      hasError = true;
    }

    // Step 6: Build WDA (optional but recommended)
    if (!options.skipWda) {
      console.log('6. Building WebDriverAgent (this takes 1-2 minutes on first run)...');
      try {
        // Get the booted simulator UDID
        const bootedOutput = execSync('xcrun simctl list devices booted -j 2>/dev/null', { encoding: 'utf-8' });
        const bootedDevices = JSON.parse(bootedOutput);

        let bootedUdid = '';
        let bootedName = '';
        let bootedIOSVersion = '';

        for (const [runtime, devices] of Object.entries(bootedDevices.devices) as [string, any][]) {
          for (const device of devices) {
            if (device.state === 'Booted') {
              bootedUdid = device.udid;
              bootedName = device.name;
              const versionMatch = runtime.match(/iOS[- ]([\d.]+)/i);
              bootedIOSVersion = versionMatch ? versionMatch[1] : '';
              break;
            }
          }
          if (bootedUdid) break;
        }

        if (!bootedUdid) {
          console.log('   ⚠ No simulator booted, skipping WDA build');
        } else {
          // Find WDA project in node_modules
          const wdaPath = findWDAPath();
          if (wdaPath) {
            console.log(`   Building WDA for ${bootedName} (iOS ${bootedIOSVersion})...`);
            const result = spawnSync('xcodebuild', [
              '-project', `${wdaPath}/WebDriverAgent.xcodeproj`,
              '-scheme', 'WebDriverAgentRunner',
              '-destination', `platform=iOS Simulator,id=${bootedUdid}`,
              'build-for-testing'
            ], {
              encoding: 'utf-8',
              timeout: 300000, // 5 minutes
              stdio: ['ignore', 'pipe', 'pipe']
            });

            if (result.status === 0) {
              console.log('   ✓ WebDriverAgent built successfully');
            } else {
              console.log('   ⚠ WDA build had issues (will retry on first use)');
              if (process.env.DEBUG === '1') {
                console.log(result.stderr);
              }
            }
          } else {
            console.log('   ⚠ Could not find WDA project');
          }
        }
      } catch (e) {
        console.log('   ⚠ WDA build skipped (will build on first use)');
      }
    } else {
      console.log('6. Skipping WDA build (--skip-wda)');
    }

    // Summary
    console.log('');
    if (hasError) {
      console.log('\x1b[33mSetup completed with warnings.\x1b[0m');
      console.log('Some manual steps may be required. Run: agent-mobile doctor');
    } else {
      console.log('\x1b[32mSetup complete!\x1b[0m');
      console.log('');
      console.log('Try it out:');
      console.log('  agent-mobile open com.apple.Preferences');
    }
  });

async function bootCompatibleSimulator(sdkMajor: number): Promise<void> {
  try {
    const devicesOutput = execSync('xcrun simctl list devices available -j 2>/dev/null', { encoding: 'utf-8' });
    const devices = JSON.parse(devicesOutput);

    // Find a compatible iPhone simulator
    for (const [runtime, deviceList] of Object.entries(devices.devices) as [string, any][]) {
      const versionMatch = runtime.match(/iOS[- ](\d+)/i);
      const runtimeMajor = versionMatch ? parseInt(versionMatch[1]) : 0;

      if (runtimeMajor === sdkMajor) {
        // Find an iPhone Pro or regular iPhone
        const preferredDevice = deviceList.find((d: any) =>
          d.isAvailable && (d.name.includes('iPhone') && (d.name.includes('Pro') || !d.name.includes('SE')))
        ) || deviceList.find((d: any) => d.isAvailable && d.name.includes('iPhone'));

        if (preferredDevice) {
          console.log(`   → Booting ${preferredDevice.name}...`);
          execSync(`xcrun simctl boot "${preferredDevice.udid}"`, { encoding: 'utf-8' });
          execSync('open -a Simulator', { encoding: 'utf-8' });
          // Wait for boot
          await new Promise(resolve => setTimeout(resolve, 5000));
          console.log(`   ✓ ${preferredDevice.name} booted`);
          return;
        }
      }
    }

    console.log('   ⚠ No compatible simulator found. Create one in Xcode > Window > Devices and Simulators');
  } catch (e) {
    console.log('   ⚠ Could not boot simulator');
  }
}

function findWDAPath(): string | null {
  const possiblePaths = [
    // Local development
    './node_modules/appium-xcuitest-driver/node_modules/appium-webdriveragent',
    './node_modules/appium-webdriveragent',
    // Global install
    `${process.env.npm_config_prefix}/lib/node_modules/agent-mobile/node_modules/appium-xcuitest-driver/node_modules/appium-webdriveragent`,
    `${process.env.npm_config_prefix}/lib/node_modules/agent-mobile/node_modules/appium-webdriveragent`,
    // Homebrew node
    '/opt/homebrew/lib/node_modules/agent-mobile/node_modules/appium-xcuitest-driver/node_modules/appium-webdriveragent',
    // User home .appium
    `${process.env.HOME}/.appium/node_modules/appium-xcuitest-driver/node_modules/appium-webdriveragent`,
  ];

  for (const p of possiblePaths) {
    try {
      execSync(`test -d "${p}"`, { encoding: 'utf-8' });
      return p;
    } catch {
      continue;
    }
  }

  // Try to find it dynamically
  try {
    const result = execSync('npm root -g', { encoding: 'utf-8' }).trim();
    const globalPath = `${result}/agent-mobile/node_modules/appium-xcuitest-driver/node_modules/appium-webdriveragent`;
    execSync(`test -d "${globalPath}"`, { encoding: 'utf-8' });
    return globalPath;
  } catch {
    return null;
  }
}
