# Implementation Plan: Course Onboarding Integration, Enrollment Limits, and In-Progress Unenrollment

**Branch**: `020-course-onboarding-enrollment` | **Date**: 2026-09-24 | **Spec**: [specs/020-course-onboarding-enrollment/spec.md](./spec.md)

**Input**: Feature specification from `/specs/020-course-onboarding-enrollment/spec.md`

## Summary

Integrate course onboarding selection, enforce a configurable maximum limit of active in-progress courses (default: 3), and provide an unenrollment capability strictly for in-progress courses:
1. **Onboarding Auto-Enrollment**: When newly onboarded users select their motivation option ("Manage anxiety", "Lift my mood", "Handle stress better", "Understand myself", "Sleep & rest better"), map to the matching course ID and auto-enroll them as their initial active journey.
2. **Capacity Enforcement**: Centralize `MAX_IN_PROGRESS_COURSES = 3` in `enrollmentConfig.ts`. Completed courses (`status === 'completed'`) do not count. Block new course enrollment on both client and server when active in-progress courses >= limit.
3. **In-Progress Unenrollment**: On `CourseOverviewScreen`, provide a quiet, confirmed unenroll action visible *only* when the course is `in_progress` (hidden for `completed` and not-started courses). When confirmed, remove the progress record, decrement the in-progress count, and fall back active journey focus gracefully if needed.

---

## Technical Context

**Language/Version**: TypeScript 5.x (Strict mode, no `any`) / Node 22  
**Primary Dependencies**: Expo Router, Redux Toolkit, RTK Query, Supabase JS, NativeWind  
**Storage**: Supabase PostgreSQL (`courses`, `user_course_progress`, `user_node_progress`)  
**Testing**: Verification via TypeScript (`npx tsc --noEmit`), dev test screen fixtures, manual flow verification  
**Target Platform**: iOS 26+ (No Android fallbacks per constitution)  
**Project Type**: Mobile Application (React Native / Expo)  
**Performance Goals**: Instant optimistic UI feedback on unenrollment; <500ms network roundtrip  
**Constraints**: Ponytail mode (YAGNI, minimal code, no unnecessary migrations), all touched files <= 300 lines, calm editorial UI tokens  
**Scale/Scope**: 5 motivation options, 5 core CBT courses, configurable capacity threshold  

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. One Learning Job Per Exercise** | ✅ PASS | Core learning interaction unaffected; handles outer journey management. |
| **II. One Active Decision at a Time** | ✅ PASS | Course overview maintains single primary CTA ("Continue journey"), with secondary quiet unenroll opening a dedicated confirmation modal. |
| **III. Resumable, Deterministic State** | ✅ PASS | Unenrolling resets progress cleanly; active course fallback resolves to remaining enrolled course or catalog. |
| **IV. Internal Buttons Update; Only Final Advances** | ✅ PASS | Unenrollment requires explicit dialog confirmation before mutating state. |
| **V. Private Data — Store IDs and State** | ✅ PASS | Only course IDs and enum statuses persisted; no therapeutic copy stored. |
| **VI. Premium, Editorial, Calm Design** | ✅ PASS | Follows `DESIGN.md` tokens; quiet, respectful copy; no harsh red banners or decorative clutter. |
| **VII. Minimal, Ponytail-Mode Code (YAGNI)** | ✅ PASS | Reuses existing tables without adding complex migration columns. Central config for limit. Under 300 lines per file. |

---

## Project Structure

### Documentation (this feature)

```text
specs/020-course-onboarding-enrollment/
├── plan.md              # This implementation plan
├── research.md          # Architectural decisions & rationale
├── data-model.md        # Entities, schemas, and lifecycle state machines
├── contracts/           # API and UI interface definitions
│   ├── course-enrollment-api.ts
│   └── course-catalog-ui-contract.ts
├── checklists/
│   └── requirements.md  # Quality verification checklist
└── quickstart.md        # Verification and testing scenarios
```

### Source Code Impact

```text
src/
├── domains/
│   └── journey/
│       ├── config/
│       │   └── enrollmentConfig.ts                 # NEW: ENROLLMENT_POLICY with MAX_IN_PROGRESS_COURSES
│       ├── data/
│       │   ├── courseServerQueries.ts             # MODIFY: Add unenrollServerCourse query
│       │   └── journeyApi.ts                      # MODIFY: Add useUnenrollCourseMutation & tag invalidation
│       ├── state/
│       │   ├── courseRecommendationSelectors.ts   # Check recommendation eligibility
│       │   └── journeySelectors.ts                # MODIFY: selectInProgressCoursesCount, selectCanEnrollInCourse
│       └── ui/
│           ├── components/
│           │   └── CourseCatalogSheet/
│           │       ├── CourseCatalogSheetContent.tsx # MODIFY: Pass capacity & unenroll props
│           │       └── CourseOverviewScreen.tsx       # MODIFY: Capacity badge + Unenroll action & modal
│           └── hooks/
│               └── useCourseCatalogViewModel.ts       # MODIFY: Wire unenroll action & capacity checks
hooks/
└── data/
    └── useCompleteOnboarding.ts                   # MODIFY: Map motivation option to real course and enroll
supabase/
└── functions/
    ├── start-course/index.ts                      # MODIFY: Enforce MAX_IN_PROGRESS_COURSES check
    └── unenroll-course/index.ts                   # NEW/MODIFY: Edge function or direct RPC to drop in-progress course
```

**Structure Decision**: Fully encapsulated within existing `domains/journey` clean architecture and standard onboarding hooks. No unneeded global state or third-party libraries.

---

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No violations. All design choices conform strictly to Constitution Principles I–VII.*
