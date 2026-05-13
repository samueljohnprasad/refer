import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import BestOfferCard from "./BestOfferCard";
import WeeklyCard from "./WeeklyCard";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";

const BuyCards = () => {
  const [selectedCard, setSelectedCard] = useState("bestOffer");
  const [isPurchasing, setIsPurchasing] = useState(false);
  const toast = useToast();
  const { presentPaywall } = useRevenueCat();

  return (
    <Box className="flex-1 flex flex-col gap-4 ">
      <View style={styles.pricingRow}>
        <BestOfferCard
          isSelected={selectedCard === "bestOffer"}
          onPress={() => setSelectedCard("bestOffer")}
        />
        <WeeklyCard
          isSelected={selectedCard === "weekly"}
          onPress={() => setSelectedCard("weekly")}
        />
      </View>
      <Box className="flex flex-col">
        <TouchableOpacity
          style={[styles.button, isPurchasing && styles.buttonDisabled]}
          disabled={isPurchasing}
          onPress={async () => {
            try {
              setIsPurchasing(true);
              const purchased = await presentPaywall();
              if (!purchased) {
                toast.show({
                  placement: "top",
                  render: ({ id }) => {
                    return (
                      <Toast nativeID={id} variant="solid" action="error">
                        <ToastTitle>Purchase was not completed.</ToastTitle>
                      </Toast>
                    );
                  },
                });
              }
            } finally {
              setIsPurchasing(false);
            }
          }}
        >
          {isPurchasing ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.caption}>Cancel anytime. Secure payments.</Text>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  pricingRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 12,
  },
  button: {
    backgroundColor: "#FFCC00",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.72,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  caption: {
    marginTop: 10,
    textAlign: "center",
    color: "rgba(15,23,42,0.7)",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default BuyCards;
