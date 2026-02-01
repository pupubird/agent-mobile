## ADDED Requirements

### Requirement: CLI entry point

The CLI SHALL be invoked as `agent-mobile <command> [options]`.

#### Scenario: Show help with no arguments
- **WHEN** user runs `agent-mobile` with no arguments
- **THEN** system displays available commands and usage information

#### Scenario: Show version
- **WHEN** user runs `agent-mobile --version`
- **THEN** system displays the current version number

### Requirement: Command routing

The CLI SHALL route to subcommands: `open`, `snapshot`, `tap`, `fill`, `swipe`, `screenshot`, `close`.

#### Scenario: Unknown command
- **WHEN** user runs `agent-mobile unknown-cmd`
- **THEN** system displays error "Unknown command: unknown-cmd" and exits with code 1

#### Scenario: Valid command execution
- **WHEN** user runs `agent-mobile snapshot`
- **THEN** system executes the snapshot command handler

### Requirement: Error output format

The CLI SHALL output errors to stderr in a format suitable for LLM parsing.

#### Scenario: Appium not running
- **WHEN** user runs any command and Appium server is not reachable
- **THEN** system outputs "Error: Cannot connect to Appium at localhost:4723. Start with: appium --port 4723"

#### Scenario: No active session
- **WHEN** user runs `tap @e1` without an active session
- **THEN** system outputs "Error: No active session. Run: agent-mobile open <bundle-id>"
