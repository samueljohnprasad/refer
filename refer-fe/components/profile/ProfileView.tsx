import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Platform, ActivityIndicator, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { useWindowDimensions } from "react-native";
import { ProfileViewProps, IProfileData } from "./types";
import EditProfileScreen from "./EditProfileScreen";

// Types are imported from ./types.ts

const ProfileView: React.FC<ProfileViewProps> = ({ 
  username, 
  isPublic = false, 
  profileData: externalProfileData, 
  isLoading = false,
  error = null
 }) => {
  const dimensions = useWindowDimensions();
  const isSmallScreen = dimensions.width < 768;
  
  // State to control the edit profile modal visibility
  const [editProfileModalVisible, setEditProfileModalVisible] = useState<boolean>(false);
  
  // Default mock data that will be used if no profileData is provided
  const mockData: IProfileData = {
    name: "Jane Doe",
    username: username || "janedoe",
    bio: "Senior Software Engineer | React Native & TypeScript Expert | Open to new opportunities",
    location: "San Francisco, CA",
    website: "https://janedoe.dev",
    profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
    coverImage: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
    stats: {
      connections: 253,
      referrals: 15,
      endorsements: 42,
    },
    skills: ["React Native", "TypeScript", "JavaScript", "Redux", "Node.js", "GraphQL", "React"],
    experience: [
      {
        id: "1",
        role: "Senior Software Engineer",
        company: "TechCorp Inc.",
        duration: "2020 - Present"
      },
      {
        id: "2",
        role: "Frontend Developer",
        company: "StartupXYZ",
        duration: "2018 - 2020"
      }
    ],
    education: [
      {
        id: "1",
        degree: "M.S. Computer Science",
        institution: "Stanford University",
        year: "2018"
      }
    ]
  };
  
  // Use provided profileData or fallback to mock data
  const profileData = externalProfileData || mockData;

  // Show loading indicator if data is loading
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0077B5" />
      </View>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Function to handle profile save (just UI, no actual functionality)
  const handleSaveProfile = (updatedData: IProfileData) => {
    console.log('Profile data to be saved:', updatedData);
    setEditProfileModalVisible(false);
    // This would typically dispatch an action to update the profile in Redux
  };

  return (
    <>
      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={editProfileModalVisible}
        onRequestClose={() => setEditProfileModalVisible(false)}
      >
        <EditProfileScreen 
          profileData={profileData}
          onClose={() => setEditProfileModalVisible(false)}
          onSave={handleSaveProfile}
        />
      </Modal>
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
      {/* Cover Photo */}
      <CoverImageContainer>
        <CoverImage
          source={{ uri: profileData.coverImage }}
          resizeMode="cover"
        />
      </CoverImageContainer>

      {/* Profile Header Section */}
      <ProfileHeaderContainer>
        <ProfileImageWrapper>
          <ProfileImage
            source={{ uri: profileData.profileImage }}
            resizeMode="cover"
          />
        </ProfileImageWrapper>

        <ProfileInfoContainer
          style={
            isSmallScreen
              ? styles.profileInfoMobile
              : styles.profileInfoDesktop
          }
        >
          <ProfileName>{profileData.name}</ProfileName>
          <UsernameText>@{profileData.username}</UsernameText>

          <View style={styles.locationContainer}>
            <Ionicons
              name="location-outline"
              size={16}
              color="#666"
            />
            <LocationText>{profileData.location}</LocationText>
          </View>

          <View style={styles.websiteContainer}>
            <Ionicons
              name="link-outline"
              size={16}
              color="#0077B5"
            />
            <WebsiteText>{profileData.website}</WebsiteText>
          </View>
        </ProfileInfoContainer>

        {!isPublic && (
          <ButtonsContainer
            style={
              isSmallScreen ? styles.buttonsContainerMobile : {}
            }
          >
            <EditProfileButton onPress={() => setEditProfileModalVisible(true)}>
              <ButtonText>Edit Profile</ButtonText>
            </EditProfileButton>
          </ButtonsContainer>
        )}
      </ProfileHeaderContainer>

      {/* Bio Section */}
      <Section>
        <BioText>{profileData.bio}</BioText>
      </Section>

      {/* Stats Section */}
      <Section>
        <SectionTitle>Network</SectionTitle>
        <StatsContainer>
          <StatItem>
            <StatValue>{profileData.stats.connections}</StatValue>
            <StatLabel>Connections</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{profileData.stats.referrals}</StatValue>
            <StatLabel>Referrals</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{profileData.stats.endorsements}</StatValue>
            <StatLabel>Endorsements</StatLabel>
          </StatItem>
        </StatsContainer>
      </Section>

      {/* Skills Section */}
      <Section>
        <SectionTitle>Skills</SectionTitle>
        <SkillsContainer>
          {profileData.skills.map((skill, index) => (
            <SkillTag key={index}>
              <SkillText>{skill}</SkillText>
            </SkillTag>
          ))}
        </SkillsContainer>
      </Section>

      {/* Experience Section */}
      <Section>
        <SectionTitle>Experience</SectionTitle>
        {profileData.experience.map((exp) => (
          <ExperienceItem key={exp.id}>
            <ExperienceRole>{exp.role}</ExperienceRole>
            <ExperienceCompany>{exp.company}</ExperienceCompany>
            <ExperienceDuration>{exp.duration}</ExperienceDuration>
          </ExperienceItem>
        ))}
      </Section>

      {/* Education Section */}
      <Section>
        <SectionTitle>Education</SectionTitle>
        {profileData.education.map((edu) => (
          <EducationItem key={edu.id}>
            <EducationDegree>{edu.degree}</EducationDegree>
            <EducationInstitution>
              {edu.institution}
            </EducationInstitution>
            <EducationYear>{edu.year}</EducationYear>
          </EducationItem>
        ))}
      </Section>
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  contentContainer: {
    paddingBottom: 40,
  },
  profileInfoMobile: {
    marginTop: 60,
    alignItems: "center",
    width: "100%",
  },
  profileInfoDesktop: {
    marginLeft: 20,
    flex: 1,
    justifyContent: "center",
  },
  buttonsContainerMobile: {
    marginTop: 16,
    width: "100%",
    alignItems: "center",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  websiteContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 16,
    textAlign: "center",
  },
});

// Styled Components
const CoverImageContainer = styled.View`
  width: 100%;
  height: 180px;
  position: relative;
`;

const CoverImage = styled.Image`
    width: 100%;
    height: 100%;
`;

const ProfileHeaderContainer = styled.View`
    padding: 0 20px;
    position: relative;
    flex-direction: ${Platform.OS === "web" &&
    typeof window !== "undefined" &&
    window.innerWidth > 768
        ? "row"
        : "column"};
    align-items: ${Platform.OS === "web" &&
    typeof window !== "undefined" &&
    window.innerWidth > 768
        ? "flex-end"
        : "center"};
`;

const ProfileImageWrapper = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  border-width: 3px;
  border-color: #ffffff;
  overflow: hidden;
  margin-top: -50px;
  background-color: #ffffff;
  ${Platform.OS === 'android' ? 'elevation: 4;' : `
    shadowColor: #000000;
    shadowOffset: 0px 2px;
    shadowOpacity: 0.2;
    shadowRadius: 5px;
  `}
`;

const ProfileImage = styled.Image`
    width: 100%;
    height: 100%;
`;

const ProfileInfoContainer = styled.View`
    padding: 10px 0;
`;

const ProfileName = styled.Text`
    font-size: 22px;
    font-weight: 700;
    color: #333333;
`;

const UsernameText = styled.Text`
    font-size: 16px;
    color: #666666;
    margin-top: 4px;
`;

const LocationText = styled.Text`
    font-size: 14px;
    color: #666666;
    margin-left: 4px;
`;

const WebsiteText = styled.Text`
    font-size: 14px;
    color: #0077b5;
    margin-left: 4px;
`;

const ButtonsContainer = styled.View`
    margin-top: 10px;
    margin-left: auto;
`;

const EditProfileButton = styled.TouchableOpacity`
    background-color: #0077b5;
    padding: 10px 20px;
    border-radius: 25px;
    align-items: center;
    justify-content: center;
`;

const ButtonText = styled.Text`
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
`;

const Section = styled.View`
    padding: 16px 20px;
    border-bottom-width: 1px;
    border-bottom-color: #eeeeee;
`;

const SectionTitle = styled.Text`
    font-size: 18px;
    font-weight: 600;
    color: #333333;
    margin-bottom: 12px;
`;

const BioText = styled.Text`
    font-size: 16px;
    line-height: 22px;
    color: #444444;
`;

const StatsContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
`;

const StatItem = styled.View`
    align-items: center;
    flex: 1;
`;

const StatValue = styled.Text`
    font-size: 20px;
    font-weight: 700;
    color: #333333;
`;

const StatLabel = styled.Text`
    font-size: 14px;
    color: #666666;
    margin-top: 4px;
`;

const SkillsContainer = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
`;

const SkillTag = styled.View`
    background-color: #e8f4fc;
    padding: 8px 12px;
    border-radius: 20px;
    margin-right: 8px;
    margin-bottom: 8px;
`;

const SkillText = styled.Text`
    color: #0077b5;
    font-size: 14px;
`;

const ExperienceItem = styled.View`
    margin-bottom: 16px;
`;

const ExperienceRole = styled.Text`
    font-size: 16px;
    font-weight: 600;
    color: #333333;
`;

const ExperienceCompany = styled.Text`
    font-size: 15px;
    color: #555555;
    margin-top: 2px;
`;

const ExperienceDuration = styled.Text`
    font-size: 14px;
    color: #777777;
    margin-top: 2px;
`;

const EducationItem = styled.View`
    margin-bottom: 16px;
`;

const EducationDegree = styled.Text`
    font-size: 16px;
    font-weight: 600;
    color: #333333;
`;

const EducationInstitution = styled.Text`
    font-size: 15px;
    color: #555555;
    margin-top: 2px;
`;

const EducationYear = styled.Text`
    font-size: 14px;
    color: #777777;
    margin-top: 2px;
`;

export default ProfileView;
