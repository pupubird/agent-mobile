## ADDED Requirements

### Requirement: Session file location

The system SHALL store session data in `/tmp/agent-mobile-session.json`.

#### Scenario: Session file created on open
- **WHEN** user runs `agent-mobile open com.apple.calculator`
- **THEN** system creates `/tmp/agent-mobile-session.json` with session data

#### Scenario: Session file removed on close
- **WHEN** user runs `agent-mobile close`
- **THEN** system deletes `/tmp/agent-mobile-session.json`

### Requirement: Session data structure

The system SHALL persist session ID, connection info, and refs.

#### Scenario: Session file contents
- **WHEN** session is active with refs
- **THEN** session file contains:
  - `sessionId`: Appium session ID
  - `appiumUrl`: Connection URL
  - `deviceName`: Device name
  - `bundleId`: App bundle ID
  - `refs`: Map of ref to element data

### Requirement: Refs persistence

The system SHALL persist refs between CLI invocations.

#### Scenario: Refs available after snapshot
- **WHEN** user runs `agent-mobile snapshot`
- **THEN** refs are written to session file
- **AND** subsequent `agent-mobile tap @e1` can read the ref

#### Scenario: Refs cleared on new snapshot
- **WHEN** user runs `agent-mobile snapshot` again
- **THEN** previous refs are replaced with new refs

### Requirement: Session validation

The system SHALL validate session on each command.

#### Scenario: Valid session
- **WHEN** session file exists and session ID is valid with Appium
- **THEN** command proceeds normally

#### Scenario: Expired session
- **WHEN** session file exists but Appium returns "invalid session id"
- **THEN** system deletes session file
- **AND** outputs "Error: Session expired. Run: agent-mobile open <bundle-id>"

#### Scenario: No session file
- **WHEN** session file does not exist
- **AND** command requires session (tap, fill, swipe, snapshot, screenshot)
- **THEN** system outputs "Error: No active session. Run: agent-mobile open <bundle-id>"
