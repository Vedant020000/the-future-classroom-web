'use client';

import PocketBase from 'pocketbase';
import { User } from './AuthContext';

// Initialize the PocketBase client
// Replace with your PocketBase URL when deployed
const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
const pb = new PocketBase(pbUrl);

// Helper function to check if we're on the client side
export const isClient = (): boolean => typeof window !== 'undefined';

// Export the PocketBase instance
export default pb;

// Authentication helpers
export const login = async (email: string, password: string) => {
    return await pb.collection('users').authWithPassword(email, password);
};

export const loginWithGoogle = async () => {
    // Get the current URL for the redirect
    const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/login`
        : 'http://localhost:3000/login';

    // PocketBase requires a redirect for OAuth authentication
    const authData = await pb.collection('users').authWithOAuth2({
        provider: 'google',
        // These are the scopes we need for basic profile info
        scopes: ['email', 'profile'],
        // Explicitly set the redirect URL to ensure it works correctly
        redirectUrl: redirectUrl,
    });

    return authData;
};

export const logout = (): void => {
    pb.authStore.clear();
};

export const register = async (
    email: string,
    password: string,
    passwordConfirm: string,
    name: string
) => {
    const data = {
        email,
        password,
        passwordConfirm,
        name,
    };

    return await pb.collection('users').create(data);
};

export const getCurrentUser = (): User | null => {
    return pb.authStore.model as User | null;
};

export const isAuthenticated = (): boolean => {
    return pb.authStore.isValid;
};

// Helper to get file URLs safely
export const getFileUrl = (record: any, filename: string): string => {
    try {
        if (!record || !filename) return '';

        // For files stored in PocketBase
        return `${pbUrl}/api/files/${record.collectionId}/${record.id}/${filename}`;
    } catch (error) {
        console.error('Error getting file URL:', error);
        return '';
    }
}; 