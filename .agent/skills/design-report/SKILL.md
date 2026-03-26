---
name: design-report
description: Use when conducting comprehensive design review before launch, for stakeholder presentation, or when user requests expert-level design analysis. Produces detailed report from senior Apple product designer perspective.
---

# Design Report

## Overview

Generate comprehensive design evaluation reports from the perspective of a senior product designer with 15+ years at Apple, analyzing every aspect of a frontend interface.

**Core principle:** Great design is invisible until it's missing. Expert analysis reveals what users feel but can't articulate.

## When to Use

Use this skill when:
- Pre-launch design review
- Stakeholder presentation needs
- User requests "expert feedback" or "thorough review"
- Evaluating competitor UI
- Design system audit
- User says "review like an expert" or "Apple designer perspective"

## Required Inputs

1. **Screenshots** - Multiple views/states of the interface
2. **Context document** (optional) - Brand guidelines, target users, business goals
3. **Comparison** (optional) - Competitor screenshots for benchmarking

**Announce:** "I'll conduct a comprehensive design analysis using design-report, evaluating from a senior Apple product designer perspective."

## The Apple Design Perspective

Channel these principles throughout analysis:

### Core Apple Values
- **Clarity** - Content is king, chrome is invisible
- **Deference** - UI helps content, never competes
- **Depth** - Hierarchy creates understanding
- **Consistency** - Patterns reduce cognitive load
- **Direct manipulation** - Objects respond naturally
- **Feedback** - System state always visible
- **Metaphors** - Familiar concepts guide interaction
- **User control** - People initiate, system responds

### What Apple Designers Notice

> "Most people make the mistake of thinking design is what it looks like. People think it's this veneer — that the designers are handed this box and told, 'Make it look good!' That's not what we think design is. It's not just what it looks like and feels like. Design is how it works."
> — Steve Jobs

Look for:
- Unnecessary complexity
- Cognitive load reducers
- Moments of delight
- Friction points
- Emotional response triggers
- Details that reveal care (or carelessness)

## Report Structure

### Executive Summary
One paragraph capturing:
- Overall quality assessment
- Most significant strength
- Most critical issue
- Recommended priority action

### Design Quality Score

Rate 1-10 with justification:

| Dimension | Score | Benchmark |
|-----------|-------|-----------|
| Visual Hierarchy | X/10 | Apple: 9, Average app: 6 |
| Typography | X/10 | Apple: 9, Average app: 5 |
| Color System | X/10 | Apple: 8, Average app: 5 |
| Spacing & Layout | X/10 | Apple: 9, Average app: 5 |
| Interaction Design | X/10 | Apple: 9, Average app: 6 |
| Accessibility | X/10 | Apple: 8, Average app: 4 |
| Polish & Details | X/10 | Apple: 10, Average app: 4 |
| **Overall** | **X/10** | **Apple: 9, Average: 5** |

> **Note:** These 1-10 dimension scores provide a quick assessment snapshot. For detailed scoring with weighted criteria totaling 100 points, see `evaluation-criteria.md`. A dimension score of 9-10 corresponds to 90-100% in the detailed rubric (Exceptional), 7-8 to 70-89% (Good to Excellent), and so on.

### Detailed Analysis

See `evaluation-criteria.md` for complete checklist.

#### 1. Information Architecture (Weight: Critical)
- Content hierarchy
- Navigation clarity
- Information density
- Progressive disclosure
- Mental model alignment

#### 2. Visual Design (Weight: High)

**Typography Analysis:**
- Font selection rationale
- Type scale coherence
- Reading comfort
- Emotional tone

**Color Analysis:**
- Palette harmony
- Semantic usage
- Accessibility compliance
- Mood/brand alignment

**Spatial Analysis:**
- Grid system
- White space distribution
- Density balance
- Element grouping

#### 3. Interaction Design (Weight: High)
- Affordances
- Feedback mechanisms
- State communication
- Error handling
- Microinteractions

#### 4. Emotional Design (Weight: Medium)
- First impression (gut check)
- Trust signals
- Delight moments
- Personality consistency
- Memorability factor

#### 5. Accessibility (Weight: Critical)
- WCAG compliance level
- Screen reader experience
- Keyboard navigation
- Motor accessibility
- Cognitive accessibility

#### 6. Polish & Craftsmanship (Weight: High)
- Pixel precision
- Animation quality
- Edge cases handled
- Loading states
- Empty states
- Error states

### Competitive Analysis (if provided)
- Side-by-side comparison
- Differentiation assessment
- Industry benchmark position

### Prioritized Recommendations

#### Immediate (Before Launch)
1. Issue + specific fix + expected impact

#### Short-term (Next Sprint)
1. Issue + specific fix + expected impact

#### Long-term (Roadmap)
1. Issue + strategic recommendation

### Appendix
- Detailed measurements
- Accessibility audit results
- Screenshot annotations

## Evaluation Approach

### The 10-Foot Test
- View interface from across room
- Can you identify: Primary action? Key content? Navigation?
- Squint test: Does hierarchy hold?

### The First-Time User Test
- Pretend zero context
- Is purpose immediately clear?
- Can you complete primary task without instructions?

### The Return User Test
- Is repeat usage efficient?
- Are shortcuts available?
- Does muscle memory work?

### The Accessibility Test
- Zoom to 200%: Still usable?
- Grayscale: Still navigable?
- Keyboard only: All features accessible?
- Screen reader: Makes sense audibly?

### The Detail Test
- Zoom to 400%
- Pixel alignment on retina
- Consistent icon sizing
- Border radius consistency
- Shadow uniformity

## Output Actions

Report should be:
- PDF-ready formatting
- Executive-friendly summary
- Developer-actionable details
- Visual annotations where helpful
- Quantified metrics where possible

## Red Flags

Stop and clarify if:
- Cannot determine target audience
- Purpose of interface unclear
- Multiple conflicting design patterns
- Screenshots are incomplete or low quality

## Integration

**Related skills:**
- `design-compare` - When comparing to specific reference
- `design-audit` - For quick feedback during development

**Supporting documents:**
- See `apple-design-principles.md` for detailed Apple HIG breakdown
- See `evaluation-criteria.md` for complete scoring rubric
