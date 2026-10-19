# Document Processing Capability

## When to Use

Use this capability for DOCX, PDF, Markdown, and text document extraction, formatting, review, summarization, redlining, and deliverable generation.

## Preferred Implementation

- Use document parsers, PDF tools, DOCX libraries, or available document plugins.
- Render and visually verify important final documents when layout matters.
- Use Computer Use only for desktop office UI workflows that cannot be handled by file libraries or connectors.

## Inputs

- Document path or source.
- Task objective.
- Formatting requirements.
- Output format.
- Sensitive data handling rules.

## Outputs

- Extracted Text or Structured Notes.
- Edited Document.
- Review Findings.
- Rendered QA notes when needed.
- Exported deliverable.

## Security and Ethics

- Do not leak private document contents.
- Redact sensitive personal, customer, financial, credential, or internal data when requested or required.
- Do not fabricate citations or document evidence.
