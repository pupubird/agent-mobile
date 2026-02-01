# agent-mobile

**The [agent-browser](https://github.com/vercel-labs/agent-browser) for iOS.** A CLI tool that lets AI agents control iOS simulators with a simple, token-efficient interface.

```bash
agent-mobile open com.apple.Preferences   # Launch Settings app
agent-mobile snapshot                      # Get UI elements as refs
agent-mobile tap @e3                       # Tap "Wi-Fi" button
agent-mobile screenshot wifi.png           # Capture result
```

Built for Claude Code, Cursor, Windsurf, and any AI coding assistant that can run shell commands.

## Why agent-mobile?

There's no clean, open-source CLI for AI agents to control iOS simulators. Existing tools are either:

- **Research projects** (AppAgent) - Heavy setup, not designed for CLI use
- **Full applications** (mobile-use) - Overkill when you just need a CLI
- **Test runners** (Maestro) - Not designed for agent integration
- **Closed source** (Revyl, etc.) - Can't customize or contribute

**agent-mobile** fills this gap: a simple CLI with the same snapshot + refs pattern that makes agent-browser so effective.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     AI Agent (Claude Code, etc.)             │
│  Executes CLI commands, interprets snapshot refs            │
└─────────────────────┬───────────────────────────────────────┘
                      │ Shell commands
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                     agent-mobile CLI                         │
│  open │ snapshot │ tap │ fill │ swipe │ screenshot │ close  │
└─────────────────────┬───────────────────────────────────────┘
                      │ WebDriverIO
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   Appium Server (port 4723)                  │
│                   Driver: XCUITest                           │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                      iOS Simulator                           │
│                 (Xcode Command Line Tools)                   │
└─────────────────────────────────────────────────────────────┘
```

## Installation

### Requirements

- **macOS** with Xcode installed
- **Node.js** 18+
- An iOS Simulator (comes with Xcode)

### Quick Start

```bash
# 1. Install Appium and the iOS driver
npm install -g appium
appium driver install xcuitest

# 2. Install agent-mobile
npm install -g agent-mobile

# 3. Start Appium server (in a separate terminal)
appium --port 4723

# 4. Boot a simulator
xcrun simctl boot "iPhone 15 Pro"

# 5. You're ready
agent-mobile open com.apple.calculator
agent-mobile snapshot
```

### From Source

```bash
git clone https://github.com/pupubird/agent-mobile.git
cd agent-mobile
npm install
npm run build
npm link
```

## Usage

### The Pattern

Same workflow as agent-browser: **snapshot → interact → re-snapshot**

```bash
agent-mobile open com.apple.calculator  # Launch app
agent-mobile snapshot                   # Get refs (@e1, @e2, ...)
agent-mobile tap @e1                    # Interact
agent-mobile snapshot                   # Refs are stale after UI changes
```

### Commands

| Command | Description |
|---------|-------------|
| `open <bundle-id>` | Launch app by bundle ID |
| `snapshot` | Get UI elements with refs |
| `tap <ref>` | Tap element (`@e1`) or coordinates (`100,200`) |
| `fill <ref> "text"` | Type into text field |
| `swipe <direction>` | Swipe up/down/left/right |
| `screenshot [file]` | Save screenshot |
| `close` | End session |

### Snapshot Output

```bash
$ agent-mobile snapshot

@e1 button "1"
@e2 button "2"
@e3 button "+"
@e4 button "="
@e5 staticText "0"
```

Compact, token-efficient. No verbose XPaths or accessibility trees.

### Example: Settings Navigation

```bash
# Open Settings
agent-mobile open com.apple.Preferences

# See what's on screen
agent-mobile snapshot
# @e1 cell "Wi-Fi"
# @e2 cell "Bluetooth"
# @e3 cell "Cellular"
# ...

# Tap Wi-Fi
agent-mobile tap @e1

# New screen, new refs
agent-mobile snapshot
# @e1 switch "Wi-Fi" [on]
# @e2 cell "MyNetwork"
# ...

# Take screenshot
agent-mobile screenshot wifi-settings.png
```

## Project Structure

```
agent-mobile/
├── src/
│   ├── index.ts              # CLI entry point
│   ├── commands/             # Command implementations
│   └── lib/
│       ├── appium.ts         # Appium client wrapper
│       ├── snapshot.ts       # Accessibility tree → refs
│       └── session.ts        # Session persistence
├── skills/
│   └── SKILL.md              # Claude Code skill
├── package.json
└── tsconfig.json
```

## AI Agent Integration

### Claude Code

Install the skill:

```bash
mkdir -p ~/.claude/skills
cp skills/SKILL.md ~/.claude/skills/agent-mobile.md
```

Then just ask Claude:

> "Open the iOS Settings app and navigate to Wi-Fi settings"

Claude will run:
```bash
agent-mobile open com.apple.Preferences
agent-mobile snapshot
agent-mobile tap @e1  # Wi-Fi cell
agent-mobile snapshot
```

### Other AI Assistants

Any AI that can execute shell commands can use agent-mobile. The key is the snapshot output format - compact refs that fit in context windows.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `ECONNREFUSED 4723` | Start Appium: `appium --port 4723` |
| "Device not found" | Boot simulator: `xcrun simctl boot "iPhone 15 Pro"` |
| "Ref not found" | Screen changed - run `snapshot` again |
| "Element not interactable" | Use `swipe` to scroll element into view |
| Driver issues | Reinstall: `appium driver install xcuitest --force` |

## How It Works

### The Refs Pattern

iOS accessibility trees are verbose. agent-mobile converts them to simple refs:

```
@e1 button "Sign In"
@e2 textField "Email" [user@example.com]
@e3 secureTextField "Password"
```

This is what makes it work well with LLMs:
- **Token efficient** - No verbose XPaths or XML
- **Readable** - AI can reason about `@e1` easily
- **Stale-aware** - Refs invalidate on screen changes

### Session Persistence

Session state is stored in `/tmp/agent-mobile-session.json`, so commands work across CLI invocations without reconnecting to Appium.

### Common Bundle IDs

| App | Bundle ID |
|-----|-----------|
| Calculator | `com.apple.calculator` |
| Safari | `com.apple.mobilesafari` |
| Settings | `com.apple.Preferences` |
| Notes | `com.apple.mobilenotes` |
| Photos | `com.apple.mobileslideshow` |
| Maps | `com.apple.Maps` |

## Contributing

We welcome contributions. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

```bash
# Development setup
git clone https://github.com/pupubird/agent-mobile.git
cd agent-mobile
npm install
npm run dev -- open com.apple.calculator
```

## Roadmap

- [ ] Core CLI implementation
- [ ] Snapshot parser (accessibility tree → refs)
- [ ] Basic interactions (tap, fill, swipe)
- [ ] Claude Code skill (SKILL.md)
- [ ] Element wait/retry logic
- [ ] Deep link navigation (`agent-mobile deeplink <url>`)
- [ ] App lifecycle (install, uninstall, reset)
- [ ] Multi-simulator support
- [ ] Android support (future)

## Related Projects

- [agent-browser](https://github.com/vercel-labs/agent-browser) - Browser automation for AI agents (Vercel)
- [Appium](https://appium.io/) - Mobile automation framework
- [WebdriverIO](https://webdriver.io/) - WebDriver client

## License

MIT
