import { remote, type Browser } from 'webdriverio';
import { execSync } from 'child_process';
import { readSession, writeSession, deleteSession, type SessionData } from './session.js';
import { ensureAppiumReady } from './server.js';

let driver: Browser | null = null;

function getAppiumUrl(): string {
  const host = process.env.APPIUM_HOST || '127.0.0.1';
  const port = process.env.APPIUM_PORT || '4723';
  return `http://${host}:${port}`;
}

function getBootedSimulatorUdid(): string | null {
  try {
    const output = execSync('xcrun simctl list devices booted', { encoding: 'utf-8' });
    const match = output.match(/\(([A-F0-9-]{36})\) \(Booted\)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export interface OpenOptions {
  bundleId: string;
  deviceName?: string;
}

export async function createSession(options: OpenOptions): Promise<Browser> {
  const verbose = process.env.DEBUG === '1';

  // Auto-setup: ensure Appium is running and driver is installed
  await ensureAppiumReady();

  const appiumUrl = getAppiumUrl();
  const udid = process.env.SIMULATOR_UDID || getBootedSimulatorUdid();

  if (!udid) {
    throw new Error('No booted iOS simulator found. Boot one with: xcrun simctl boot "iPhone 16 Pro"');
  }

  if (verbose) {
    console.log(`Connecting to Appium at ${appiumUrl}`);
    console.log(`Simulator UDID: ${udid}`);
    console.log(`Bundle ID: ${options.bundleId}`);
  }

  try {
    driver = await remote({
      hostname: process.env.APPIUM_HOST || '127.0.0.1',
      port: parseInt(process.env.APPIUM_PORT || '4723'),
      capabilities: {
        platformName: 'iOS',
        'appium:automationName': 'XCUITest',
        'appium:deviceName': options.deviceName || 'iPhone Simulator',
        'appium:udid': udid,
        'appium:bundleId': options.bundleId,
        'appium:noReset': true,
      },
      logLevel: verbose ? 'info' : 'silent',
    });

    const session: SessionData = {
      sessionId: driver.sessionId,
      appiumUrl,
      deviceName: options.deviceName || 'iPhone Simulator',
      bundleId: options.bundleId,
      refs: {},
    };
    writeSession(session);

    return driver;
  } catch (error) {
    const err = error as Error;
    // Log actual error for debugging
    console.error('Session creation failed:', err.message);
    if (err.message.includes('ECONNREFUSED')) {
      throw new Error(`Cannot connect to Appium at ${appiumUrl}. Run: agent-mobile doctor`);
    }
    throw error;
  }
}

export async function getDriver(): Promise<Browser> {
  if (driver) {
    return driver;
  }

  const session = readSession();
  if (!session) {
    throw new Error('No active session. Run: agent-mobile open <bundle-id>');
  }

  // Auto-setup: ensure Appium is running
  await ensureAppiumReady();

  const appiumUrl = getAppiumUrl();
  const udid = process.env.SIMULATOR_UDID || getBootedSimulatorUdid() || undefined;

  try {
    // Try to reconnect to existing session
    driver = await remote({
      hostname: process.env.APPIUM_HOST || '127.0.0.1',
      port: parseInt(process.env.APPIUM_PORT || '4723'),
      capabilities: {
        platformName: 'iOS',
        'appium:automationName': 'XCUITest',
        'appium:deviceName': session.deviceName,
        'appium:udid': udid,
        'appium:bundleId': session.bundleId,
        'appium:noReset': true,
      },
      logLevel: 'silent',
    });

    // Update session with new session ID
    session.sessionId = driver.sessionId;
    writeSession(session);

    return driver;
  } catch (error) {
    const err = error as Error;
    // Log actual error for debugging
    console.error('Session creation failed:', err.message);
    if (err.message.includes('ECONNREFUSED')) {
      throw new Error(`Cannot connect to Appium at ${appiumUrl}. Run: agent-mobile doctor`);
    }
    if (err.message.includes('invalid session id') || err.message.includes('session not created')) {
      deleteSession();
      throw new Error('Session expired. Run: agent-mobile open <bundle-id>');
    }
    throw error;
  }
}

export async function closeSession(): Promise<void> {
  if (driver) {
    try {
      await driver.deleteSession();
    } catch {
      // Ignore errors during cleanup
    }
    driver = null;
  }
  deleteSession();
}

export async function validateSession(): Promise<boolean> {
  try {
    const d = await getDriver();
    await d.getPageSource();
    return true;
  } catch {
    return false;
  }
}
