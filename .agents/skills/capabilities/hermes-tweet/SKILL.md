# Hermes Tweet X/Twitter Capability

## When to Use

Use this capability when a marketing agent needs X/Twitter research, social listening, tweet or profile lookup, campaign source collection, approved draft preparation, or approval-gated publishing support through the Hermes Tweet plugin.

## Preferred Implementation

- Use the Hermes Tweet plugin from https://github.com/Xquik-dev/hermes-tweet when it is installed and configured in the agent runtime.
- Start with read and explore workflows for research, monitoring, trend review, creator discovery, and campaign evidence.
- Use write actions only after explicit user approval, clear brand rules, and an approved action boundary.
- If Hermes Tweet is not installed or configured, return setup guidance and do not invent platform data.

## Inputs

- Campaign objective and target audience.
- Brand voice, compliance rules, and escalation rules.
- X/Twitter accounts, keywords, hashtags, URLs, or tweet IDs to inspect.
- Allowed action scope: read-only, draft-only, or approved publishing.
- Required output format and citation expectations.

## Outputs

- X/Twitter Research Brief.
- Source list with tweet, profile, keyword, or hashtag references.
- Audience and trend notes.
- Draft caption, reply, or thread options when requested.
- Approval checklist for any action that changes public platform state.
- Risk notes for claims, sensitive topics, spam patterns, and brand safety.

## Security and Ethics

- Do not ask for API keys, passwords, tokens, cookies, or private account material in prompts.
- Do not publish, reply, like, repost, follow, unfollow, or message without explicit approval.
- Do not automate fake engagement, deceptive amplification, scraping of private communities, or harassment.
- Redact personal data that is not needed for the marketing decision.
- Escalate legal, safety, health, finance, or sensitive personal-data topics before any public response.
