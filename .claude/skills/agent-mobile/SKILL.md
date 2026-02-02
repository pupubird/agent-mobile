---
name: agent-mobile
description: Automates iOS simulator interactions for mobile app testing, UI automation, and visual debugging. Use when the user needs to control iOS simulators, interact with mobile apps, fill forms, take screenshots, or test iOS applications.
allowed-tools: Bash(agent-mobile:*)
---

# Mobile Automation - agent-mobile

Control iOS simulators with simple commands. Use for mobile app testing, UI automation, and visual debugging.

## Prerequisites

- **macOS with Xcode** installed
- **iOS Simulator booted**: `xcrun simctl boot "iPhone 16 Pro" && open -a Simulator`

Appium is bundled and auto-starts - no separate server setup needed.

## Quick Start

```bash
# Install globally
npm install -g agent-mobile

# Check setup
agent-mobile doctor

# Launch an app
agent-mobile open com.apple.Preferences

# Get elements with refs
agent-mobile snapshot

# Interact by ref
agent-mobile tap @e1
```

## Core Workflow

1. **Open app:** `agent-mobile open <bundleId>`
2. **Snapshot:** `agent-mobile snapshot` (returns elements with refs like `@e1`, `@e2`)
3. **Interact** using refs from the snapshot
4. **Re-snapshot** after navigation or significant UI changes

## Commands

### open

Launch an iOS app by bundle ID.

```bash
agent-mobile open <bundleId>
agent-mobile open com.apple.Preferences
agent-mobile open com.apple.calculator -d "iPhone 15 Pro"
```

### snapshot

Get UI elements with refs for interaction.

```bash
agent-mobile snapshot              # Interactive elements only
agent-mobile snapshot -a           # All elements
agent-mobile snapshot --depth 80   # Increase depth for React Native
agent-mobile snapshot --timeout 60000  # Increase timeout for complex screens
```

Output format:
```
@e1 button "General"
@e2 button "Display & Brightness"
@e3 switch "Airplane Mode" [off]
```

### tap

Tap an element by ref or coordinates.

```bash
agent-mobile tap @e1            # Tap by ref
agent-mobile tap 100,200        # Tap by coordinates
```

### fill

Fill text into an input field.

```bash
agent-mobile fill @e1 "Hello"
agent-mobile fill @e1 "append" --no-clear
```

### swipe

Swipe in a direction.

```bash
agent-mobile swipe down
agent-mobile swipe up --distance 75
```

### screenshot

Take a screenshot.

```bash
agent-mobile screenshot
agent-mobile screenshot /tmp/debug.png
```

### close

End the current session.

```bash
agent-mobile close
```

### doctor

Check system requirements.

```bash
agent-mobile doctor
```

## Workflow Examples

### Example: Toggle a Setting

```bash
# Open Settings
agent-mobile open com.apple.Preferences

# Get elements with refs
agent-mobile snapshot

# Output shows:
# @e1 button "Airplane Mode"
# @e2 switch "Airplane Mode" [off]

# Tap the switch
agent-mobile tap @e2

# Verify the change
agent-mobile snapshot
# @e2 switch "Airplane Mode" [on]
```

### Example: Fill a Form

```bash
# Open app with form
agent-mobile open com.example.app

# Snapshot to find inputs
agent-mobile snapshot
# @e1 textField "Username"
# @e2 secureTextField "Password"
# @e3 button "Login"

# Fill the form
agent-mobile fill @e1 "testuser"
agent-mobile fill @e2 "password123"

# Submit
agent-mobile tap @e3
```

### Example: Navigate with Swipe

```bash
agent-mobile open com.apple.Preferences
agent-mobile snapshot

# Scroll down to find more options
agent-mobile swipe down

# Take another snapshot
agent-mobile snapshot

# Tap a newly visible element
agent-mobile tap @e5
```

## Troubleshooting

### React Native apps: Empty or incomplete snapshots

React Native apps have deeply nested view hierarchies (often 60+ levels deep). The default XCUITest snapshot depth limit (~50) may truncate elements.

**Solution:** agent-mobile uses a higher default depth (62). If you still see missing elements:

```bash
# Increase snapshot depth (default: 62)
agent-mobile snapshot --depth 80

# Increase snapshot timeout for complex screens (default: 50000ms)
agent-mobile snapshot --timeout 60000

# Or via environment variables
SNAPSHOT_MAX_DEPTH=80 agent-mobile snapshot
```

## Tips

- Always run `snapshot` after navigation to get fresh refs
- Refs (`@e1`, `@e2`) are session-specific and change after each snapshot
- Use coordinates (`tap 100,200`) when refs aren't available
- Take screenshots for visual debugging: `screenshot /tmp/debug.png`
- Run `agent-mobile doctor` to diagnose setup issues

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DEBUG` | `0` | Enable verbose logging (`DEBUG=1`) |
| `APPIUM_HOST` | `127.0.0.1` | Appium server host |
| `APPIUM_PORT` | `4723` | Appium server port |
| `SIMULATOR_UDID` | (auto) | Override simulator UDID |
| `SNAPSHOT_MAX_DEPTH` | `62` | Max view hierarchy depth for snapshots (increase for deeply nested React Native apps) |
| `SNAPSHOT_TIMEOUT` | `50000` | Snapshot timeout in milliseconds |
