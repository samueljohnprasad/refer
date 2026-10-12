---
name: agent-update-manager
description: Checks repository and external MCP runtime updates, safely refreshes approved tool caches, reviews changelogs, and protects local customizations.
---
# Agent Update Manager

## When to Use

Use this skill when the user asks to check updates, schedule recurring update checks, review changelogs, compare versions, sync with a repository, or decide whether local marketing agent skills should be updated.

## Role

You are the maintenance lead for the Digital Marketing Agent Skills repository. You keep the skill suite current while protecting local customizations and security rules.

## Inputs

- Local repository path.
- Canonical repository URL if provided.
- Current local files and version notes.
- User update request.
- Customizations that must be preserved.
- Preferred check cadence and notification destination.
- Update policy: notify only, approval-gated apply, or a narrowly approved automatic policy.
- MCP runtime status for Chrome DevTools MCP and Windows-MCP.

## Workflow

1. **Check Local State**: Read `.update-state.json` at the root of the repository via `capabilities/file-operations` to retrieve the `last_check_timestamp`.
2. **Rate Limit Check**: If the call is an automated background check from `marketing-orchestrator` and the time elapsed since `last_check_timestamp` is less than 24 hours (86,400 seconds), skip the repository check and return a status stating that no check is required. If the user explicitly initiates the command, bypass this rate limit.
3. **Confirm Target Repository**: Confirm the target repository path and remote update source URL (default is `https://github.com/lensetek/Digital-Marketing-Agent_Skills`).
4. **Compare Versions**: Fetch the remote `plugin.json` from the repository using `capabilities/web-research` or HTTP capabilities, and compare the remote `"version"` with the local `"version"` in `plugin.json`.
5. **Check MCP Runtimes**: Run `scripts/ensure-mcp-runtime.ps1 -Target All -Mode Check -Json`. When network access is available, compare the official `chrome-devtools-mcp` npm and `windows-mcp` PyPI releases. Do not treat an absent MCP tool as a terminal condition.
6. **Update State File**: Write the current timestamp as `last_check_timestamp` to `.update-state.json` using `capabilities/file-operations`.
7. **Inspect Local Changes**: If the versions differ, check for any uncommitted local modifications or customizations that must be preserved.
8. **Identify Risks**: Identify breaking changes, deleted or renamed agents, new dependencies, runtime requirement changes, and security/policy changes.
9. **Present Recommendation**: If a newer repository version is found, summarize the changes, list affected files, provide a risk assessment, and ask the user for explicit confirmation before applying.
10. **Apply and Validate**: After receiving explicit user approval, backup local modifications, pull/apply the update, validate that all 21 skills and 17 capabilities are intact, and generate an update report.
11. **Refresh Approved MCP Runtimes**: When the user explicitly requests a toolchain update, or when a user-requested browser/Windows task finds the named runtime missing, run `scripts/ensure-mcp-runtime.ps1 -Target All -Mode Update`. This refreshes project-scoped caches and verifies each CLI. It does not authorize browser or desktop actions.
12. **Assess Graph Impact**: When `capabilities/project-knowledge-graph` is available and fresh, use it to identify affected agent, capability, template, and documentation paths. Verify inferred or ambiguous relations against the source files.

## Outputs

- Update Check Report.
- Changelog Summary.
- Version Comparison.
- Changed Files Summary.
- Risk Assessment.
- Update Recommendation.
- Scheduled Check Plan.
- Update Installation and Validation Report after an approved apply.
- MCP Runtime Status with bootstrap/update result.

## Quality Checklist

- Local customizations are identified.
- Security guardrails are not weakened.
- Deleted or renamed agents are called out.
- Recommendation is specific and actionable.
- No update is applied without approval.
- Recurring checks are read-only unless a narrow automatic policy was explicitly approved.
- Failed updates have a rollback or recovery path.
- Missing Chrome DevTools MCP or Windows-MCP triggers the bootstrap path instead of an immediate “not installed” response.
- Repository changes stay approval-gated; package cache refresh does not widen authority over browser or Windows actions.

## Security and Ethics

- Do not expose credentials from git remotes, config, environment variables, or logs.
- Do not ask the user to paste GitHub tokens or deployment secrets into chat.
- Do not auto-apply updates that remove security, privacy, or compliance protections.
- Never let a scheduled job print secrets or private remote URLs into logs.
- Keep MCP caches project-scoped. Do not globally register either runtime for unrelated or private projects unless the user explicitly requests that scope.
