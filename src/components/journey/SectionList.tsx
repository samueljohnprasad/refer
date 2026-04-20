import React from "react";
import { View, Pressable, Text as RNText } from "react-native";

interface Section {
  unitNumber: number;
  sectionNumber?: number;
  title: string;
  nodeCount: number;
}

interface SectionListProps {
  sectionList: Section[];
  currentSectionNumber: number | null;
  onSectionPress: (unitNumber: number) => void;
}

export function SectionList({
  sectionList,
  currentSectionNumber,
  onSectionPress,
}: SectionListProps) {
  return (
    <View>
      <RNText
        style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}
      >
        Course Sections
      </RNText>
      {sectionList && sectionList.length > 0 ? (
        sectionList.map((section: Section, index: number) => {
          const isActive =
            (section.sectionNumber || section.unitNumber) ===
            currentSectionNumber;
          return (
            <Pressable
              key={section.unitNumber}
              style={{
                backgroundColor: isActive ? "#E3F2FD" : "#f5f5f5",
                padding: 16,
                borderRadius: 12,
                marginBottom: 12,
                borderWidth: isActive ? 2 : 1,
                borderColor: isActive ? "#2196F3" : "#e0e0e0",
              }}
              onPress={() => {
                if (!isActive) {
                  onSectionPress(section.unitNumber);
                }
              }}
            >
              <RNText
                style={{
                  fontSize: 16,
                  fontWeight: isActive ? "700" : "600",
                  marginBottom: 4,
                  color: isActive ? "#1976D2" : "#333",
                }}
              >
                Section {section.sectionNumber || section.unitNumber}:{" "}
                {section.title}
              </RNText>
              <RNText style={{ fontSize: 14, color: "#666" }}>
                {section.nodeCount} nodes
              </RNText>
              {isActive && (
                <RNText
                  style={{
                    fontSize: 12,
                    color: "#1976D2",
                    marginTop: 4,
                    fontWeight: "500",
                  }}
                >
                  Currently viewing
                </RNText>
              )}
            </Pressable>
          );
        })
      ) : (
        <RNText
          style={{ color: "#999", textAlign: "center", marginTop: 20 }}
        >
          No sections available
        </RNText>
      )}
    </View>
  );
}
