## ADDED Requirements

### Requirement: Accessibility tree retrieval

The system SHALL retrieve the iOS accessibility tree via Appium's getPageSource.

#### Scenario: Get page source
- **WHEN** user runs `agent-mobile snapshot`
- **THEN** system calls driver.getPageSource() to get XML accessibility tree

### Requirement: Element ref assignment

The system SHALL assign sequential refs (@e1, @e2, ...) to UI elements.

#### Scenario: Assign refs to elements
- **WHEN** accessibility tree contains 5 interactive elements
- **THEN** system assigns refs @e1 through @e5 in document order

#### Scenario: Reset refs on new snapshot
- **WHEN** user runs `agent-mobile snapshot` again
- **THEN** system reassigns refs starting from @e1 (previous refs invalidated)

### Requirement: Interactive element filtering

The system SHALL filter to interactive elements by default.

#### Scenario: Default interactive filter
- **WHEN** user runs `agent-mobile snapshot`
- **THEN** system only includes elements that are enabled AND (clickable OR focusable OR editable)

#### Scenario: Show all elements
- **WHEN** user runs `agent-mobile snapshot --all`
- **THEN** system includes all elements regardless of interactivity

### Requirement: Compact output format

The system SHALL output refs in a compact, LLM-friendly format.

#### Scenario: Standard element output
- **WHEN** element is a button with label "Sign In"
- **THEN** output line is `@e1 button "Sign In"`

#### Scenario: Element with current value
- **WHEN** element is a text field with label "Email" and value "user@example.com"
- **THEN** output line is `@e2 textField "Email" [user@example.com]`

#### Scenario: Element without label
- **WHEN** element has no accessibility label
- **THEN** output line uses type only: `@e3 button`

### Requirement: Element type mapping

The system SHALL map iOS element types to short names.

#### Scenario: Type mappings
- **WHEN** element type is `XCUIElementTypeButton`
- **THEN** output uses `button`
- **WHEN** element type is `XCUIElementTypeTextField`
- **THEN** output uses `textField`
- **WHEN** element type is `XCUIElementTypeStaticText`
- **THEN** output uses `staticText`
- **WHEN** element type is `XCUIElementTypeSwitch`
- **THEN** output uses `switch`
