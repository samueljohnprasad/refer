# Content Contracts

The JSON payloads from the server (or static fixtures) must strictly conform to the `WhatIfContent` and `CheckpointContent` TypeScript interfaces defined in `data-model.md`. 

The central validation function `validateMicrolearningContent` will be updated to route to:
1. `validateWhatIfContent(content)`
2. `validateCheckpointContent(content)`

If validation fails, the engines must return `null` so the `NodeExerciseDataError` boundary catches the malformed data.
