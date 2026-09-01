# Research: Clear Space Guided Discovery

## Component Identification

- **Decision**: Refactor `ToolkitShelfCategoryEngine.tsx`.
- **Rationale**: A codebase search identified that `ToolkitShelfCategoryEngine.tsx` is the component responsible for rendering a top horizontal carousel of "tools" and a bottom list of "moments", perfectly matching the user's description of the "Four valid ways to clear space" interaction. It contains the exact string "PICK A MOMENT".
- **Alternatives considered**: Investigated other components (`GuidedDiscoveryTrail`, `SymptomDecoder`, `LeverMatch`), but they did not match the UI structure or copy described in the audit.

## Content Schema & Mapping

- **Decision**: Preserve the existing `ToolkitMoment` and `ToolkitTool` schema in the engine.
- **Rationale**: The backend CMS currently sends data in this format (tools array, moments array). We do not need to change the data schema to change the presentation. We can simply stop rendering the `tools` array as a carousel in State 1, and only look up the relevant tool in State 2 using `selectedMoment.toolIndex` or `selectedMoment.key`.
- **Alternatives considered**: Updating the data schema to embed tools inside moments, but this would require backend/CMS changes which are out of scope for a frontend UI/UX presentation refactor.
