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

// XCUITest driver is bundled as a dependency - Appium auto-detects it from node_modules
// No need to check or install separately

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

  // XCUITest driver is bundled as a dependency - no installation needed

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

  // XCUITest driver is bundled
  result.xcuitest = { ok: true, message: 'Bundled' };

  return result;
}
