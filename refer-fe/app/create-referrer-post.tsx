import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { Stack } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import styled from "styled-components/native";
import EnhancedReferrerPostForm from "@/components/ReferrerPostForm/EnhancedReferrerPostForm";

const PageContainer = styled.View`
    flex: 1;
    background-color: ${(props) => props.theme.colors.background};
`;

const ContentContainer = styled.View`
    padding: ${(props) => props.theme.spacing.md}px;
`;

export default function CreateReferrerPostScreen() {
    const { theme } = useTheme();

    const handleSubmit = (formData: any) => {
        // In a real implementation, this would submit the data to the backend
        console.log("Form submitted:", formData);
        // Navigation would happen here
    };

    return (
        <PageContainer>
            <Stack.Screen
                options={{
                    title: "Create Referrer Post",
                    headerStyle: {
                        backgroundColor: theme.colors.card,
                    },
                    headerTintColor: theme.colors.text,
                    headerShadowVisible: false,
                }}
            />
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView>
                    <ContentContainer>
                        <EnhancedReferrerPostForm onSubmit={handleSubmit} />
                    </ContentContainer>
                </ScrollView>
            </SafeAreaView>
        </PageContainer>
    );
}
