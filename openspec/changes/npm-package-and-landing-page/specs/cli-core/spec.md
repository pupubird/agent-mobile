## MODIFIED Requirements

### Requirement: CLI entry point

The CLI SHALL be invoked as `agent-mobile <command> [options]`.

#### Scenario: Show help with no arguments
- **WHEN** user runs `agent-mobile` with no arguments
- **THEN** system displays available commands and usage information
- **AND** output is formatted for easy AI parsing (consistent structure)

#### Scenario: Show version
- **WHEN** user runs `agent-mobile --version`
- **THEN** system displays the version from package.json

#### Scenario: Show help for command
- **WHEN** user runs `agent-mobile <command> --help`
- **THEN** system displays detailed help for that command
- **AND** includes argument descriptions and examples
