## 1. npm Package Setup

- [x] 1.1 Update package.json with complete metadata (homepage, bugs, files array)
- [x] 1.2 Create LICENSE file with MIT license text
- [x] 1.3 Verify shebang in src/index.ts compiles to dist/index.js correctly
- [x] 1.4 Test `npm pack` to verify package contents (only dist/, README.md, LICENSE)

## 2. README Documentation

- [x] 2.1 Write README.md with headline and one-line description
- [x] 2.2 Add Installation section with npm install command
- [x] 2.3 Add Quick Start section with 3-step example workflow
- [x] 2.4 Add Commands Reference section documenting all 7 commands
- [x] 2.5 Add Prerequisites section (Appium, iOS simulator, Xcode)
- [x] 2.6 Add AI Integration section explaining Claude Code skill usage

## 3. Landing Page

- [x] 3.1 Create docs/ directory for GitHub Pages
- [x] 3.2 Create docs/index.html with dark theme styling (inline CSS)
- [x] 3.3 Add hero section with headline and install command
- [x] 3.4 Add features section highlighting refs pattern and AI compatibility
- [x] 3.5 Add quick start example section
- [x] 3.6 Add footer with GitHub link
- [x] 3.7 Create docs/CNAME file for custom domain (agent-mobile.dev)

## 4. Claude Code Skill

- [x] 4.1 Create .claude/skills/agent-mobile/ directory
- [x] 4.2 Write SKILL.md with tool description and command reference
- [x] 4.3 Add example workflows to SKILL.md
- [x] 4.4 Add prerequisites note about Appium server

## 5. CLI Enhancements

- [x] 5.1 Update --help output to be AI-friendly (consistent format)
- [x] 5.2 Ensure --version reads from package.json dynamically
- [x] 5.3 Add --help for each subcommand with examples

## 6. Validation

- [x] 6.1 Run `npm pack` and inspect tarball contents
- [x] 6.2 Test global installation from local tarball
- [x] 6.3 Verify agent-mobile command works after global install
- [x] 6.4 Test landing page locally (open docs/index.html in browser)
- [x] 6.5 Verify Claude Code skill loads when project is opened
