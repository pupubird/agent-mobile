## ADDED Requirements

### Requirement: Landing page content

The system SHALL provide a landing page with essential information.

#### Scenario: Page sections
- **WHEN** user visits agent-mobile.dev
- **THEN** page displays:
  - Headline describing the tool
  - Installation command (`npm i -g agent-mobile`)
  - Feature highlights (refs pattern, commands, AI integration)
  - Quick start example
  - Link to GitHub repository

### Requirement: Installation command display

The system SHALL prominently display the installation command.

#### Scenario: Copy-able install command
- **WHEN** user views the landing page
- **THEN** `npm install -g agent-mobile` is displayed prominently
- **AND** command is in a code block for easy copying

### Requirement: Feature highlights

The system SHALL list key features of the tool.

#### Scenario: Feature list content
- **WHEN** user views features section
- **THEN** page highlights:
  - Refs pattern (@e1, @e2) for LLM-friendly interaction
  - Available commands (open, snapshot, tap, fill, swipe, screenshot, close)
  - AI tool compatibility (Claude Code, Cursor, etc.)
  - iOS simulator automation via Appium

### Requirement: Quick start example

The system SHALL show a practical usage example.

#### Scenario: Example workflow
- **WHEN** user views quick start section
- **THEN** page shows a 3-step example:
  1. `agent-mobile open com.apple.Preferences`
  2. `agent-mobile snapshot`
  3. `agent-mobile tap @e1`

### Requirement: GitHub Pages hosting

The system SHALL be hostable on GitHub Pages.

#### Scenario: Docs folder structure
- **WHEN** repository is configured for GitHub Pages
- **THEN** docs/index.html serves as the landing page
- **AND** custom domain agent-mobile.dev can be configured
