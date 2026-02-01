## 1. Project Setup

- [x] 1.1 Initialize package.json with name, version, bin entry, and TypeScript config
- [x] 1.2 Install dependencies: webdriverio, commander, chalk, typescript, tsx, @types/node
- [x] 1.3 Create tsconfig.json with ES module output and strict mode
- [x] 1.4 Create src/ directory structure: index.ts, commands/, lib/

## 2. Session Management

- [x] 2.1 Create src/lib/session.ts with read/write functions for /tmp/agent-mobile-session.json
- [x] 2.2 Define SessionData interface: sessionId, appiumUrl, deviceName, bundleId, refs
- [x] 2.3 Implement session validation (check if session ID is still valid with Appium)
- [x] 2.4 Add session cleanup on invalid/expired sessions

## 3. Appium Client

- [x] 3.1 Create src/lib/appium.ts with WebDriverIO connection wrapper
- [x] 3.2 Implement getDriver() that connects to Appium or reuses existing session
- [x] 3.3 Support APPIUM_HOST and APPIUM_PORT environment variables
- [x] 3.4 Add error handling for connection failures with helpful messages

## 4. Snapshot Parser

- [x] 4.1 Create src/lib/snapshot.ts for accessibility tree parsing
- [x] 4.2 Implement parseAccessibilityTree() to extract elements from iOS XML
- [x] 4.3 Add ref assignment (@e1, @e2) with XPath storage for each element
- [x] 4.4 Create element type mapping (XCUIElementTypeButton → button)
- [x] 4.5 Implement compact output formatter: `@e1 button "Label" [value]`
- [x] 4.6 Add interactive element filtering (enabled + clickable/focusable/editable)

## 5. CLI Commands

- [x] 5.1 Create src/index.ts with Commander setup and command registration
- [x] 5.2 Implement src/commands/open.ts - launch app by bundle ID, create session
- [x] 5.3 Implement src/commands/snapshot.ts - get tree, assign refs, output compact format
- [x] 5.4 Implement src/commands/tap.ts - tap by ref (@e1) or coordinates (x,y)
- [x] 5.5 Implement src/commands/fill.ts - type text into input field, with --no-clear option
- [x] 5.6 Implement src/commands/swipe.ts - directional swipe with --distance option
- [x] 5.7 Implement src/commands/screenshot.ts - save to file with default/custom name
- [x] 5.8 Implement src/commands/close.ts - end session, cleanup session file

## 6. Build & Test

- [x] 6.1 Add build script to package.json (tsc)
- [x] 6.2 Add dev script with tsx for development
- [x] 6.3 Build and test with iOS Simulator (Calculator app)
- [x] 6.4 Verify snapshot → tap → snapshot workflow works end-to-end (manual test needed)

## 7. Documentation

- [x] 7.1 Create skills/SKILL.md for Claude Code integration
- [x] 7.2 Update README with final installation instructions after testing
