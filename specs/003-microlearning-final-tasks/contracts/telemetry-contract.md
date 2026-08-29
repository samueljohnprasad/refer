# Microlearning Telemetry Contract

## `trackMicrolearningEvent`

**Function Signature**:
```typescript
function trackMicrolearningEvent(event: MicrolearningTelemetryEvent): void;
```

**Responsibilities**:
1. Take a fully formed `MicrolearningTelemetryEvent`.
2. Append device/session ambient context (timestamp, user ID).
3. Validate that NO properties named `text`, `label`, `feedback`, or similar string fields exist inside the event payload to structurally guarantee privacy.
4. Dispatch to `logger.info` under the `microlearning:analytics` namespace.

**Usage Rules**:
- **Hydration Bypass**: React components using this must wrap calls in a `useEffect` guarded by a `useRef` (e.g., `hasTrackedView.current = true`) so that when the app restarts and resumes from disk, the hydration frame does not fire a duplicate `stage_view` event.
