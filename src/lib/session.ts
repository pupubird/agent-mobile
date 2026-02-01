import * as fs from 'fs';

const SESSION_FILE = '/tmp/agent-mobile-session.json';

export interface ElementRef {
  xpath: string;
  type: string;
  label?: string;
  value?: string;
}

export interface SessionData {
  sessionId: string;
  appiumUrl: string;
  deviceName: string;
  bundleId: string;
  refs: Record<string, ElementRef>;
}

export function readSession(): SessionData | null {
  try {
    if (!fs.existsSync(SESSION_FILE)) {
      return null;
    }
    const data = fs.readFileSync(SESSION_FILE, 'utf-8');
    return JSON.parse(data) as SessionData;
  } catch {
    return null;
  }
}

export function writeSession(session: SessionData): void {
  fs.writeFileSync(SESSION_FILE, JSON.stringify(session, null, 2));
}

export function updateRefs(refs: Record<string, ElementRef>): void {
  const session = readSession();
  if (session) {
    session.refs = refs;
    writeSession(session);
  }
}

export function deleteSession(): void {
  try {
    if (fs.existsSync(SESSION_FILE)) {
      fs.unlinkSync(SESSION_FILE);
    }
  } catch {
    // Ignore errors during cleanup
  }
}

export function getRef(ref: string): ElementRef | undefined {
  const session = readSession();
  return session?.refs[ref];
}
