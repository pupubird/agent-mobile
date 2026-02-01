## Context

agent-mobile is a working CLI tool for AI agents to control iOS simulators. The core functionality (open, snapshot, tap, fill, swipe, screenshot, close) is complete. Currently:

- Package.json has basic npm structure but missing key fields for publication
- No README beyond placeholder
- No landing page or documentation site
- No AI tool integration configs (.claude/, etc.)
- Shebang exists in source but needs verification in dist

Reference: agent-browser.dev provides a proven template for developer tool landing pages with dark theme, feature highlights, and installation CTA.

## Goals / Non-Goals

**Goals:**
- Users can `npm i -g agent-mobile` and immediately use the CLI
- Landing page at agent-mobile.dev explains the tool and provides quick start
- Claude Code can auto-discover agent-mobile via .claude/ skill config
- README serves as both npm page and GitHub documentation

**Non-Goals:**
- Android support (iOS only for now)
- Real device support (simulator only)
- Building a complex docs site (single page is sufficient)
- Supporting every AI tool (focus on Claude Code first)

## Decisions

### 1. Landing Page: Single HTML file vs Static Site Generator

**Decision:** Single HTML file with inline CSS

**Rationale:**
- agent-browser.dev uses a simple approach
- No build step, easy to maintain
- Can host on GitHub Pages or Vercel with zero config
- Matches the "simple CLI tool" aesthetic

**Alternatives considered:**
- Docusaurus: Overkill for a single page
- Astro: Good but adds build complexity
- README-only: No custom domain branding

### 2. npm Package Structure

**Decision:** Publish dist/ only with TypeScript types

```
files: ["dist", "README.md", "LICENSE"]
```

**Rationale:**
- Smaller package size (no src/, no tests)
- dist/index.js has shebang from tsc output
- Types included for programmatic use

### 3. AI Tool Integration: .claude/ Skill Config

**Decision:** Create `.claude/skills/agent-mobile/SKILL.md` with command reference

**Rationale:**
- Claude Code auto-discovers skills in .claude/skills/
- SKILL.md format provides structured command help
- Users who clone the repo get the skill automatically

**Alternatives considered:**
- MCP server: More powerful but requires server setup
- Custom instructions: Less discoverable

### 4. Landing Page Hosting

**Decision:** GitHub Pages from /docs folder

**Rationale:**
- Free, built into GitHub
- Custom domain support (agent-mobile.dev)
- No separate deploy needed

**Alternatives considered:**
- Vercel: Slightly better, but overkill
- Netlify: Same as Vercel
- Cloudflare Pages: Good but less familiar

### 5. README Structure

**Decision:** Mirror agent-browser README structure

Sections:
1. Headline + description
2. Installation
3. Quick Start (3-step example)
4. Commands reference
5. AI Integration section
6. Prerequisites (Appium, simulator)

**Rationale:** Proven structure from agent-browser, familiar to target users.

## Risks / Trade-offs

**Risk:** Appium/XCUITest complexity scares users
→ Mitigation: Clear prerequisites section, consider future "appium auto-setup" command

**Risk:** npm package name `agent-mobile` may be taken
→ Mitigation: Check availability first; fallback to `@anthropic/agent-mobile` or `agent-mobile-cli`

**Risk:** Landing page becomes stale vs README
→ Mitigation: Keep landing page minimal, link to README for full docs

**Risk:** Claude Code skill format may change
→ Mitigation: Follow current conventions, update as needed

## Open Questions

1. **Domain:** Is agent-mobile.dev available? Alternatives: agentmobile.dev, agent-mobile.io
2. **npm scope:** Publish as `agent-mobile` or `@pupubird/agent-mobile`?
3. **License:** MIT is set, confirm this is intended
