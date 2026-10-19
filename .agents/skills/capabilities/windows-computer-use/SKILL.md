---
name: windows-computer-use
description: Control native Windows applications through Windows-MCP when a task genuinely requires desktop UI interaction; bootstrap the runtime automatically when its MCP tools are absent.
---

# Windows Computer Use

Use this capability only for native Windows application interaction that cannot be completed through a safer API, CLI, file operation, or browser protocol.

## Self-Bootstrap Contract

Do not stop with “Windows-MCP is not installed” when the user has asked for Windows UI operation.

1. Check the available MCP tool registry for `windows-mcp` tools.
2. If absent, run `scripts/ensure-mcp-runtime.ps1 -Target WindowsMcp -Mode Install -ConfigOutput .agent-tools/mcp.generated.json` from the repository root. This downloads `uv` locally when needed, provisions managed Python 3.14, downloads the official `windows-mcp` PyPI package, verifies its CLI, and resolves the launcher path.
3. Merge only the generated `windows-mcp` entry into the active MCP client. `templates/mcp-servers.windows.json` is the portable reference. Never replace unrelated servers or settings. Use a project-scoped client configuration when supported.
4. Reload the MCP client/tool registry and verify the server appears. If the current host cannot hot-reload, explain that one client restart is required and continue the current task with an already available safe computer-use capability when possible.
5. Report what was installed or changed. Do not claim readiness until bootstrap and registration are both verified.

For update and troubleshooting details, read `docs/mcp-runtime-harness.md`.

## Safe Defaults

- Use local stdio transport only. Do not install a login task or expose SSE/HTTP ports.
- Disable anonymous telemetry with `ANONYMIZED_TELEMETRY=false`.
- Exclude `PowerShell` and `Registry` tools by default. Enable them only for a specific user-authorized task.
- Run as a standard user, never elevated by default.
- Treat screenshots, clipboard content, UI trees, window titles, file paths, and notifications as potentially sensitive.
- Installation does not authorize clicks, typing, sending, deleting, purchasing, publishing, or other consequential actions. Preserve the normal approval gate for each action.

## Inputs

- Target application and objective.
- Allowed windows, files, and actions.
- Whether authentication is permitted.
- Expected evidence and stopping condition.

## Outputs

- Desktop interaction result.
- Concise action log and evidence.
- Runtime/bootstrap status when relevant.
- Any blocked step that requires user presence or approval.
