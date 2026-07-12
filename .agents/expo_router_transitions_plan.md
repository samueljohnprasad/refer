# Implementation Plan: Launch Card to Detail Transition

This plan details how the shared element zoom transition (from the launch list card to the `launch/[id].tsx` detail screen) is implemented in your Expo Router stack using the new `Link.AppleZoom` APIs.

## 1. Overview of the Transition

The goal is to create a seamless, native-feeling zoom transition where the hero image from a launch card expands into the header image of the `launch/[id].tsx` screen.

This is achieved using Expo Router's `<Link>` sub-components:

- `<Link.AppleZoom>`: Placed on the source screen (the list).
- `<Link.AppleZoomTarget>`: Placed on the destination screen (the details page).

## 2. Source Component Implementation (`launch-card.tsx`)

In the launch card component, we wrap the hero visual in `<Link.AppleZoom>`.

**Key Requirements & Constraints:**

1.  **Direct Child Constraint**: The `<Image>` (or fallback view) must be a **direct child** of `<Link.AppleZoom>`. Nesting additional wrapping `<View>`s inside `Link.AppleZoom` can cause the layout to collapse or the animation to fail.
2.  **Explicit Sizing**: The direct child needs explicit width and height dimensions to ensure the layout engine correctly measures the starting position for the animation.

**Code Structure:**

```tsx
import { Link } from "expo-router";
import { Image } from "expo-image";

// Inside LaunchCard component...
<Link href={{ pathname: "/launch/[id]", params: { id: launch.id } }} asChild>
  <Link.Trigger>
    <Pressable>
      {/* The Hero Image acting as the source of the transition */}
      <Link.AppleZoom>
        <Image
          source={{ uri: visual.uri }}
          style={{
            width: cardWidth, // Explicit pixel width
            height: 176, // Explicit pixel height
          }}
          contentFit="cover"
        />
      </Link.AppleZoom>

      {/* Other card content (title, countdown, etc.) */}
    </Pressable>
  </Link.Trigger>
</Link>;
```

## 3. Destination Component Implementation (`launch/[id].tsx`)

On the detail screen route, we use `<Link.AppleZoomTarget>` to define where the image should land at the end of the transition.

**Key Requirements & Constraints:**

1.  **Matching Content**: The visual inside the target should closely match the aspect ratio and content of the source to ensure a smooth visual handoff.
2.  **Positioning**: Wrap the main hero container in `<Link.AppleZoomTarget>`.

**Code Structure:**

```tsx
import { Link } from "expo-router";
import { LaunchHeroVisual } from "@/components/launches/launch-hero-visual";

// Inside LaunchDetailScreen component...
<Link.AppleZoomTarget>
  <View
    style={[
      styles.hero,
      {
        width: layout.isWide ? heroW : "100%",
        height: heroH, // Explicit height calculation
        overflow: "hidden",
      },
    ]}
  >
    {/* The high-resolution Hero Visual */}
    <LaunchHeroVisual
      launch={launch}
      width={layout.isWide ? heroW : layout.width}
      height={heroH}
    />

    {/* Overlays (Gradients, Status Pills, etc.) can be placed over the visual */}
    <View style={styles.heroGradient} />
    <View style={styles.heroMeta}>{/* ... */}</View>
  </View>
</Link.AppleZoomTarget>;
```

## 4. Under the Hood Mechanics

1. **Triggering**: When the user taps the `<Link.Trigger>` (the `Pressable` card), Expo Router initiates navigation to `launch/[id].tsx`.
2. **Measurement**: The router measures the layout bounding box of the child inside `<Link.AppleZoom>`.
3. **Animation (iOS)**: On supported platforms (iOS), the OS performs a native "zoom" transition from the source bounding box to the destination bounding box defined by `<Link.AppleZoomTarget>` on the next screen.
4. **Fallback**: On platforms or router versions where native zoom isn't supported, it gracefully falls back to the default stack transition (typically a push or slide).

## 5. Potential Pitfalls to Avoid

- **Avoid Extra Wrappers**: Do not use `<LaunchHeroVisual>` inside `<Link.AppleZoom>` if `<LaunchHeroVisual>` returns nested views instead of a single image. This is why the card component extracts the `<Image>` directly.
- **Dynamic Sizes**: Ensure that the dimensions (`cardWidth`, `heroW`, `heroH`) are fully calculated _before_ the transition begins. If they change during mount, the animation will stutter or jump.
