## 1. npm Package Setup

- [ ] 1.1 Update package.json with complete metadata (homepage, bugs, files array)
- [ ] 1.2 Create LICENSE file with MIT license text
- [ ] 1.3 Verify shebang in src/index.ts compiles to dist/index.js correctly
- [ ] 1.4 Test `npm pack` to verify package contents (only dist/, README.md, LICENSE)

## 2. README Documentation

- [ ] 2.1 Write README.md with headline and one-line description
- [ ] 2.2 Add Installation section with npm install command
- [ ] 2.3 Add Quick Start section with 3-step example workflow
- [ ] 2.4 Add Commands Reference section documenting all 7 commands
- [ ] 2.5 Add Prerequisites section (Appium, iOS simulator, Xcode)
- [ ] 2.6 Add AI Integration section explaining Claude Code skill usage

## 3. Landing Page

- [ ] 3.1 Create docs/ directory for GitHub Pages
- [ ] 3.2 Create docs/index.html with dark theme styling (inline CSS)
- [ ] 3.3 Add hero section with headline and install command
- [ ] 3.4 Add features section highlighting refs pattern and AI compatibility
- [ ] 3.5 Add quick start example section
- [ ] 3.6 Add footer with GitHub link
- [ ] 3.7 Create docs/CNAME file for custom domain (agent-mobile.dev)

## 4. Claude Code Skill

- [ ] 4.1 Create .claude/skills/agent-mobile/ directory
- [ ] 4.2 Write SKILL.md with tool description and command reference
- [ ] 4.3 Add example workflows to SKILL.md
- [ ] 4.4 Add prerequisites note about Appium server

## 5. CLI Enhancements

- [ ] 5.1 Update --help output to be AI-friendly (consistent format)
- [ ] 5.2 Ensure --version reads from package.json dynamically
- [ ] 5.3 Add --help for each subcommand with examples

## 6. Validation

- [ ] 6.1 Run `npm pack` and inspect tarball contents
- [ ] 6.2 Test global installation from local tarball
- [ ] 6.3 Verify agent-mobile command works after global install
- [ ] 6.4 Test landing page locally (open docs/index.html in browser)
- [ ] 6.5 Verify Claude Code skill loads when project is opened
