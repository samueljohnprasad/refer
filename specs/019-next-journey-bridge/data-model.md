# Data Model: Next Journey Bridge

*Note: This feature is primarily client-side state orchestration and UI. There are no schema migrations needed.*

## 1. Domain Types

### `NextCourseRecommendation`
Represented in the journey state domain to decouple recommendation business logic from the UI view.

```typescript
export interface NextCourseRecommendation {
  /** True if the currently viewed course is 100% completed */
  isCompleted: boolean;

  /** The recommended next Course entity (lowest order_index uncompleted course) */
  nextCourse: Course | null;

  /** True if the user has completed all published courses in the catalog */
  isAllCoursesCompleted: boolean;
}
```

## 2. State Lifecycle Transitions

```
                 [ User Completes Final Node ]
                               |
                               v
                     [ Course Celebration ]
                               |
                   (user taps "Continue")
                               |
                               v
             +------------------------------------+
             |   Active Course Status: COMPLETED   |
             +------------------------------------+
                               |
               (evaluate recommendation selector)
                               |
             +-----------------+------------------+
             |                                    |
             v                                    v
     [ nextCourse != null ]            [ isAllCoursesCompleted ]
             |                                    |
             v                                    v
  Render "Next Journey: Title"          Render "All Caught Up! 🌟"
  CTA: "Start [Next Course]"            CTA: "Browse Course Catalog"
             |                                    |
             v                                    v
  - calls startCourse mutation          - opens CourseCatalogSheet
  - setActiveCourseId(nextId)
  - Map re-renders with new course
```

## 3. Selector Dependencies

The recommendation selector computes its value from existing normalized Redux state slices:
- `selectCourseEntities`: Dictionary of all loaded `Course` objects.
- `selectCourseCatalog`: Array of available course summaries ordered by `order_index`.
- `selectCourseProgressForCourse`: Progression record for the active course (`status === 'completed'`).
- `selectIsCourseCompleteForCourse`: Node completion check (`totalNodes > 0 && completedNodes === totalNodes`).
- `selectCourseProgressMap`: Map of all user course progress records.
