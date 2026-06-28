import { useCallback } from "react";
import { StyleSheet, View, Text } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { StarIcon } from "@hugeicons/core-free-icons";

import { StackedCarousel } from "./components/stacked-carousel";

// If you want to, you can use images, for visual purposes I preferred just white cards
// const sampleImages = [
//   {
//     uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80',
//   },
//   {
//     uri: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80',
//   },
//   {
//     uri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80',
//   },
// ];

const REVIEWS = [
  {
    id: "1",
    name: "Maya",
    age: 32,
    quote:
      "I'd downloaded 6 anxiety apps before this. Happy is the first one I actually opened on day 8.",
  },
  {
    id: "2",
    name: "Sarah",
    age: 28,
    quote:
      "This is exactly what I needed. The insights are incredibly helpful and easy to digest.",
  },
  {
    id: "3",
    name: "David",
    age: 35,
    quote:
      "I've finally found a tool that helps me understand my patterns without feeling overwhelmed.",
  },
];

const App = () => {
  const renderCard = useCallback(
    (item: (typeof REVIEWS)[0]) => (
      <View style={styles.fill}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={styles.authorText}>
            {item.name}, {item.age}
          </Text>
          <View style={{ flexDirection: 'row', gap: 2 }}>
            {[...Array(5)].map((_, i) => (
              <HugeiconsIcon
                key={i}
                icon={StarIcon}
                size={12}
                color="#D97706"
                fill="#D97706"
              />
            ))}
          </View>
        </View>
        <Text style={styles.quoteText}>"{item.quote}"</Text>
      </View>
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <StackedCarousel
        data={REVIEWS}
        renderCard={renderCard}
        cardWidth={320}
        cardHeight={200}
        stackOffset={12}
        style={styles.carousel}
        showPaginator
        paginatorVisibleDots={3}
        paginatorDotSize={10}
        paginatorSpacing={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    padding: 24,
    justifyContent: "center",
  },
  container: {
    height: 300,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  carousel: {
    backgroundColor: "transparent",
  },
  quoteText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#333333",
    lineHeight: 24,
    marginBottom: 16,
  },
  authorText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
  },
});

export { App as StackedCarousel };
