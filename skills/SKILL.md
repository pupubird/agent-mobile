---
name: agent-mobile
description: iOS simulator automation CLI. Use when user needs to control iOS apps, tap buttons, fill forms, take screenshots, or automate mobile interactions. Triggers on: mobile, iOS, simulator, app, tap, swipe.
---

# agent-mobile

Control iOS simulators for testing, form filling, screenshots, and automation.

## Prerequisites

- **macOS with Xcode** installed
- Run `agent-mobile setup` for first-time configuration

Boot an iOS simulator:
```bash
xcrun simctl boot "iPhone 16 Pro" && open -a Simulator
```

## Workflow

1. `agent-mobile open <bundle-id>` - Launch app
2. `agent-mobile snapshot` - Get UI elements as refs (@e1, @e2)
3. `agent-mobile tap @e1` or `fill @e2 "text"` - Interact
4. Re-snapshot after screen changes (refs become stale)

## Commands

| Command | Description |
|---------|-------------|
| `open <bundle-id>` | Launch app (e.g., `com.apple.calculator`) |
| `snapshot` | Get interactive elements with refs |
| `snapshot --depth 80` | Increase depth for React Native apps |
| `snapshot --timeout 60000` | Increase timeout for complex screens |
| `tap <ref>` | Tap by ref (`@e1`) or coordinates (`100,200`) |
| `fill <ref> "text"` | Type into text field |
| `swipe <direction>` | Swipe up/down/left/right |
| `screenshot [file]` | Save screenshot |
| `close` | End session |
| `setup` | First-time setup (Xcode, simulators, WDA) |
| `doctor` | Check system requirements |

## Example: Calculator

```bash
agent-mobile open com.apple.calculator
agent-mobile snapshot
# @e1 button "1"
# @e2 button "2"
# @e3 button "+"
# @e4 button "="

agent-mobile tap @e1    # tap "1"
agent-mobile tap @e3    # tap "+"
agent-mobile tap @e2    # tap "2"
agent-mobile tap @e4    # tap "="
agent-mobile screenshot result.png
agent-mobile close
```

## Common Bundle IDs

| App | Bundle ID |
|-----|-----------|
| Calculator | `com.apple.calculator` |
| Safari | `com.apple.mobilesafari` |
| Settings | `com.apple.Preferences` |
| Notes | `com.apple.mobilenotes` |

## Troubleshooting

### React Native apps: Empty or incomplete snapshots

React Native apps have deeply nested view hierarchies (60+ levels). Use increased depth:

```bash
agent-mobile snapshot --depth 80
agent-mobile snapshot --timeout 60000
```

## Tips

- Always re-snapshot after navigation or taps that change the screen
- Use `snapshot --all` to see non-interactive elements
- Swipe to scroll content into view before tapping
- Run `agent-mobile doctor` to diagnose issues
