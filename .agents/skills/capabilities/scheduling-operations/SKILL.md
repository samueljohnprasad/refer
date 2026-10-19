# Scheduling Operations Capability

## When to Use

Use this capability for campaign calendars, reminders, publishing schedules, meeting scheduling, follow-up cadences, and automation timing plans.

## Preferred Implementation

- Use calendar connectors, scheduling APIs, or local schedule files when available.
- Draft schedules first; creating calendar events or live reminders is a gated action.
- Use Computer Use only when a scheduling UI must be operated manually.

## Inputs

- Schedule objective.
- Timezone.
- Date range.
- Cadence.
- Participants or channels.
- Approval status.

## Outputs

- Campaign Schedule.
- Content Calendar Timing.
- Reminder Plan.
- Calendar Event Drafts.
- Approval Gate Notes.

## Security and Ethics

- Do not expose private calendar details, meeting links, attendee emails, or scheduling tokens.
- Confirm timezone and date assumptions.
- Do not create or send invites without approval.
