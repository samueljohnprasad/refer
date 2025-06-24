import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '@/context/ThemeContext';
import { JobSeekerPost } from '@/types/posts';
import { createReferral } from '@/services/referral.service';
import Modal from './common/Modal';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const ReferralInput = styled.TextInput`
    background-color: ${props => props.theme.colors.background};
    border-radius: 10px;
    padding: 15px;
    font-size: 16px;
    color: ${props => props.theme.colors.text};
    min-height: 100px;
    border-width: 1px;
    border-color: ${props => props.theme.colors.border};
    margin-bottom: 20px;
`;

const SubmitButton = styled.TouchableOpacity`
    background-color: ${props => props.theme.colors.primary};
    padding: 15px;
    border-radius: 10px;
    align-items: center;
`;

const SubmitButtonText = styled.Text`
    font-size: 16px;
    font-weight: bold;
    color: white;
`;

interface ReferralModalProps {
    visible: boolean;
    onClose: () => void;
    post: JobSeekerPost | null;
}

export default function ReferralModal({ visible, onClose, post }: ReferralModalProps) {
    const { theme } = useTheme();
    const [referralMessage, setReferralMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (!visible) {
            setTimeout(() => {
                setReferralMessage('');
                setIsSubmitting(false);
                setIsSubmitted(false);
            }, 300);
        }
    }, [visible]);

    const handleSubmit = async () => {
        if (!post || !referralMessage.trim()) {
            Alert.alert('Missing Information', 'Please write a message to submit your referral.');
            return;
        }

        setIsSubmitting(true);
        setIsSubmitted(false);

        try {
            await createReferral({ postId: post._id || '', message: referralMessage });
            setIsSubmitted(true);

            setTimeout(() => {
                onClose();
            }, 1200);

        } catch (error) {
            Alert.alert('Error', 'Failed to send referral. Please try again.');
            setIsSubmitting(false);
        }
    };
    
    if (!post) {
        return null;
    }

    return (
        <Modal
            visible={visible}
            onClose={onClose}
            title={`Refer ${post.user}`}
        >
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ReferralInput
                    placeholder="Why are you recommending this person?"
                    placeholderTextColor={theme.colors.text + '80'}
                    multiline
                    value={referralMessage}
                    onChangeText={setReferralMessage}
                    textAlignVertical="top"
                    editable={!isSubmitting}
                />

                <SubmitButton onPress={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? (
                        isSubmitted ? (
                            <>
                                <FontAwesome name="check" size={16} color="white" style={{marginRight: 8}}/>
                                <SubmitButtonText>Submitted!</SubmitButtonText>
                            </>
                        ) : (
                            <>
                                <ActivityIndicator size="small" color="white" style={{marginRight: 8}}/>
                                <SubmitButtonText>Submitting...</SubmitButtonText>
                            </>
                        )
                    ) : (
                        <SubmitButtonText>Submit Referral</SubmitButtonText>
                    )}
                </SubmitButton>
            </KeyboardAvoidingView>
        </Modal>
    );
} 