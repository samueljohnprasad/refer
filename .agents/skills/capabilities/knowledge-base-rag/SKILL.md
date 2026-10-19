# Knowledge Base / RAG Capability

## When to Use

Use this capability for indexing documents, retrieving relevant context, building grounded answers, maintaining a project knowledge base, and citing evidence from approved files.

## Preferred Implementation

- Use local indexing, embeddings, vector stores, keyword search, or connector search depending on available tools.
- Use `project-knowledge-graph` when the task depends on relationships, dependency paths, graph traversal, change impact, or multi-agent continuation rather than semantic similarity alone.
- Prefer source-grounded retrieval before generation.
- Use Computer Use only when the knowledge source is accessible only through a visual UI and user approves.

## Inputs

- Approved document set.
- Query or task.
- Retrieval scope.
- Citation requirements.
- Sensitive data rules.

## Outputs

- Retrieved Evidence.
- Grounded Answer.
- Source Citations.
- Knowledge Gap Notes.
- Index or Refresh Report.

## Security and Ethics

- Do not index secrets, credentials, raw customer-sensitive data, or private files without approval.
- Do not present unsupported statements as sourced facts.
- Keep citations tied to actual retrieved evidence.
- Use `project-memory-learning` for approved preferences, decisions, and experiment history; use this capability for document retrieval and grounded evidence.
- Keep each project's index and graph separate by default. Do not use a global index to silently connect private projects.
