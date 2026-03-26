# Design Evaluation Criteria

## Complete Scoring Rubric

### Category 1: Information Architecture (25 points)

| Criterion | Points | Description |
|-----------|--------|-------------|
| Content Hierarchy | 5 | Primary, secondary, tertiary clearly distinguished |
| Navigation Clarity | 5 | Users always know where they are and can go |
| Information Density | 5 | Appropriate amount of content per view |
| Progressive Disclosure | 5 | Complex info revealed when needed |
| Mental Model Match | 5 | Organization matches user expectations |

**Scoring Guide:**
- 5: Exemplary, matches Apple-level quality
- 4: Strong, minor improvements possible
- 3: Adequate, noticeable issues
- 2: Weak, significant problems
- 1: Poor, fundamental issues
- 0: Missing/broken

### Category 2: Visual Design (25 points)

**Typography (10 points)**
| Criterion | Points |
|-----------|--------|
| Font selection | 2 |
| Type scale | 2 |
| Line height/spacing | 2 |
| Readability | 2 |
| Hierarchy clarity | 2 |

**Color (8 points)**
| Criterion | Points |
|-----------|--------|
| Palette coherence | 2 |
| Semantic usage | 2 |
| Contrast compliance | 2 |
| Brand alignment | 2 |

**Spatial Design (7 points)**
| Criterion | Points |
|-----------|--------|
| Grid alignment | 2 |
| Spacing consistency | 2 |
| White space usage | 2 |
| Visual balance | 1 |

### Category 3: Interaction Design (20 points)

| Criterion | Points | Description |
|-----------|--------|-------------|
| Affordances | 4 | Interactive elements look interactive |
| Feedback | 4 | All actions have visible response |
| State Communication | 4 | Current state always clear |
| Error Handling | 4 | Errors are clear, recoverable |
| Microinteractions | 4 | Details that delight |

### Category 4: Accessibility (15 points)

| Criterion | Points |
|-----------|--------|
| Color contrast | 3 |
| Focus indicators | 3 |
| Touch targets | 3 |
| Screen reader support | 3 |
| Keyboard navigation | 3 |

### Category 5: Polish & Craftsmanship (15 points)

| Criterion | Points |
|-----------|--------|
| Pixel precision | 3 |
| Animation quality | 3 |
| Loading states | 3 |
| Empty states | 3 |
| Error states | 3 |

---

## Quick Checklist Version

### Must Pass (Critical)
- [ ] Primary action identifiable in < 3 seconds
- [ ] Text contrast meets WCAG AA (4.5:1)
- [ ] All interactive elements have focus states
- [ ] Touch targets >= 44px
- [ ] No text smaller than 14px
- [ ] Consistent spacing scale used
- [ ] All states handled (loading, empty, error)

### Should Pass (High Priority)
- [ ] Type hierarchy uses max 3 sizes
- [ ] Color palette limited to 5-6 colors
- [ ] Grid alignment consistent
- [ ] Icons consistent style
- [ ] Transitions smooth (no jank)
- [ ] Forms have proper labels
- [ ] Buttons have visible hover/active states

### Nice to Have (Polish)
- [ ] Microinteractions on key actions
- [ ] Delightful empty states
- [ ] Helpful error messages
- [ ] Skeleton loaders (not spinners)
- [ ] Smooth page transitions
- [ ] Contextual help available
- [ ] Consistent border radius scale

---

## Score Interpretation

| Score | Rating | Meaning |
|-------|--------|---------|
| 90-100 | Exceptional | Apple/Stripe-level quality |
| 80-89 | Excellent | Professional, polished |
| 70-79 | Good | Above average, some gaps |
| 60-69 | Adequate | Functional, needs work |
| 50-59 | Below Average | Significant issues |
| < 50 | Poor | Fundamental problems |

## Competitive Benchmarks

| Product | Typical Score | Notes |
|---------|---------------|-------|
| Apple apps | 90-95 | Industry gold standard |
| Stripe | 88-92 | Exceptional polish |
| Linear | 85-90 | Strong craft focus |
| Notion | 80-85 | Good, some complexity |
| Average SaaS | 55-70 | Functional but generic |
| MVP/Prototype | 40-55 | Acceptable for stage |
