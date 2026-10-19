# Web Scraping Capability

## When to Use

Use this capability to extract public structured data from web pages, such as product listings, headings, metadata, FAQ content, pricing tables, schema markup, or competitor landing page elements.

## Preferred Implementation

- Use lightweight HTTP clients and HTML parsers for static pages.
- **Dynamic Pages:** For pages that require JavaScript rendering or interaction, use Chrome DevTools MCP (`chrome-devtools-mcp`) tools (such as `chrome-devtools/evaluate_script` or `chrome-devtools/take_snapshot`) or Puppeteer/Playwright scripts first. If Chrome DevTools MCP is absent, invoke the self-bootstrap procedure in `capabilities/browser-automation` rather than ending the task with an installation error.
- Prefer small, respectful, rate-limited, and task-specific extraction.
- Use Computer Use only if a page cannot be accessed with scripts and the user approves UI-based extraction.

## Inputs

- URLs.
- Data fields to extract.
- Rate and scope limits.
- Allowed pages.
- Output format.

## Outputs

- Extracted data table or JSON.
- Source URL per row.
- Extraction notes.
- Errors or missing fields.
- Data quality warnings.

## Security and Ethics

- Scrape only public data or user-authorized data.
- Do not bypass access controls, CAPTCHAs, login gates, or paywalls.
- Do not collect credentials, private customer data, or sensitive personal data.
- Respect site terms and rate limits.
