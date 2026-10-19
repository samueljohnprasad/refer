---
name: project-knowledge-graph
description: Provides project-isolated Graphify knowledge-graph retrieval and auditable multi-agent handoff without connecting private projects by default.
---

# Project Knowledge Graph

Use this capability when multiple agents need to inspect the same project context, understand relationships between files or concepts, assess change impact, or continue work from a structured handoff. Graphify is the preferred optional adapter; another local knowledge-graph implementation may be used if it preserves the same isolation and evidence contract.

## Input Parameters

- `project_root`: Absolute path of the active project.
- `project_id`: Opaque project identifier, never inferred from another workspace.
- `objective`: The question, dependency, impact, or continuation task.
- `task_id`: Active task identifier when handoff state is involved.
- `allowed_sources`: Explicit file or directory allowlist.
- `isolation_mode`: `isolated` by default; `federated-readonly` only with explicit approval.
- `semantic_backend`: Local or explicitly approved backend for non-code semantic extraction.
- `approval_record`: Required before any cross-project access, graph merge, publication, or external sharing.

## Execution Logic

1. Resolve `project_root` and read `.agent-workspace/project.yaml` when present.
2. Refuse to auto-discover, register, merge, or query another project. Treat every project as private unless its policy says otherwise.
3. Confirm that `project_id`, graph path, source allowlist, and isolation policy match the active workspace.
4. Read `.agent-workspace/task.md` and the active task handoff before continuing another agent's work.
5. Check graph freshness against the current Git commit or source snapshot. If the graph is missing or stale, report it and use raw source inspection until an approved update completes.
6. Query the project-scoped graph through a dedicated Graphify CLI or MCP instance. Prefer `query_graph`, `get_node`, `get_neighbors`, `shortest_path`, `graph_stats`, and approved PR-impact tools.
7. Treat `EXTRACTED` relations as source-backed and verify important `INFERRED` or `AMBIGUOUS` relations against the cited source file.
8. Allow many agents to read the same project graph, but use one writer lease per task or overlapping file set. Do not overwrite another active agent's work.
9. Update the task handoff with owner, status, Git revision, graph revision, completed work, next steps, context nodes, changed files, blockers, and approval state.
10. Refresh the graph after approved source changes or commits. Never use `graphify global add`, `merge-graphs`, or arbitrary MCP `project_path` access automatically.
11. For approved federation, query each project independently and return only the minimum redacted synthesis. Do not copy raw graph data, private source snippets, or durable memory between projects.

## Multi-Agent Continuation Contract

- Knowledge plane: the project-scoped graph provides files, concepts, relationships, paths, and impact evidence.
- Coordination plane: `.agent-workspace/` provides task ownership, status, handoff, leases, decisions, and blockers.
- Memory plane: `capabilities/project-memory-learning` remains authoritative for approved durable facts, preferences, decisions, feedback, and experiments.
- The next agent must validate `project_id`, task ownership, Git revision, and graph freshness before continuing.
- A stale or missing graph never blocks safe raw-file inspection, but the handoff must record the fallback.

## Isolation Modes

### Isolated

- Default for every project, including private projects.
- One graph and one project-scoped MCP boundary.
- No cross-project discovery, query, memory retrieval, or graph merge.
- Use stdio locally when practical. If HTTP is required, bind and authorize the service per project.

### Federated Read-Only

- Requires explicit approval naming every participating project, query purpose, allowed data, retention rule, and expiry.
- Query projects separately; synthesize only the approved minimum result.
- Never grant an agent unrestricted filesystem paths or a workspace-wide `project_path` capability.

## Outputs

- Project Graph Context with source citations.
- Dependency or shortest-path explanation.
- Change-impact report.
- Multi-agent continuation handoff.
- Graph freshness and isolation status.
- Federation approval or refusal report.

## Quality Checklist

- The active project identity is explicit and correct.
- Graph results cite source files and distinguish extracted, inferred, and ambiguous relations.
- Git/source revision and graph revision are recorded.
- Task/file ownership prevents concurrent overwrites.
- Handoff is sufficient for another supported agent runtime to continue.
- No unrelated project context appears in the result.
- Raw source inspection is used when the graph is stale or uncertain.

## Security and Ethics

- Never index `.env` contents, credentials, cookies, session files, private keys, raw customer exports, or unrelated private files.
- Keep `graphify-out/`, `.agent-workspace/`, graph reports, query history, and derived memory private by default.
- Non-code semantic extraction may send approved content to the configured model backend. Use a local backend or a redacted allowlist for sensitive projects.
- Never place Graphify HTTP credentials in HTML, browser JavaScript, public assets, `VITE_*`, `NEXT_PUBLIC_*`, prompts, screenshots, logs, or committed MCP configuration.
- Store server credentials only in server environment variables or an approved secret store.
- A shared HTTP endpoint must use project-scoped authentication, least-privilege filesystem access, and transport security. It must not expose a global list of private projects.

## Related Notes

- [[Graphify Multi-Agent Harness]]
- [[Project Memory and Learning]]
