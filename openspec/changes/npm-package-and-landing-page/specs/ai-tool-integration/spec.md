## ADDED Requirements

### Requirement: Claude Code skill configuration

The system SHALL provide a Claude Code skill for auto-discovery.

#### Scenario: Skill file location
- **WHEN** user clones the repository
- **THEN** `.claude/skills/agent-mobile/SKILL.md` exists
- **AND** Claude Code recognizes it as an available skill

#### Scenario: Skill content
- **WHEN** Claude Code loads the skill
- **THEN** SKILL.md contains:
  - Tool description
  - Available commands with usage
  - Example workflows
  - Prerequisites (Appium server)

### Requirement: Command reference in skill

The system SHALL document all commands in the skill file.

#### Scenario: Command documentation
- **WHEN** AI reads the skill file
- **THEN** each command is documented with:
  - Syntax and arguments
  - Example usage
  - Expected output format

### Requirement: README AI integration section

The system SHALL document AI tool integration in README.

#### Scenario: Integration instructions
- **WHEN** user reads README
- **THEN** README includes section explaining:
  - How Claude Code discovers the skill
  - How to use agent-mobile from AI coding assistants
  - Example prompts for AI tools
