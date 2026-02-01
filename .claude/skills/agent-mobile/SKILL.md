# Mobile Automation - agent-mobile

Control iOS simulators with simple commands. Use for mobile app testing, UI automation, and visual debugging.

## Prerequisites

**Appium server must be running** before using these commands:

```bash
# Start Appium (run in separate terminal)
appium
```

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
agent-mobile snapshot           # Interactive elements only
agent-mobile snapshot -a        # All elements
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

## Tips

- Always run `snapshot` after navigation to get fresh refs
- Refs (`@e1`, `@e2`) are session-specific and change after each snapshot
- Use coordinates (`tap 100,200`) when refs aren't available
- Take screenshots for visual debugging: `screenshot /tmp/debug.png`
