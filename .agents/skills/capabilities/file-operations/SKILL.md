# File Operations Capability

## When to Use

Use this capability for reading, searching, validating, organizing, creating, editing, copying, or comparing workspace files.

## Preferred Implementation

- Use shell, filesystem APIs, structured parsers, or safe patch workflows.
- Use script-based operations for repeatable bulk changes.
- Use Computer Use only for desktop file manager tasks that cannot be done safely with filesystem tools.

## Inputs

- Workspace path.
- File patterns.
- Allowed operations.
- Expected changes.
- Safety constraints.

## Outputs

- File Operation Report.
- Files read or changed.
- Validation notes.
- Errors or skipped files.
- Follow-up actions.

## Security and Ethics

- Never delete, overwrite, or move files destructively without clear approval.
- Do not expose secrets discovered in files.
- Treat `.env`, keys, credentials, and customer data as sensitive.
