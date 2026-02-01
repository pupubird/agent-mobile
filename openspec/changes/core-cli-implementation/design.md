## Context

Building a CLI tool from scratch for iOS simulator automation. The tool must integrate with Appium (via WebDriverIO) and produce token-efficient output suitable for LLM consumption.

**Current state**: No existing code. The project has a README defining the target interface.

**Constraints**:
- Must work with existing Appium ecosystem (XCUITest driver)
- Output must be compact for LLM context windows
- Commands must be stateless (session persisted to disk)

## Goals / Non-Goals

**Goals:**
- Simple CLI that AI agents can invoke via shell commands
- Refs pattern (@e1, @e2) that's readable and token-efficient
- Session persistence so commands work across invocations
- Clear error messages when Appium isn't running or device isn't booted

**Non-Goals:**
- Fancy terminal UI (no spinners, progress bars, colors by default)
- Streaming output or watch modes
- Config files or profiles
- Plugin system

## Decisions

### 1. WebDriverIO over raw Appium HTTP

**Decision**: Use WebDriverIO as the Appium client.

**Rationale**: WebDriverIO provides a clean async API, handles session management, and is well-maintained. Raw HTTP to Appium's JSON Wire Protocol would require more boilerplate.

**Alternatives considered**:
- `appium` npm package - deprecated, points to WebDriverIO
- Raw fetch to Appium REST API - more control but more code

### 2. File-based session persistence

**Decision**: Store session ID and config in `/tmp/agent-mobile-session.json`.

**Rationale**:
- Simple, no database needed
- Works across CLI invocations
- Cleared on reboot (expected behavior)
- Enables `agent-mobile tap @e1` without re-specifying device

**Format**:
```json
{
  "sessionId": "abc123",
  "appiumUrl": "http://localhost:4723",
  "platform": "ios",
  "deviceName": "iPhone 15 Pro"
}
```

### 3. In-memory refs store (per-session)

**Decision**: Refs (@e1, @e2) are stored in-memory during snapshot and written to the session file.

**Rationale**: Refs must persist between `snapshot` and `tap` commands. Storing in session file keeps it simple.

**Format in session**:
```json
{
  "refs": {
    "@e1": { "xpath": "//XCUIElementTypeButton[@name='1']", "type": "button", "label": "1" },
    "@e2": { "xpath": "//XCUIElementTypeButton[@name='2']", "type": "button", "label": "2" }
  }
}
```

### 4. XPath for element identification

**Decision**: Store XPath for each ref, use it for element lookup on tap/fill.

**Rationale**: XPath is universally supported by Appium. While accessibility IDs are faster, not all elements have them. XPath works for everything.

**Trade-off**: XPath can be fragile if UI structure changes between snapshot and tap. Mitigated by re-snapshotting after navigation.

### 5. Compact output format

**Decision**: Default output is minimal single-line-per-element format.

**Rationale**: LLMs have limited context. Verbose output wastes tokens.

```
@e1 button "Sign In"
@e2 textField "Email" [user@example.com]
```

Not:
```json
{"ref": "@e1", "type": "XCUIElementTypeButton", "label": "Sign In", "enabled": true, ...}
```

### 6. Commander.js for CLI parsing

**Decision**: Use Commander.js for argument parsing.

**Rationale**: Industry standard, handles subcommands well, auto-generates help. Lighter than oclif, more featured than minimist.

## Risks / Trade-offs

**[Risk] XPath fragility** → Re-snapshot after any navigation. Document this pattern clearly.

**[Risk] Appium connection failures** → Check connection on every command, provide clear error: "Appium not running. Start with: appium --port 4723"

**[Risk] Stale session** → If Appium restarts, session ID is invalid. Detect and auto-reconnect or prompt to run `open` again.

**[Risk] Large accessibility trees** → Some apps have thousands of elements. Mitigate with `--interactive` flag (default) to filter to actionable elements only.

**[Trade-off] No element waiting** → Initial version won't wait for elements to appear. User must handle timing. Future: add `--wait` flag.

## File Structure

```
src/
├── index.ts           # CLI entry, Commander setup
├── commands/
│   ├── open.ts        # Launch app, create session
│   ├── snapshot.ts    # Get UI tree, assign refs
│   ├── tap.ts         # Tap by ref or coords
│   ├── fill.ts        # Type into field
│   ├── swipe.ts       # Directional swipe
│   ├── screenshot.ts  # Save screenshot
│   └── close.ts       # End session
└── lib/
    ├── appium.ts      # WebDriverIO client wrapper
    ├── session.ts     # Session file read/write
    └── snapshot.ts    # XML parsing, ref generation
```
