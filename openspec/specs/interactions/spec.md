## ADDED Requirements

### Requirement: Tap by ref

The system SHALL tap elements using stored ref data.

#### Scenario: Tap valid ref
- **WHEN** user runs `agent-mobile tap @e1`
- **AND** @e1 exists in current refs
- **THEN** system locates element by stored XPath and clicks it
- **AND** outputs "Tapped @e1 (button: "Sign In")"

#### Scenario: Tap invalid ref
- **WHEN** user runs `agent-mobile tap @e99`
- **AND** @e99 does not exist in current refs
- **THEN** system outputs "Error: Ref @e99 not found. Run: agent-mobile snapshot"

### Requirement: Tap by coordinates

The system SHALL tap at absolute screen coordinates.

#### Scenario: Tap coordinates
- **WHEN** user runs `agent-mobile tap 100,200`
- **THEN** system performs tap action at x=100, y=200
- **AND** outputs "Tapped (100, 200)"

### Requirement: Fill text input

The system SHALL type text into input fields.

#### Scenario: Fill text field
- **WHEN** user runs `agent-mobile fill @e2 "hello world"`
- **AND** @e2 is a text input element
- **THEN** system clears existing value and types "hello world"
- **AND** outputs "Filled @e2 with "hello world""

#### Scenario: Fill without clear
- **WHEN** user runs `agent-mobile fill @e2 "appended" --no-clear`
- **THEN** system types text without clearing existing value

#### Scenario: Fill non-input element
- **WHEN** user runs `agent-mobile fill @e1 "text"`
- **AND** @e1 is not an input element
- **THEN** system outputs "Error: @e1 is not a text input"

### Requirement: Swipe gestures

The system SHALL perform directional swipe gestures.

#### Scenario: Swipe up
- **WHEN** user runs `agent-mobile swipe up`
- **THEN** system performs swipe from bottom-center to top-center (scroll down content)
- **AND** outputs "Swiped up"

#### Scenario: Swipe with custom distance
- **WHEN** user runs `agent-mobile swipe down --distance 25`
- **THEN** system performs swipe covering 25% of screen height

#### Scenario: Invalid direction
- **WHEN** user runs `agent-mobile swipe diagonal`
- **THEN** system outputs "Error: Invalid direction. Use: up, down, left, right"

### Requirement: Screenshot capture

The system SHALL save screenshots to disk.

#### Scenario: Default filename
- **WHEN** user runs `agent-mobile screenshot`
- **THEN** system saves screenshot as `screenshot.png` in current directory
- **AND** outputs "Screenshot saved: /path/to/screenshot.png"

#### Scenario: Custom filename
- **WHEN** user runs `agent-mobile screenshot result.png`
- **THEN** system saves screenshot as `result.png`

#### Scenario: Absolute path
- **WHEN** user runs `agent-mobile screenshot /tmp/test.png`
- **THEN** system saves screenshot to the absolute path
