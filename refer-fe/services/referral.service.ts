import api from './api';

interface ReferralPayload {
    postId: string;
    message: string;
}

export const createReferral = async (payload: ReferralPayload) => {
    try {
        const response = await api.post('/referrals', payload);
        return response.data;
    } catch (error) {
        // Handle or throw error as needed
        console.error('Error creating referral:', error);
        throw error;
    }
}; 