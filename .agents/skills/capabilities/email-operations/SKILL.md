# Email Operations Capability

## When to Use

Use this capability for drafting, reviewing, QAing, preparing, scheduling, or sending email campaigns and lifecycle messages.

## Preferred Implementation

- Use email APIs/connectors only after explicit approval.
- Draft and QA by default; sending is a gated action.
- Use Computer Use only for email UI workflows that require logged-in manual interaction and user approval.

## Inputs

- Audience segment.
- Email objective.
- Draft copy or campaign plan.
- Sending platform if relevant.
- Approval status.
- Compliance requirements.

## Outputs

- Email Draft.
- QA Checklist.
- Subject Line Variants.
- Segment and Suppression Notes.
- Send Readiness Report.

## Security and Ethics

- Never expose email lists, customer records, tokens, SMTP credentials, or CRM exports.
- Do not send email without explicit approval.
- Respect opt-out, consent, anti-spam, and platform rules.
