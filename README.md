# agent-mobile

Mobile automation CLI for AI agents - control iOS simulators with simple commands.

## Installation

```bash
npm install -g agent-mobile
```

That's it. Appium and drivers are bundled - no separate setup required.

## Prerequisites

- **macOS** with Xcode installed
- **iOS Simulator** booted (the tool will tell you if one isn't running)

### First Time Setup

```bash
# 1. Boot a simulator
xcrun simctl boot "iPhone 16 Pro"
open -a Simulator

# 2. Check everything is ready
agent-mobile doctor
```

## Quick Start

```bash
# Launch an app
agent-mobile open com.apple.Preferences

# Get interactive elements with refs
agent-mobile snapshot

# Tap an element by ref
agent-mobile tap @e1
```

## Commands

### open

Launch an iOS app by bundle ID.

```bash
agent-mobile open <bundleId> [options]

# Options:
#   -d, --device <name>  Device name (default: "iPhone Simulator")

# Examples:
agent-mobile open com.apple.Preferences
agent-mobile open com.apple.calculator -d "iPhone 15 Pro"
```

### snapshot

Get UI elements with refs for interaction.

```bash
agent-mobile snapshot [options]

# Options:
#   -a, --all  Show all elements, not just interactive

# Output example:
# @e1 button "General"
# @e2 button "Display & Brightness"
# @e3 switch "Airplane Mode" [off]
```

### tap

Tap an element by ref or coordinates.

```bash
agent-mobile tap <target>

# Examples:
agent-mobile tap @e1        # Tap by ref
agent-mobile tap 100,200    # Tap by coordinates
```

### fill

Fill text into an input field.

```bash
agent-mobile fill <ref> <text> [options]

# Options:
#   --no-clear  Do not clear existing text

# Examples:
agent-mobile fill @e1 "Hello World"
agent-mobile fill @e2 "append this" --no-clear
```

### swipe

Swipe in a direction.

```bash
agent-mobile swipe <direction> [options]

# Directions: up, down, left, right
# Options:
#   --distance <percent>  Swipe distance (1-100, default: 50)

# Examples:
agent-mobile swipe down
agent-mobile swipe up --distance 75
```

### screenshot

Take a screenshot of the current screen.

```bash
agent-mobile screenshot [filename]

# Default filename: screenshot.png

# Examples:
agent-mobile screenshot
agent-mobile screenshot my-screen.png
agent-mobile screenshot /tmp/debug.png
```

### close

Close the current Appium session.

```bash
agent-mobile close
```

### doctor

Check system requirements and diagnose issues.

```bash
agent-mobile doctor

# Output:
# ✓ Xcode: Xcode 16.0
# ✓ Simulator: iPhone 16 Pro (booted)
# ✓ Appium: Running on port 4723
# ✓ XCUITest Driver: Installed
```

## For Agents

**Copy this section to your AI assistant (Claude, Cursor, GPT, etc.):**

---

To automate iOS simulators, use `agent-mobile`. Install with:

```bash
npm install -g agent-mobile
```

Basic workflow:
```bash
agent-mobile open com.apple.Preferences  # Launch app
agent-mobile snapshot                     # Get elements with refs
agent-mobile tap @e1                      # Tap by ref
agent-mobile fill @e2 "text"              # Fill input
agent-mobile swipe down                   # Swipe
agent-mobile screenshot /tmp/s.png        # Screenshot
agent-mobile close                        # End session
```

Prerequisites: macOS with Xcode, iOS Simulator booted (`xcrun simctl boot "iPhone 16 Pro"`).

Run `agent-mobile doctor` to check setup.

---

## AI Integration

agent-mobile is designed for AI coding assistants. The refs pattern (`@e1`, `@e2`, etc.) provides stable element identifiers that AI tools can easily parse and use.

### Claude Code

When using Claude Code in a project with agent-mobile, the `.claude/skills/agent-mobile/SKILL.md` file provides auto-discovery. Claude will know how to:

- Launch apps and navigate UI
- Read element refs from snapshots
- Interact with elements by ref
- Take screenshots for visual debugging

### Example AI Workflow

```
User: "Open Settings and turn on Airplane Mode"

AI runs:
1. agent-mobile open com.apple.Preferences
2. agent-mobile snapshot
   → sees: @e3 switch "Airplane Mode" [off]
3. agent-mobile tap @e3
4. agent-mobile snapshot
   → confirms: @e3 switch "Airplane Mode" [on]
```

## Troubleshooting

Run `agent-mobile doctor` to diagnose issues.

**No simulator booted:**
```bash
xcrun simctl boot "iPhone 16 Pro"
open -a Simulator
```

**Xcode not installed:**
Install Xcode from the App Store and open it once to accept the license.

## License

MIT
