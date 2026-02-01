import { remote, type Browser } from 'webdriverio';
import { readSession, writeSession, deleteSession, type SessionData } from './session.js';

let driver: Browser | null = null;

function getAppiumUrl(): string {
  const host = process.env.APPIUM_HOST || 'localhost';
  const port = process.env.APPIUM_PORT || '4723';
  return `http://${host}:${port}`;
}

export interface OpenOptions {
  bundleId: string;
  deviceName?: string;
}

export async function createSession(options: OpenOptions): Promise<Browser> {
  const appiumUrl = getAppiumUrl();

  try {
    driver = await remote({
      hostname: process.env.APPIUM_HOST || 'localhost',
      port: parseInt(process.env.APPIUM_PORT || '4723'),
      capabilities: {
        platformName: 'iOS',
        'appium:automationName': 'XCUITest',
        'appium:deviceName': options.deviceName || 'iPhone Simulator',
        'appium:bundleId': options.bundleId,
      },
      logLevel: 'silent',
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
    if (err.message.includes('ECONNREFUSED')) {
      throw new Error(`Cannot connect to Appium at ${appiumUrl}. Start with: appium --port 4723`);
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

  const appiumUrl = getAppiumUrl();

  try {
    // Try to reconnect to existing session
    driver = await remote({
      hostname: process.env.APPIUM_HOST || 'localhost',
      port: parseInt(process.env.APPIUM_PORT || '4723'),
      capabilities: {
        platformName: 'iOS',
        'appium:automationName': 'XCUITest',
        'appium:deviceName': session.deviceName,
        'appium:bundleId': session.bundleId,
      },
      logLevel: 'silent',
    });

    // Update session with new session ID
    session.sessionId = driver.sessionId;
    writeSession(session);

    return driver;
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('ECONNREFUSED')) {
      throw new Error(`Cannot connect to Appium at ${appiumUrl}. Start with: appium --port 4723`);
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
