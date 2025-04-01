'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import pb, { isClient, getCurrentUser, isAuthenticated } from './pocketbase';

// Define type for user
export interface User {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    [key: string]: any; // For any other fields that might be present
}

// Define type for auth context
interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    refresh: () => Promise<void>;
}

// Default context value
const defaultContextValue: AuthContextType = {
    user: null,
    isLoading: true,
    isAuthenticated: false,
    refresh: async () => { },
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Function to refresh the auth state
    const refresh = async () => {
        if (isClient()) {
            setUser(getCurrentUser() as User | null);
        }
    };

    useEffect(() => {
        // Subscribe to auth state changes
        if (isClient()) {
            // Set initial user state
            setUser(getCurrentUser() as User | null);
            setIsLoading(false);

            // Listen for auth state changes
            pb.authStore.onChange(() => {
                setUser(getCurrentUser() as User | null);
            });
        }
    }, []);

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: isAuthenticated(),
        refresh,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 