# Explore Journeys Accordion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Explore Journeys sheet into a premium, vertical accordion list with exclusive state and spring animations.

**Architecture:** We will replace the horizontal `CourseCard` carousel and the separate `selectedCourse` details card with a single vertical `FlatList` of `CourseAccordionCard` components. The parent `CourseCatalogSheetContent` will continue to manage `selectedCourseId` (which acts as the exclusive open state for the accordion). We will use `react-native-reanimated` for the accordion expansion and chevron rotation.

**Tech Stack:** React Native, NativeWind (Tailwind), React Native Reanimated.

## Global Constraints
- Only modify `src/components/journey/CourseCatalogSheet.tsx`.
- Keep all API hooks and data structures as is.
- Ignore TDD/testing steps (project has no test suite for this module).
- Ignore compilation errors caused by incomplete downstream tasks until the final task is done.

---

### Task 1: Create the CourseAccordionCard Skeleton

**Files:**
- Modify: `src/components/journey/CourseCatalogSheet.tsx`

**Interfaces:**
- Consumes: `CourseCatalogListItem`, `EnrolledCourseListItem`, `CourseJourneyPreviewSection` types.
- Produces: `CourseAccordionCard` base structure.

- [ ] **Step 1: Replace `CourseCard` with `CourseAccordionCard` skeleton**
In `src/components/journey/CourseCatalogSheet.tsx`, find the `CourseCard` component (around line 137) and completely replace it with this skeleton that uses Reanimated:

```tsx
type CourseAccordionCardProps = {
  course: CourseCatalogListItem;
  isExpanded: boolean;
  isEnrolled: boolean;
  onToggle: (courseId: string) => void;
  preview: ReturnType<typeof buildCourseJourneyPreview> | null;
  isPreviewLoading: boolean;
  isStartingCourse: boolean;
  onEnroll: (courseId: string) => void;
};

const CourseAccordionCard = React.memo(function CourseAccordionCard({
  course,
  isExpanded,
  isEnrolled,
  onToggle,
  preview,
  isPreviewLoading,
  isStartingCourse,
  onEnroll,
}: CourseAccordionCardProps): React.JSX.Element {
  const courseAccentColor = resolveCourseAccentColor(course.colorHex);
  
  // Reanimated shared values
  const expansionProgress = useSharedValue(isExpanded ? 1 : 0);

  useEffect(() => {
    expansionProgress.value = withSpring(isExpanded ? 1 : 0, {
      damping: 20,
      stiffness: 150,
      mass: 0.8,
    });
  }, [isExpanded, expansionProgress]);

  const animatedChevronStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${interpolate(expansionProgress.value, [0, 1], [0, 180])}deg` }
      ],
    };
  });

  return (
    <View className="mb-4 bg-white rounded-[24px] shadow-sm shadow-slate-200/50 overflow-hidden">
      <Pressable 
        onPress={() => onToggle(course.id)}
        className="flex-row items-center justify-between p-5"
        style={isExpanded ? { backgroundColor: `${courseAccentColor}10` } : {}}
      >
        <View className="flex-row items-center gap-4">
          <View className="h-12 w-12 items-center justify-center rounded-[14px]" style={{ backgroundColor: `${courseAccentColor}1A` }}>
            {course.iconUrl ? (
              <Image source={course.iconUrl} className="h-8 w-8 rounded-lg" cachePolicy="memory-disk" contentFit="contain" />
            ) : (
              <RNText className="happy-font-heading text-lg" style={{ color: courseAccentColor }}>
                {getCourseMonogram(course.title)}
              </RNText>
            )}
          </View>
          <View>
            <Text variant="h3" className="font-bold text-ink">{course.title}</Text>
            {isEnrolled && (
              <Text variant="chip" color="sage" className="uppercase tracking-[0.4px] text-[10px] mt-1">Enrolled</Text>
            )}
          </View>
        </View>
        <Animated.View style={animatedChevronStyle}>
          <HugeiconsIcon icon={Cancel01Icon} size={20} color="#94A3B8" /> {/* Placeholder for chevron, using Cancel icon temporarily or any valid Hugeicon you have, ideally ChevronDownIcon but fallback to Text if none */}
          <Text className="text-slate-400 font-bold ml-2">v</Text>
        </Animated.View>
      </Pressable>
    </View>
  );
});
```

- [ ] **Step 2: Commit**
```bash
git add src/components/journey/CourseCatalogSheet.tsx
git commit -m "feat: setup CourseAccordionCard base structure with reanimated"
```

---

### Task 2: Implement the Expanded Content (Accordion Body)

**Files:**
- Modify: `src/components/journey/CourseCatalogSheet.tsx`

**Interfaces:**
- Consumes: `CourseAccordionCard` skeleton.

- [ ] **Step 1: Add the expanded body to `CourseAccordionCard`**
Right below the `</Pressable>` inside `CourseAccordionCard`, add the expanded content. Note we use a generic conditional render here because `react-native-reanimated` measuring can be complex without extra libraries, but we can just conditionally render the body if `isExpanded` is true for simplicity, or use `Animated.View` if we want full height interpolation. For this plan, we will conditionally render the content and let layout animation handle it (or just direct render since it's a simple React Native pattern).

Replace the `return` statement in `CourseAccordionCard` with:

```tsx
  return (
    <View className="mb-4 bg-white rounded-[24px] border border-slate-100 shadow-sm shadow-slate-200/40 overflow-hidden">
      <Pressable 
        onPress={() => onToggle(course.id)}
        className="flex-row items-center justify-between p-5"
        style={isExpanded ? { backgroundColor: `${courseAccentColor}08` } : {}}
      >
        <View className="flex-row items-center gap-4 flex-1">
          <View className="h-12 w-12 items-center justify-center rounded-[14px]" style={{ backgroundColor: `${courseAccentColor}1A` }}>
            {course.iconUrl ? (
              <Image source={course.iconUrl} className="h-8 w-8 rounded-lg" cachePolicy="memory-disk" contentFit="contain" />
            ) : (
              <RNText className="happy-font-heading text-[20px]" style={{ color: courseAccentColor }}>
                {getCourseMonogram(course.title)}
              </RNText>
            )}
          </View>
          <View className="flex-1">
            <Text variant="body-bold" className="text-[17px] text-ink">{course.title}</Text>
            {isEnrolled && (
              <Text variant="chip" color="sage" className="uppercase tracking-[0.4px] text-[10px] mt-1">Enrolled</Text>
            )}
          </View>
        </View>
        <Animated.View style={animatedChevronStyle} className="px-2">
          <Text className="text-slate-400 font-bold text-lg">v</Text> 
        </Animated.View>
      </Pressable>

      {isExpanded && (
        <View className="p-5 pt-0 border-t border-slate-100/50" style={{ backgroundColor: `${courseAccentColor}04` }}>
          <Text variant="body" className="text-[15px] leading-[22px] text-ink-soft mt-4 mb-3">
            {course.description || "A guided journey you can start today."}
          </Text>
          
          <Text variant="caption-muted" className="text-[13px] font-medium mb-6">
            {preview?.unitCount ?? "—"} Units • {preview?.nodeCount ?? "—"} Lessons • {preview ? formatEstimatedDuration(preview.estimatedMinutes) : "—"}
          </Text>

          {isPreviewLoading ? (
            <View className="py-4 items-center justify-center">
              <ActivityIndicator color={courseAccentColor} />
            </View>
          ) : preview ? (
            <View className="gap-3 mb-6">
              {preview.sections.map((section) => (
                <CoursePreviewSectionRow
                  key={section.id}
                  accentColor={resolveSectionPreviewAccentColor(section.orderIndex)}
                  section={section}
                />
              ))}
            </View>
          ) : null}

          <Button
            label={isEnrolled ? "Open Journey" : isStartingCourse ? "Enrolling..." : "Enroll in Course"}
            loading={isStartingCourse && !isEnrolled}
            onPress={() => onEnroll(course.id)}
            className="mt-2"
          />
        </View>
      )}
    </View>
  );
```

- [ ] **Step 2: Commit**
```bash
git add src/components/journey/CourseCatalogSheet.tsx
git commit -m "feat: add expanded content body to accordion card"
```

---

### Task 3: Refactor the Main Catalog Sheet Layout

**Files:**
- Modify: `src/components/journey/CourseCatalogSheet.tsx`

**Interfaces:**
- Consumes: `CourseAccordionCard` component.

- [ ] **Step 1: Simplify Header and Replace FlatList layout**
In `CourseCatalogSheetContent`, modify the main render return block (around line 419). Replace everything inside the main `<ScrollView>` (which we will change to a `FlatList` to replace the nested scroll view approach) or just update the `<FlatList>` props and remove the `selectedCourse` detail card completely.

Replace the entire `return` block of `CourseCatalogSheetContent` with this clean version:

```tsx
  return (
    <View className="flex-1 happy-brand-screen">
      <View className="w-12 h-1 bg-sage-200/80 rounded-full self-center mt-3 mb-1" />

      <View className="flex-row items-center justify-between px-5 pt-2 pb-1">
        <View className="h-11 w-11" />
        <Pressable onPress={onClose} className="h-11 w-11 items-center justify-center rounded-[22px] border-2 border-b-4 border-sage-100 border-b-sage-200 bg-warm-white">
          <HugeiconsIcon icon={Cancel01Icon} size={20} color={SAGE[600]} />
        </Pressable>
      </View>

      <View className="flex-1" style={{ paddingBottom: Math.max(insets.bottom, 20) }}>
        <FlatList
          data={catalogCourses}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-5 pb-28 pt-2"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View className="gap-2 px-1 mb-8">
              <Text className="happy-font-heading text-[36px] leading-[40px] text-ink">
                Explore Journeys
              </Text>
              <Text className="happy-font-body text-base leading-[23px] text-ink-soft">
                Browse every published course, preview the path, and enroll when you are ready.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <CourseAccordionCard
              course={item}
              isExpanded={item.id === selectedCourseId}
              isEnrolled={enrolledCourseIds.has(item.id)}
              onToggle={(id) => setSelectedCourseId(id === selectedCourseId ? null : id)}
              preview={item.id === selectedCourseId ? preview : null}
              isPreviewLoading={item.id === selectedCourseId ? isPreviewLoading : false}
              isStartingCourse={isStartingCourse && item.id === selectedCourseId}
              onEnroll={handlePrimaryActionPress}
            />
          )}
          ListEmptyComponent={
            isCatalogLoading ? (
              <View className="py-12 items-center justify-center">
                <ActivityIndicator color={interactionColor} />
              </View>
            ) : (
              <View className="py-12 items-center justify-center">
                <Text variant="body" className="text-center text-[15px] text-ink-muted">
                  No published courses are available yet.
                </Text>
              </View>
            )
          }
        />
      </View>
    </View>
  );
```

- [ ] **Step 2: Clean up unused components**
Remove `CourseMetricCard` completely from the file as it's no longer used.

- [ ] **Step 3: Commit**
```bash
git add src/components/journey/CourseCatalogSheet.tsx
git commit -m "refactor: replace separate carousel and details card with unified accordion list"
```
