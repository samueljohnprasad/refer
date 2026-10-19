---
name: browser-automation
description: Inspect, automate, debug, and test browser experiences through Chrome DevTools MCP, automatically bootstrapping the official runtime when its MCP tools are absent.
---

# Browser Automation Capability

## When to Use

Use this capability for opening pages, navigating web apps, clicking UI, filling forms, taking screenshots, testing landing pages, checking responsive behavior, and verifying served frontend behavior.

## Preferred Implementation

- **Chrome DevTools MCP (`chrome-devtools-mcp`):** Use the `chrome-devtools` MCP server tools (e.g., `chrome-devtools/navigate_page`, `chrome-devtools/click`, `chrome-devtools/take_screenshot`) as the primary method for browser automation.
  - **Responsive Testing:** Always use `chrome-devtools/emulate` or `chrome-devtools/resize_page` to verify page layouts using a **mobile-view first** approach.
  - **Performance & QA:** Use performance tracing or Lighthouse audits to verify loading speed.
  - **Credential Safety:** Ensure that browser sessions do not cache sensitive credentials (e.g., run the server with `--isolated` or avoid saving cookies/auth headers in public scopes) to prevent credential leaks.
- Use programmatic scripts (e.g., Puppeteer, Playwright) or in-app connectors when repeatable, custom QA flows are required.
- Use OS-level Computer Use only as a last resort if standard API/protocol-based automation fails.

## Self-Bootstrap Contract

Do not stop with “Chrome DevTools MCP is not installed” when the user has requested browser operation.

1. Check the available MCP tool registry for `chrome-devtools` tools.
2. If absent, run `scripts/ensure-mcp-runtime.ps1 -Target ChromeDevTools -Mode Install -ConfigOutput .agent-tools/mcp.generated.json` from the repository root. The script validates Node.js and Chrome, downloads the official npm package into a project-scoped cache, verifies its executable, and resolves the Windows launcher path.
3. Merge only the generated `chrome-devtools` entry into the active MCP client. `templates/mcp-servers.windows.json` is the portable reference. Never replace unrelated configuration and prefer project scope where supported.
4. Reload the MCP tool registry and make a harmless verification call such as listing pages. If the client cannot hot-reload, state that one restart is required and use an already available browser automation fallback for the current turn when possible.
5. Report what was installed or changed. Do not claim the MCP server is usable until both package verification and client registration succeed.

Read `docs/mcp-runtime-harness.md` for update behavior, platform notes, and troubleshooting.

## Inputs

- URL or local file path.
- Objective.
- Viewport/device targets.
- Allowed actions.
- Credentials policy and login state.
- Expected evidence: screenshot, notes, or test result.

## Outputs

- Browser QA Report.
- Screenshots or visual findings.
- Interaction log.
- Broken links, console errors, layout issues, or accessibility concerns.
- Recommendation and next action.

## Security and Ethics

- Do not enter secrets unless the user explicitly approves a secure login flow.
- Do not expose cookies, tokens, private URLs, or account details in reports.
- Treat public frontend, browser JavaScript, and public assets as non-secret surfaces.
- Use `--isolated`, `--no-usage-statistics`, `--no-performance-crux`, and `--redact-network-headers` by default. Do not attach to a personal Chrome profile unless the user explicitly authorizes that session.
