import { View, Text } from "react-native";
import React from "react";
import { Box } from "@/components/ui/box";
import BestOfferCard from "./BestOfferCard";
import WeeklyCard from "./WeeklyCard";
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";

const BuyCards = () => {
  const [selectedCard, setSelectedCard] = useState("bestOffer");
  const toast = useToast();

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
          style={styles.button}
          onPress={() => {
            toast.show({
              placement: "top",
              render: ({ id }) => {
                return (
                  <Toast nativeID={id} variant="solid" action="error">
                    <ToastTitle>{selectedCard} selected</ToastTitle>
                  </Toast>
                );
              },
            });
          }}
        >
          <Text style={styles.buttonText}>Continue</Text>
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
