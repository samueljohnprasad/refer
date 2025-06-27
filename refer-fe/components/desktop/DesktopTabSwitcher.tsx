import React from "react";
import styled from "styled-components/native";
import { TabType } from "../../types/posts";
import { EnhancedThemeInterface } from "../../constants/enhancedTheme";

interface DesktopTabSwitcherProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    jobSeekerCount: number;
    referrerCount: number;
    theme: EnhancedThemeInterface;
}

const Container = styled.View`
    flex-direction: row;
    margin-bottom: ${(props) => props.theme.spacing.lg}px;
    border-bottom-width: 1px;
    border-bottom-color: ${(props) => props.theme.colors.border};
`;

const TabButton = styled.TouchableOpacity<{ isActive: boolean }>`
    padding: ${(props) => props.theme.spacing.md}px
        ${(props) => props.theme.spacing.lg}px;
    border-bottom-width: 2px;
    border-bottom-color: ${(props) =>
        props.isActive ? props.theme.colors.primary : "transparent"};
    margin-right: ${(props) => props.theme.spacing.lg}px;
`;

const TabText = styled.Text<{ isActive: boolean }>`
    font-size: ${(props) => props.theme.typography.fontSize.base}px;
    font-weight: ${(props) =>
        props.isActive
            ? props.theme.typography.fontWeight.semibold
            : props.theme.typography.fontWeight.normal};
    color: ${(props) =>
        props.isActive
            ? props.theme.colors.primary
            : props.theme.colors.textSecondary};
`;

const DesktopTabSwitcher: React.FC<DesktopTabSwitcherProps> = ({
    activeTab,
    onTabChange,
    jobSeekerCount,
    referrerCount,
    theme,
}) => {
    return (
        <Container>
            <TabButton
                isActive={activeTab === TabType.JobSeeker}
                onPress={() => onTabChange(TabType.JobSeeker)}
            >
                <TabText
                    isActive={activeTab === TabType.JobSeeker}
                >
                    Job Seekers ({jobSeekerCount})
                </TabText>
            </TabButton>

            <TabButton
                isActive={activeTab === TabType.Referrer}
                onPress={() => onTabChange(TabType.Referrer)}
            >
                <TabText
                    isActive={activeTab === TabType.Referrer}
                >
                    Referrers ({referrerCount})
                </TabText>
            </TabButton>
        </Container>
    );
};

export default DesktopTabSwitcher;
