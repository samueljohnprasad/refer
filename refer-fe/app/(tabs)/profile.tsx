import React, { useEffect, useMemo } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import ProfileView from '../../components/profile/ProfileView';
import { router } from "expo-router";

export default function ProfileScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const { user, token, loading, error } = useSelector((state: RootState) => state.auth);
    
    // Redirect to auth if not logged in
    useEffect(() => {
        if (!user || !token) {
            // Uncomment to redirect to login screen
            // router.replace('/login');
        }
    }, [user, token]);
    
    // Transform user data to profile data format expected by the ProfileView component
    const profileData = useMemo(() => {
        if (!user) return undefined;
        
        // Create a display name from firstName and lastName
        const displayName = [user.firstName, user.lastName]
            .filter(Boolean)
            .join(' ') || user.email.split('@')[0];
            
        // For demo purposes, create a username from email if not provided
        const username = user.email.split('@')[0];
        
        return {
            id: user.id,
            name: displayName,
            username: username,
            bio: 'Professional with expertise in software development', // Default placeholder
            location: 'San Francisco, CA', // Default placeholder
            website: 'https://example.com', // Default placeholder
            profileImage: 'https://randomuser.me/api/portraits/lego/1.jpg', // Placeholder
            coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809', // Placeholder
            stats: {
                connections: 0, // Default placeholder
                referrals: 0, // Default placeholder
                endorsements: 0 // Default placeholder
            },
            skills: [
                'JavaScript', 'TypeScript', 'React Native', 'Node.js'
            ], // Default placeholders
            experience: [
                {
                    id: '1',
                    role: 'Software Developer',
                    company: 'Example Corp',
                    duration: '2020 - Present'
                }
            ], // Default placeholders
            education: [
                {
                    id: '1',
                    degree: 'Bachelor of Computer Science',
                    institution: 'University Example',
                    year: '2019'
                }
            ] // Default placeholders
        };
    }, [user]);

    if (!user || !token) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Please login to view your profile</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ProfileView 
                profileData={profileData} 
                isLoading={loading} 
                error={error} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    loadingText: {
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
        color: "#666",
    },
});
