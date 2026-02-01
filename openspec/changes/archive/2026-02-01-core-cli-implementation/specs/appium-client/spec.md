## ADDED Requirements

### Requirement: Appium connection

The system SHALL connect to Appium server via WebDriverIO.

#### Scenario: Default connection
- **WHEN** no environment variables are set
- **THEN** system connects to `http://localhost:4723`

#### Scenario: Custom host and port
- **WHEN** `APPIUM_HOST` and `APPIUM_PORT` environment variables are set
- **THEN** system connects to the specified host and port

### Requirement: Session creation

The system SHALL create an Appium session with XCUITest capabilities for iOS.

#### Scenario: Open app by bundle ID
- **WHEN** user runs `agent-mobile open com.apple.calculator`
- **THEN** system creates session with `appium:bundleId: com.apple.calculator`
- **AND** outputs "Session started: <session-id>"

#### Scenario: Specify device name
- **WHEN** user runs `agent-mobile open com.apple.calculator -d "iPhone 15"`
- **THEN** system creates session with `appium:deviceName: iPhone 15`

### Requirement: Session reuse

The system SHALL reuse existing session if valid.

#### Scenario: Reconnect to existing session
- **WHEN** session file exists with valid session ID
- **AND** user runs a command
- **THEN** system attaches to existing session instead of creating new one

#### Scenario: Invalid session cleanup
- **WHEN** session file exists but session ID is invalid (Appium restarted)
- **THEN** system deletes stale session file and prompts user to run `open` again

### Requirement: Session termination

The system SHALL properly close Appium session on `close` command.

#### Scenario: Close active session
- **WHEN** user runs `agent-mobile close`
- **THEN** system calls deleteSession on Appium
- **AND** removes session file
- **AND** outputs "Session closed"
