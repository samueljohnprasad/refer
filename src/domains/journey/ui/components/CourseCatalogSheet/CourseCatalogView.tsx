import React from "react";
import { Pressable, View } from "react-native";
import { FullWindowOverlay } from "react-native-screens";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import { CourseCatalogSheetContent } from "./CourseCatalogSheetContent";

export { CourseAccordionCard } from "./CourseAccordionCard";
export { CourseCatalogSheetContent } from "./CourseCatalogSheetContent";

export const CourseCatalogView = React.memo(function CourseCatalogView({
  model,
  actions,
}: {
  model: {
    shouldRender: boolean;
    isPresented: boolean;
  } & React.ComponentProps<typeof CourseCatalogSheetContent>["model"];
  actions: React.ComponentProps<typeof CourseCatalogSheetContent>["actions"];
}): React.JSX.Element | null {
  if (!model.shouldRender) return null;

  return (
    <FullWindowOverlay>
      <View style={{ flex: 1 }} pointerEvents={model.isPresented ? "auto" : "none"}>
        {model.isPresented ? (
          <>
            <Animated.View
              entering={FadeIn.duration(220).easing(Easing.out(Easing.cubic))}
              exiting={FadeOut.duration(160)}
              className="absolute inset-0"
            >
              <Pressable
                className="absolute inset-0 bg-black/40"
                onPress={actions.onClose}
                accessibilityRole="button"
                accessibilityLabel="Close course catalog"
              />
            </Animated.View>

            <Animated.View
              entering={SlideInDown.duration(320).easing(Easing.out(Easing.exp))}
              exiting={SlideOutDown.duration(220).easing(Easing.in(Easing.cubic))}
              className="absolute inset-0 overflow-hidden bg-[#F8FAF7]"
              style={{
                shadowColor: "#2B3A22",
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.12,
                shadowRadius: 8,
                elevation: 24,
              }}
            >
              <CourseCatalogSheetContent model={model} actions={actions} />
            </Animated.View>
          </>
        ) : null}
      </View>
    </FullWindowOverlay>
  );
});
