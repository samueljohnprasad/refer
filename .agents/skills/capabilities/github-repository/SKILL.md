# GitHub Repository Capability

## When to Use

Use this capability for repository inspection, issue/PR review, changelog review, release checks, branch comparison, dependency review, and update planning.

## Preferred Implementation

- Use GitHub connector, `gh`, or git CLI when available.
- Use `project-knowledge-graph` as an optional project-scoped adapter for dependency paths and PR/change-impact analysis when a fresh graph is available.
- Use read-only inspection before making changes.
- Use Computer Use only if GitHub web UI interaction is required and the user approves.

## Inputs

- Repository URL or local path.
- Objective.
- Branch or PR reference.
- Allowed actions.
- Files or areas of interest.

## Outputs

- Repository Summary.
- Issue or PR Findings.
- Changed Files Summary.
- Update Recommendation.
- Risks and approval needs.

## Security and Ethics

- Do not expose tokens, remotes with credentials, CI secrets, environment values, or private repo data.
- Do not ask the user to paste GitHub tokens into chat.
- Do not push, merge, or change repository state without approval.
- Do not use Graphify global registration, graph merging, or arbitrary `project_path` access to inspect another private repository.
