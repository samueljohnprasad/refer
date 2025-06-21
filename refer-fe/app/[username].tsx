import React, { useEffect } from "react";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import ProfileView from '../components/profile/ProfileView';
import { IProfileData } from '../components/profile/types';
import { Profile } from '../types/profile.types';
import { RootState, AppDispatch } from "../store";
import { fetchProfileByUsername } from "../store/profileThunks";
import { clearPublicProfile } from "../store/profileSlice";

export default function PublicProfileScreen() {
    const { username } = useLocalSearchParams<{ username: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { publicProfile, isLoading, error } = useSelector(
        (state: RootState) => state.profile
    );

    useEffect(() => {
        if (username) {
            dispatch(fetchProfileByUsername(username));
        }

        // Cleanup on unmount
        return () => {
            dispatch(clearPublicProfile());
        };
    }, [username, dispatch]);
    
    // Transform the publicProfile data into the structure needed by ProfileView
    const formattedProfileData = React.useMemo((): IProfileData | undefined => {
        if (!publicProfile) return undefined;
        
        // Extract skills from the profile or use defaults
        const skills = publicProfile.skills || ['JavaScript', 'TypeScript', 'React Native'];
        
        // Create formatted experience array from the profile's experience string
        // For demo purposes, we'll parse experience from a string to an array of objects
        let formattedExperience = [
            {
                id: '1',
                role: 'Software Engineer',
                company: 'Tech Company',
                duration: '2020 - Present'
            }
        ];
        
        // For education, we'll use default values since it's not in the Profile type
        const formattedEducation = [
            {
                id: '1',
                degree: 'Computer Science',
                institution: 'University',
                year: '2019'
            }
        ];
        
        // Format the profile data according to our ProfileView component's requirements
        return {
            id: publicProfile._id || '',
            name: publicProfile.fullName || username || '',
            username: publicProfile.username || username || '',
            bio: publicProfile.summary || publicProfile.headline || 'Professional profile',
            location: publicProfile.location || 'San Francisco, CA',
            website: publicProfile.socialLinks?.website || 'https://example.com',
            profileImage: 'https://randomuser.me/api/portraits/lego/2.jpg', // Placeholder
            coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809', // Placeholder
            stats: {
                connections: 0, // Default placeholder
                referrals: 0, // Default placeholder
                endorsements: 0 // Default placeholder
            },
            skills: skills,
            experience: formattedExperience,
            education: formattedEducation
        };
    }, [publicProfile, username]);

    return (
        <View style={styles.container}>
            {username ? (
                <ProfileView 
                    username={username} 
                    isPublic={true} 
                    profileData={formattedProfileData}
                    isLoading={isLoading}
                    error={error}
                />
            ) : (
                <Text style={styles.errorText}>Invalid profile URL</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    errorText: {
        color: "#ff3b30",
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
    },
});
