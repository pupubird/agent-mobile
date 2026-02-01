## Why

There's no clean, open-source CLI for AI agents to control iOS simulators. Existing tools are either research projects (heavy setup), full applications (overkill), or closed source. AI coding assistants like Claude Code need a simple CLI with token-efficient output to automate iOS interactions.

## What Changes

- New `agent-mobile` CLI tool with 7 commands:
  - `open <bundle-id>` - Launch iOS app by bundle ID
  - `snapshot` - Get UI elements as compact refs (@e1, @e2)
  - `tap <ref>` - Tap element by ref or coordinates
  - `fill <ref> "text"` - Type into text field
  - `swipe <direction>` - Swipe up/down/left/right
  - `screenshot [file]` - Save screenshot
  - `close` - End Appium session
- Session persistence across CLI invocations
- Refs pattern for token-efficient LLM interaction

## Non-goals

- Android support (future roadmap)
- Real device support (simulators only)
- Visual/screenshot-based element detection (accessibility tree only)
- GUI or web interface

## Capabilities

### New Capabilities

- `cli-core`: CLI entry point, command routing, help system
- `appium-client`: WebDriverIO wrapper for Appium connection and session management
- `snapshot-parser`: Accessibility tree parsing and refs generation (@e1, @e2)
- `interactions`: Tap, fill, swipe gesture implementations
- `session-management`: Session persistence and reconnection across CLI calls

### Modified Capabilities

(none - greenfield project)

## Impact

- **New files**: `src/` directory with CLI implementation
- **Dependencies**: webdriverio, commander, chalk
- **External**: Requires Appium server running on port 4723
- **Build**: TypeScript compilation, npm package with bin entry
