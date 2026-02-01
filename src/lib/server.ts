import { spawn, execSync, type ChildProcess } from 'child_process';
import { existsSync, writeFileSync, readFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const PID_FILE = join(tmpdir(), 'agent-mobile-appium.pid');
const LOG_FILE = join(tmpdir(), 'agent-mobile-appium.log');

let appiumProcess: ChildProcess | null = null;

function getAppiumPort(): number {
  return parseInt(process.env.APPIUM_PORT || '4723');
}

function getAppiumHost(): string {
  return process.env.APPIUM_HOST || '127.0.0.1';
}

export async function isAppiumRunning(): Promise<boolean> {
  const port = getAppiumPort();
  const host = getAppiumHost();

  try {
    const response = await fetch(`http://${host}:${port}/status`);
    return response.ok;
  } catch {
    return false;
  }
}

export function isXCUITestDriverInstalled(): boolean {
  try {
    const output = execSync('npx appium driver list --installed --json 2>/dev/null', {
      encoding: 'utf-8',
      timeout: 30000,
    });
    const drivers = JSON.parse(output);
    return 'xcuitest' in drivers;
  } catch {
    // If we can't check, assume NOT installed to be safe
    return false;
  }
}

export async function installXCUITestDriver(): Promise<void> {
  console.log('Installing XCUITest driver (first-time setup)...');
  try {
    execSync('npx appium driver install xcuitest', {
      encoding: 'utf-8',
      stdio: 'inherit',
      timeout: 300000, // 5 minutes
    });
    console.log('XCUITest driver installed successfully');
  } catch (error) {
    throw new Error('Failed to install XCUITest driver. Run manually: npx appium driver install xcuitest');
  }
}

export async function startAppiumServer(): Promise<void> {
  const port = getAppiumPort();
  const host = getAppiumHost();

  // Check if already running
  if (await isAppiumRunning()) {
    return;
  }

  console.log('Starting Appium server...');

  // Use npx to run the bundled appium
  appiumProcess = spawn('npx', ['appium', '--address', host, '--port', String(port), '--relaxed-security'], {
    detached: true,
    stdio: 'ignore',  // Don't pipe - we detect readiness via HTTP, not stdout
    env: { ...process.env },
  });

  // Save PID for later cleanup
  if (appiumProcess.pid) {
    writeFileSync(PID_FILE, String(appiumProcess.pid));
  }

  // Don't let the parent wait for this process
  appiumProcess.unref();

  // Wait for server to be ready (status endpoint responding)
  const maxAttempts = 60;
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (await isAppiumRunning()) {
      // Give server a moment to fully initialize session handling
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Appium server ready');
      return;
    }
  }

  throw new Error('Appium server failed to start. Run manually: npx appium');
}

export async function stopAppiumServer(): Promise<void> {
  // Try to stop the process we started
  if (appiumProcess && !appiumProcess.killed) {
    appiumProcess.kill();
    appiumProcess = null;
  }

  // Try to stop via PID file
  if (existsSync(PID_FILE)) {
    try {
      const pid = parseInt(readFileSync(PID_FILE, 'utf-8'));
      process.kill(pid, 'SIGTERM');
    } catch {
      // Process may already be dead
    }
    try {
      unlinkSync(PID_FILE);
    } catch {
      // Ignore
    }
  }
}

export async function ensureAppiumReady(): Promise<void> {
  const verbose = process.env.DEBUG === '1';

  // Check and install XCUITest driver if needed
  if (verbose) console.log('Checking XCUITest driver...');
  if (!isXCUITestDriverInstalled()) {
    await installXCUITestDriver();
  } else if (verbose) {
    console.log('XCUITest driver: installed');
  }

  // Start Appium if not running
  if (verbose) console.log('Checking Appium server...');
  if (!(await isAppiumRunning())) {
    await startAppiumServer();
  } else if (verbose) {
    console.log('Appium server: already running');
  }
}

export interface DoctorResult {
  xcode: { ok: boolean; message: string };
  simulator: { ok: boolean; message: string };
  appium: { ok: boolean; message: string };
  xcuitest: { ok: boolean; message: string };
}

export async function runDoctor(): Promise<DoctorResult> {
  const result: DoctorResult = {
    xcode: { ok: false, message: '' },
    simulator: { ok: false, message: '' },
    appium: { ok: false, message: '' },
    xcuitest: { ok: false, message: '' },
  };

  // Check Xcode
  try {
    const xcodeVersion = execSync('xcodebuild -version 2>/dev/null | head -1', { encoding: 'utf-8' }).trim();
    result.xcode = { ok: true, message: xcodeVersion };
  } catch {
    result.xcode = { ok: false, message: 'Xcode not found. Install from App Store.' };
  }

  // Check Simulator
  try {
    const output = execSync('xcrun simctl list devices booted 2>/dev/null', { encoding: 'utf-8' });
    const bootedMatch = output.match(/\(([A-F0-9-]{36})\) \(Booted\)/);
    if (bootedMatch) {
      // Get device name
      const nameMatch = output.match(/^\s+(.+) \([A-F0-9-]{36}\) \(Booted\)/m);
      const deviceName = nameMatch ? nameMatch[1] : 'Unknown';
      result.simulator = { ok: true, message: `${deviceName} (booted)` };
    } else {
      result.simulator = { ok: false, message: 'No simulator booted. Run: xcrun simctl boot "iPhone 16 Pro"' };
    }
  } catch {
    result.simulator = { ok: false, message: 'Cannot check simulators. Is Xcode installed?' };
  }

  // Check Appium
  if (await isAppiumRunning()) {
    result.appium = { ok: true, message: 'Running on port ' + getAppiumPort() };
  } else {
    result.appium = { ok: true, message: 'Not running (will auto-start)' };
  }

  // Check XCUITest driver
  if (isXCUITestDriverInstalled()) {
    result.xcuitest = { ok: true, message: 'Installed' };
  } else {
    result.xcuitest = { ok: true, message: 'Not installed (will auto-install)' };
  }

  return result;
}
