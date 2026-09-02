# Oxlint complexity integration

- [x] Measure current complexity violations at practical thresholds.
- [x] Install the current Oxlint release as an npm development dependency.
- [x] Add a root Oxlint configuration with the ESLint-compatible complexity rule.
- [x] Add lint and focused complexity scripts without replacing existing tooling.
- [x] Run Oxlint, verify package metadata, check the diff, and refresh Graphify.
- [x] Enforce a maximum complexity of 2 and record the resulting baseline.

## Baseline

- `npm run lint`: passes and reports complexity as warnings.
- `npm run lint:complexity:strict`: intentionally fails on 2,220 existing functions above complexity 2.
- Complexity uses the `modified` variant so a switch counts as one branch rather than one branch per case.
