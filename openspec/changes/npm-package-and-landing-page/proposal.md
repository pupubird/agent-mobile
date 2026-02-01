## Why

agent-mobile works but isn't easily installable. Users can't `npm i -g agent-mobile` to get started, and there's no documentation or landing page to discover the tool. Without proper packaging and visibility, AI coding tools (Claude Code, Cursor, OpenCode) won't know it exists or how to use it.

## What Changes

- Package the CLI for npm registry publication with proper metadata, README, and shebang
- Create a landing page at agent-mobile.dev (similar to agent-browser.dev) with installation instructions, feature highlights, and AI integration examples
- Add `.claude/` configuration to enable Claude Code auto-discovery and skill usage
- Add comprehensive README with quick start, command reference, and AI tool integration guides

## Capabilities

### New Capabilities
- `npm-packaging`: npm registry metadata, binary configuration, prepublish scripts, and distribution files
- `landing-page`: Static site with installation instructions, feature list, command reference, and AI integration examples
- `ai-tool-integration`: Configuration files for Claude Code, Cursor, and other AI tools to auto-discover and use agent-mobile

### Modified Capabilities
- `cli-core`: Add `--help` output optimized for AI parsing, version display from package.json

## Impact

- `package.json`: Add files, homepage, bugs, funding fields; update description
- `README.md`: Comprehensive documentation for npm page and GitHub
- `docs/` or `site/`: Landing page source (likely single HTML or minimal static site)
- `.claude/`: Claude Code skill configuration for auto-discovery
- May need `bin/agent-mobile` wrapper script if shebang handling needs adjustment
