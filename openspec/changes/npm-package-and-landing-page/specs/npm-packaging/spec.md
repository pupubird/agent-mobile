## ADDED Requirements

### Requirement: Global installation

The system SHALL be installable globally via npm.

#### Scenario: Install from npm registry
- **WHEN** user runs `npm install -g agent-mobile`
- **THEN** the `agent-mobile` command becomes available in PATH
- **AND** running `agent-mobile --version` displays the package version

### Requirement: Package metadata

The system SHALL include complete npm package metadata.

#### Scenario: Package.json fields
- **WHEN** package is published to npm
- **THEN** package.json includes:
  - `name`: "agent-mobile"
  - `description`: Clear one-line description
  - `keywords`: mobile, automation, ios, appium, ai, agent, cli
  - `homepage`: URL to landing page
  - `repository`: GitHub repository URL
  - `bugs`: GitHub issues URL
  - `license`: MIT
  - `engines`: node >= 18.0.0

### Requirement: Minimal package contents

The system SHALL publish only essential files to npm.

#### Scenario: Files included in package
- **WHEN** package is published
- **THEN** package contains only: dist/, README.md, LICENSE
- **AND** package excludes: src/, tests/, node_modules/, .claude/

### Requirement: Executable shebang

The system SHALL include proper shebang for cross-platform execution.

#### Scenario: Shebang in compiled output
- **WHEN** package is built with `npm run build`
- **THEN** dist/index.js starts with `#!/usr/bin/env node`
- **AND** file is executable on Unix systems

### Requirement: Prepublish build

The system SHALL automatically build before publishing.

#### Scenario: Build on publish
- **WHEN** user runs `npm publish`
- **THEN** prepublishOnly script runs `npm run build`
- **AND** dist/ contains fresh compiled output
