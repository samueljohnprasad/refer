# Data Model & Interfaces: Interactive Reframe Correct/Wrong States

## Entities

### `InteractiveReframeEngineState` (Local Component State)

This represents the internal React state of the `InteractiveReframeCategoryEngine` component.

```typescript
type EngineStep = 
  | 0 // Initial choice
  | 1 // Revealing consequence cascade (correct or wrong)
  | 2 // Post-cascade correct (Notice what changed)
  | 3 // Post-cascade correct (Final takeaway)

type SelectedPath = 'correct' | 'wrong' | null;
```

**State Transitions**:
- `step: 0, selectedPath: null` (Initial state)
- User selects "Try harder tonight" -> `step: 1, selectedPath: 'wrong'`
- Cascade finishes -> User clicks "Try another reading" -> `step: 0, selectedPath: null`
- User selects "What might have shifted" -> `step: 1, selectedPath: 'correct'`
- Correct cascade finishes -> User clicks "Reframe It" -> `step: 2, selectedPath: 'correct'`
- User clicks "Follow the new reading" -> `step: 3, selectedPath: 'correct'` (Triggers `onInteraction` complete)

## Interface Contracts

*No external API or backend contracts are modified in this feature. All state changes are managed locally within the React Native component until the exercise is marked complete, at which point it uses the existing `onInteraction` callback.*
