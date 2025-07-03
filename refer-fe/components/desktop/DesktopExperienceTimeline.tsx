import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { EnhancedThemeInterface } from "../../constants/enhancedTheme";

interface ExperienceItem {
    id: string;
    title: string;
    company: string;
    companyLogo: string;
    startDate: string;
    endDate?: string;
    location: string;
    description: string;
    achievements: string[];
    skills: string[];
    current: boolean;
    isPromotion?: boolean;
    previousRole?: string;
}

interface GroupedExperience {
    company: string;
    companyLogo: string;
    location: string;
    totalDuration: string;
    positions: ExperienceItem[];
    current: boolean;
}

interface DesktopExperienceTimelineProps {
    experiences: ExperienceItem[];
    theme: EnhancedThemeInterface;
}

const TimelineContainer = styled.View`
    position: relative;
    padding-left: 40px;
`;

const TimelineLine = styled.View`
    position: absolute;
    left: 20px;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: #e2e8f0;
`;

const TimelineItem = styled.View<{ isLast: boolean }>`
    position: relative;
    margin-bottom: ${(props) => (props.isLast ? "0" : "32px")};
`;

const TimelineNode = styled.View<{ isCurrent: boolean }>`
    position: absolute;
    left: -32px;
    top: 12px;
    width: 24px;
    height: 24px;
    border-radius: 12px;
    background-color: ${(props) => (props.isCurrent ? "#4299E1" : "#FFFFFF")};
    border: 3px solid ${(props) => (props.isCurrent ? "#4299E1" : "#CBD5E0")};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 2;
`;

const CurrentIndicator = styled.View`
    position: absolute;
    left: -36px;
    top: 8px;
    width: 32px;
    height: 32px;
    border-radius: 16px;
    background-color: rgba(66, 153, 225, 0.2);
    animation: pulse 2s infinite;
`;

const ExperienceCard = styled.TouchableOpacity<{ expanded: boolean }>`
    background-color: #ffffff;
    border-radius: 8px;
    padding: 24px;
    border: 1px solid #e5e7eb;
    margin-bottom: 4px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const ExperienceHeader = styled.View`
    flex-direction: row;
    align-items: flex-start;
    margin-bottom: 16px;
`;

const CompanyLogo = styled.View`
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background-color: #f7fafc;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    border: 1px solid #e2e8f0;
`;

const LogoText = styled.Text`
    font-size: 18px;
    font-weight: 700;
    color: #4299e1;
`;

const ExperienceInfo = styled.View`
    flex: 1;
`;

const JobTitle = styled.Text`
    font-size: 18px;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 4px;
    letter-spacing: -0.25px;
`;

const CompanyName = styled.Text`
    font-size: 16px;
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 4px;
`;

const JobMeta = styled.View`
    flex-direction: row;
    align-items: center;
    gap: 16px;
    margin-bottom: 8px;
`;

const DateRange = styled.Text`
    font-size: 14px;
    color: #718096;
    font-weight: 500;
`;

const Location = styled.View`
    flex-direction: row;
    align-items: center;
    gap: 4px;
`;

const LocationText = styled.Text`
    font-size: 14px;
    color: #718096;
    font-weight: 500;
`;

const CurrentBadge = styled.View`
    background-color: #38a169;
    padding: 4px 8px;
    border-radius: 12px;
`;

const CurrentBadgeText = styled.Text`
    font-size: 11px;
    font-weight: 600;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const PromotionBadge = styled.View`
    background-color: #9f7aea;
    padding: 4px 8px;
    border-radius: 12px;
    flex-direction: row;
    align-items: center;
    gap: 4px;
`;

const PromotionBadgeText = styled.Text`
    font-size: 11px;
    font-weight: 600;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const CompanyDuration = styled.Text`
    font-size: 13px;
    color: #718096;
    font-weight: 500;
    margin-left: 8px;
`;

const PositionsList = styled.View`
    margin-top: 16px;
    padding-left: 16px;
    border-left-width: 2px;
    border-left-color: #e2e8f0;
`;

const PositionItem = styled.View`
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom-width: 1px;
    border-bottom-color: #f1f5f9;
`;

const PositionHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
`;

const PositionTitle = styled.Text`
    font-size: 16px;
    font-weight: 600;
    color: #2d3748;
    flex: 1;
`;

const PositionDuration = styled.Text`
    font-size: 12px;
    color: #718096;
    font-weight: 500;
`;

const ExpandButton = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    gap: 4px;
    padding: 8px 0;
    margin-top: 8px;
`;

const ExpandButtonText = styled.Text`
    font-size: 14px;
    color: #4299e1;
    font-weight: 600;
`;

const ExpandedContent = styled.View<{ visible: boolean }>`
    margin-top: 16px;
    display: ${(props) => (props.visible ? "flex" : "none")};
`;

const JobDescription = styled.Text`
    font-size: 15px;
    line-height: 22px;
    color: #4a5568;
    margin-bottom: 16px;
`;

const AchievementsList = styled.View`
    margin-bottom: 16px;
`;

const AchievementItem = styled.View`
    flex-direction: row;
    align-items: flex-start;
    margin-bottom: 8px;
`;

const BulletPoint = styled.View`
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background-color: #4299e1;
    margin-top: 8px;
    margin-right: 12px;
`;

const AchievementText = styled.Text`
    font-size: 14px;
    line-height: 20px;
    color: #4a5568;
    flex: 1;
`;

const SkillsContainer = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
`;

const SkillTag = styled.View`
    background-color: #edf2f7;
    border: 1px solid #e2e8f0;
    padding: 6px 12px;
    border-radius: 14px;
`;

const SkillText = styled.Text`
    font-size: 12px;
    color: #4a5568;
    font-weight: 600;
`;

const DesktopExperienceTimeline: React.FC<DesktopExperienceTimelineProps> = ({
    experiences,
    theme,
}) => {
    const formatDateRange = (startDate: string, endDate?: string) => {
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : null;

        const formatDate = (date: Date) => {
            return date.toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
            });
        };

        const duration = end
            ? Math.round(
                  (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)
              )
            : Math.round(
                  (new Date().getTime() - start.getTime()) /
                      (1000 * 60 * 60 * 24 * 30)
              );

        const years = Math.floor(duration / 12);
        const months = duration % 12;

        let durationText = "";
        if (years > 0) {
            durationText += `${years} yr${years > 1 ? "s" : ""}`;
        }
        if (months > 0) {
            if (years > 0) durationText += " ";
            durationText += `${months} mo${months > 1 ? "s" : ""}`;
        }

        return `${formatDate(start)} - ${
            end ? formatDate(end) : "Present"
        } • ${durationText}`;
    };

    // Group experiences by company to handle promotions
    const groupExperiencesByCompany = (
        experiences: ExperienceItem[]
    ): GroupedExperience[] => {
        const grouped = experiences.reduce((acc, exp) => {
            const existingCompany = acc.find((g) => g.company === exp.company);
            if (existingCompany) {
                existingCompany.positions.push(exp);
            } else {
                acc.push({
                    company: exp.company,
                    companyLogo: exp.companyLogo,
                    location: exp.location,
                    totalDuration: "",
                    positions: [exp],
                    current: exp.current,
                });
            }
            return acc;
        }, [] as GroupedExperience[]);

        // Calculate total duration for each company and sort positions by date
        grouped.forEach((group) => {
            group.positions.sort(
                (a, b) =>
                    new Date(b.startDate).getTime() -
                    new Date(a.startDate).getTime()
            );
            const earliestStart =
                group.positions[group.positions.length - 1].startDate;
            const latestEnd = group.positions[0].endDate || undefined;
            group.totalDuration =
                formatDateRange(earliestStart, latestEnd).split(" • ")[1] || "";
            group.current = group.positions.some((p) => p.current);
        });

        return grouped;
    };

    const groupedExperiences = groupExperiencesByCompany(experiences);

    // Initialize expanded state - auto-expand companies with multiple positions
    const getInitialExpandedItems = () => {
        const initialExpanded = new Set<string>();
        groupedExperiences.forEach((group) => {
            if (group.positions.length > 1) {
                const companyId = `company-${group.company.replace(/\s+/g, "-").toLowerCase()}`;
                initialExpanded.add(companyId);
            }
        });
        return initialExpanded;
    };

    const [expandedItems, setExpandedItems] = useState<Set<string>>(getInitialExpandedItems());

    const toggleExpanded = (id: string) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedItems(newExpanded);
    };

    const getCompanyInitials = (companyName: string) => {
        return companyName
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <TimelineContainer>
            <TimelineLine />
            {groupedExperiences.map((group, index) => {
                const companyId = `company-${group.company
                    .replace(/\s+/g, "-")
                    .toLowerCase()}`;
                const isExpanded = expandedItems.has(companyId);
                const isLast = index === groupedExperiences.length - 1;
                const hasMultiplePositions = group.positions.length > 1;

                return (
                    <TimelineItem
                        key={companyId}
                        isLast={isLast}
                    >
                        <TimelineNode isCurrent={group.current}>
                            {group.current && <CurrentIndicator />}
                        </TimelineNode>

                        <ExperienceCard
                            expanded={isExpanded}
                            onPress={() => toggleExpanded(companyId)}
                            activeOpacity={0.7}
                        >
                            <ExperienceHeader>
                                <CompanyLogo>
                                    <LogoText>
                                        {getCompanyInitials(group.company)}
                                    </LogoText>
                                </CompanyLogo>
                                <ExperienceInfo>
                                    <JobTitle>
                                        {group.positions[0].title}
                                    </JobTitle>
                                    <CompanyName>
                                        {group.company}
                                        <CompanyDuration>
                                            • {group.totalDuration}
                                        </CompanyDuration>
                                    </CompanyName>
                                    <JobMeta>
                                        <Location>
                                            <MaterialIcons
                                                name="location-on"
                                                size={14}
                                                color="#718096"
                                            />
                                            <LocationText>
                                                {group.location}
                                            </LocationText>
                                        </Location>
                                        {hasMultiplePositions && (
                                            <PromotionBadge>
                                                <MaterialIcons
                                                    name="trending-up"
                                                    size={12}
                                                    color="white"
                                                />
                                                <PromotionBadgeText>
                                                    {group.positions.length}{" "}
                                                    roles
                                                </PromotionBadgeText>
                                            </PromotionBadge>
                                        )}
                                        {group.current && (
                                            <CurrentBadge>
                                                <CurrentBadgeText>
                                                    Current
                                                </CurrentBadgeText>
                                            </CurrentBadge>
                                        )}
                                    </JobMeta>
                                </ExperienceInfo>
                            </ExperienceHeader>

                            <ExpandButton
                                onPress={() => toggleExpanded(companyId)}
                            >
                                <ExpandButtonText>
                                    {isExpanded ? "Show less" : "Show more"}
                                </ExpandButtonText>
                                <MaterialIcons
                                    name={
                                        isExpanded
                                            ? "keyboard-arrow-up"
                                            : "keyboard-arrow-down"
                                    }
                                    size={16}
                                    color="#4299E1"
                                />
                            </ExpandButton>

                            <ExpandedContent visible={isExpanded}>
                                {hasMultiplePositions ? (
                                    <PositionsList>
                                        {group.positions.map(
                                            (position, posIndex) => (
                                                <PositionItem key={position.id}>
                                                    <PositionHeader>
                                                        <PositionTitle>
                                                            {position.title}
                                                        </PositionTitle>
                                                        <PositionDuration>
                                                            {
                                                                formatDateRange(
                                                                    position.startDate,
                                                                    position.endDate
                                                                ).split(
                                                                    " • "
                                                                )[0]
                                                            }
                                                        </PositionDuration>
                                                    </PositionHeader>
                                                    <JobDescription>
                                                        {position.description}
                                                    </JobDescription>

                                                    {position.achievements
                                                        .length > 0 && (
                                                        <AchievementsList>
                                                            {position.achievements.map(
                                                                (
                                                                    achievement,
                                                                    idx
                                                                ) => (
                                                                    <AchievementItem
                                                                        key={
                                                                            idx
                                                                        }
                                                                    >
                                                                        <BulletPoint />
                                                                        <AchievementText>
                                                                            {
                                                                                achievement
                                                                            }
                                                                        </AchievementText>
                                                                    </AchievementItem>
                                                                )
                                                            )}
                                                        </AchievementsList>
                                                    )}

                                                    {position.skills.length >
                                                        0 && (
                                                        <SkillsContainer>
                                                            {position.skills.map(
                                                                (
                                                                    skill,
                                                                    idx
                                                                ) => (
                                                                    <SkillTag
                                                                        key={
                                                                            idx
                                                                        }
                                                                    >
                                                                        <SkillText>
                                                                            {
                                                                                skill
                                                                            }
                                                                        </SkillText>
                                                                    </SkillTag>
                                                                )
                                                            )}
                                                        </SkillsContainer>
                                                    )}
                                                </PositionItem>
                                            )
                                        )}
                                    </PositionsList>
                                ) : (
                                    <>
                                        <JobDescription>
                                            {group.positions[0].description}
                                        </JobDescription>

                                        {group.positions[0].achievements
                                            .length > 0 && (
                                            <AchievementsList>
                                                {group.positions[0].achievements.map(
                                                    (achievement, idx) => (
                                                        <AchievementItem
                                                            key={idx}
                                                        >
                                                            <BulletPoint />
                                                            <AchievementText>
                                                                {achievement}
                                                            </AchievementText>
                                                        </AchievementItem>
                                                    )
                                                )}
                                            </AchievementsList>
                                        )}

                                        {group.positions[0].skills.length >
                                            0 && (
                                            <SkillsContainer>
                                                {group.positions[0].skills.map(
                                                    (skill, idx) => (
                                                        <SkillTag key={idx}>
                                                            <SkillText>
                                                                {skill}
                                                            </SkillText>
                                                        </SkillTag>
                                                    )
                                                )}
                                            </SkillsContainer>
                                        )}
                                    </>
                                )}
                            </ExpandedContent>
                        </ExperienceCard>
                    </TimelineItem>
                );
            })}
        </TimelineContainer>
    );
};

export default DesktopExperienceTimeline;
