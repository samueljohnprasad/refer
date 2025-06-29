import React, { useState } from "react";
import { Modal, TouchableOpacity, ScrollView, TextInput } from "react-native";
import styled from "styled-components/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { EnhancedThemeInterface } from "../../constants/enhancedTheme";
import { Profile } from "../../types/profile.types";

interface DesktopProfileEditModalProps {
    isVisible: boolean;
    profile: Profile;
    theme: EnhancedThemeInterface;
    onSave: (updatedProfile: Partial<Profile>) => void;
    onCancel: () => void;
}

const ModalOverlay = styled.View`
    flex: 1;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
    padding: 24px;
`;

const ModalContent = styled.View`
    background-color: #ffffff;
    border-radius: 16px;
    width: 100%;
    max-width: 800px;
    max-height: 80%;
    box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom-width: 1px;
    border-bottom-color: #e5e7eb;
`;

const ModalTitle = styled.Text`
    font-size: 24px;
    font-weight: 600;
    color: #1f2937;
`;

const CloseButton = styled.TouchableOpacity`
    padding: 8px;
    border-radius: 8px;
    background-color: #f3f4f6;
`;

const ModalBody = styled.ScrollView`
    padding: 24px;
`;

const FormSection = styled.View`
    margin-bottom: 24px;
`;

const SectionTitle = styled.Text`
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 16px;
`;

const FormField = styled.View`
    margin-bottom: 16px;
`;

const FieldLabel = styled.Text`
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 8px;
`;

const TextInputField = styled.TextInput`
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 16px;
    color: #1f2937;
    background-color: #ffffff;
    min-height: 48px;
`;

const TextAreaField = styled.TextInput`
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 16px;
    color: #1f2937;
    background-color: #ffffff;
    min-height: 120px;
`;

const SkillsContainer = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
`;

const SkillTag = styled.View`
    background-color: #eff6ff;
    border: 1px solid #dbeafe;
    padding: 8px 12px;
    border-radius: 16px;
    flex-direction: row;
    align-items: center;
    gap: 8px;
`;

const SkillText = styled.Text`
    font-size: 14px;
    color: #1d4ed8;
`;

const RemoveSkillButton = styled.TouchableOpacity`
    padding: 2px;
`;

const AddSkillContainer = styled.View`
    flex-direction: row;
    gap: 8px;
    align-items: center;
    margin-top: 8px;
`;

const AddSkillInput = styled.TextInput`
    flex: 1;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 14px;
    color: #1f2937;
`;

const AddSkillButton = styled.TouchableOpacity`
    background-color: #1d4ed8;
    padding: 8px 16px;
    border-radius: 8px;
`;

const AddSkillText = styled.Text`
    font-size: 14px;
    font-weight: 500;
    color: white;
`;

const SocialLinksGrid = styled.View`
    gap: 16px;
`;

const ModalFooter = styled.View`
    flex-direction: row;
    justify-content: flex-end;
    gap: 12px;
    padding: 24px;
    border-top-width: 1px;
    border-top-color: #e5e7eb;
`;

const CancelButton = styled.TouchableOpacity`
    background-color: #f3f4f6;
    padding: 12px 24px;
    border-radius: 8px;
`;

const CancelButtonText = styled.Text`
    font-size: 16px;
    font-weight: 600;
    color: #374151;
`;

const SaveButton = styled.TouchableOpacity`
    background-color: #1d4ed8;
    padding: 12px 24px;
    border-radius: 8px;
`;

const SaveButtonText = styled.Text`
    font-size: 16px;
    font-weight: 600;
    color: white;
`;

const DesktopProfileEditModal: React.FC<DesktopProfileEditModalProps> = ({
    isVisible,
    profile,
    theme,
    onSave,
    onCancel,
}) => {
    const [formData, setFormData] = useState({
        fullName: profile.fullName || "",
        headline: profile.headline || "",
        summary: profile.summary || "",
        experience: profile.experience || "",
        location: profile.location || "",
        contactEmail: profile.contactEmail || "",
        socialLinks: {
            linkedin: profile.socialLinks?.linkedin || "",
            twitter: profile.socialLinks?.twitter || "",
            github: profile.socialLinks?.github || "",
            website: profile.socialLinks?.website || "",
        },
    });

    const [skills, setSkills] = useState<string[]>(profile.skills || []);
    const [newSkill, setNewSkill] = useState("");

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSocialLinkChange = (platform: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [platform]: value,
            },
        }));
    };

    const addSkill = () => {
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill("");
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter((skill) => skill !== skillToRemove));
    };

    const handleSave = () => {
        const updatedProfile: Partial<Profile> = {
            ...formData,
            skills,
        };
        onSave(updatedProfile);
    };

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={onCancel}
            backdropColor={theme.colors.accent}
        >
            <ModalOverlay>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>Edit Profile</ModalTitle>
                        <CloseButton onPress={onCancel}>
                            <MaterialIcons
                                name="close"
                                size={24}
                                color="#6B7280"
                            />
                        </CloseButton>
                    </ModalHeader>

                    <ModalBody showsVerticalScrollIndicator={false}>
                        {/* Basic Information */}
                        <FormSection>
                            <SectionTitle>Basic Information </SectionTitle>
                            <FormField>
                                <FieldLabel>Full Name</FieldLabel>
                                <TextInputField
                                    value={formData.fullName}
                                    onChangeText={(value) =>
                                        handleInputChange("fullName", value)
                                    }
                                    placeholder="Enter your full name"
                                />
                            </FormField>
                            <FormField>
                                <FieldLabel>Headline</FieldLabel>
                                <TextInputField
                                    value={formData.headline}
                                    onChangeText={(value) =>
                                        handleInputChange("headline", value)
                                    }
                                    placeholder="Professional headline (e.g., Senior Product Manager)"
                                />
                            </FormField>
                            <FormField>
                                <FieldLabel>Location</FieldLabel>
                                <TextInputField
                                    value={formData.location}
                                    onChangeText={(value) =>
                                        handleInputChange("location", value)
                                    }
                                    placeholder="City, State/Country"
                                />
                            </FormField>
                            <FormField>
                                <FieldLabel>Contact Email</FieldLabel>
                                <TextInputField
                                    value={formData.contactEmail}
                                    onChangeText={(value) =>
                                        handleInputChange("contactEmail", value)
                                    }
                                    placeholder="your.email@domain.com"
                                    keyboardType="email-address"
                                />
                            </FormField>
                        </FormSection>

                        {/* About Section */}
                        <FormSection>
                            <SectionTitle>About</SectionTitle>
                            <FormField>
                                <FieldLabel>Summary</FieldLabel>
                                <TextAreaField
                                    value={formData.summary}
                                    onChangeText={(value) =>
                                        handleInputChange("summary", value)
                                    }
                                    placeholder="Tell others about yourself, your experience, and what you're passionate about..."
                                    multiline={true}
                                    numberOfLines={6}
                                />
                            </FormField>
                        </FormSection>

                        {/* Experience */}
                        <FormSection>
                            <SectionTitle>Experience</SectionTitle>
                            <FormField>
                                <FieldLabel>Professional Experience</FieldLabel>
                                <TextAreaField
                                    value={formData.experience}
                                    onChangeText={(value) =>
                                        handleInputChange("experience", value)
                                    }
                                    placeholder="Describe your work experience, roles, and achievements..."
                                    multiline={true}
                                    numberOfLines={4}
                                />
                            </FormField>
                        </FormSection>

                        {/* Skills */}
                        <FormSection>
                            <SectionTitle>Skills</SectionTitle>
                            <FieldLabel>Your Skills</FieldLabel>
                            <SkillsContainer>
                                {skills.map((skill, index) => (
                                    <SkillTag key={index}>
                                        <SkillText>{skill}</SkillText>
                                        <RemoveSkillButton
                                            onPress={() => removeSkill(skill)}
                                        >
                                            <MaterialIcons
                                                name="close"
                                                size={16}
                                                color="#1D4ED8"
                                            />
                                        </RemoveSkillButton>
                                    </SkillTag>
                                ))}
                            </SkillsContainer>
                            <AddSkillContainer>
                                <AddSkillInput
                                    value={newSkill}
                                    onChangeText={setNewSkill}
                                    placeholder="Add a skill"
                                    onSubmitEditing={addSkill}
                                />
                                <AddSkillButton onPress={addSkill}>
                                    <AddSkillText>Add</AddSkillText>
                                </AddSkillButton>
                            </AddSkillContainer>
                        </FormSection>

                        {/* Social Links */}
                        <FormSection>
                            <SectionTitle>Social Links</SectionTitle>
                            <SocialLinksGrid>
                                <FormField>
                                    <FieldLabel>LinkedIn</FieldLabel>
                                    <TextInputField
                                        value={formData.socialLinks.linkedin}
                                        onChangeText={(value) =>
                                            handleSocialLinkChange(
                                                "linkedin",
                                                value
                                            )
                                        }
                                        placeholder="linkedin.com/in/your-profile"
                                    />
                                </FormField>
                                <FormField>
                                    <FieldLabel>Twitter</FieldLabel>
                                    <TextInputField
                                        value={formData.socialLinks.twitter}
                                        onChangeText={(value) =>
                                            handleSocialLinkChange(
                                                "twitter",
                                                value
                                            )
                                        }
                                        placeholder="@yourusername"
                                    />
                                </FormField>
                                <FormField>
                                    <FieldLabel>GitHub</FieldLabel>
                                    <TextInputField
                                        value={formData.socialLinks.github}
                                        onChangeText={(value) =>
                                            handleSocialLinkChange(
                                                "github",
                                                value
                                            )
                                        }
                                        placeholder="github.com/yourusername"
                                    />
                                </FormField>
                                <FormField>
                                    <FieldLabel>Website</FieldLabel>
                                    <TextInputField
                                        value={formData.socialLinks.website}
                                        onChangeText={(value) =>
                                            handleSocialLinkChange(
                                                "website",
                                                value
                                            )
                                        }
                                        placeholder="https://yourwebsite.com"
                                    />
                                </FormField>
                            </SocialLinksGrid>
                        </FormSection>
                    </ModalBody>

                    <ModalFooter>
                        <CancelButton onPress={onCancel}>
                            <CancelButtonText>Cancel</CancelButtonText>
                        </CancelButton>
                        <SaveButton onPress={handleSave}>
                            <SaveButtonText>Save Changes</SaveButtonText>
                        </SaveButton>
                    </ModalFooter>
                </ModalContent>
            </ModalOverlay>
        </Modal>
    );
};

export default DesktopProfileEditModal;
