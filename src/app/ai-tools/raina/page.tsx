'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import styles from './page.module.css';
import { allTools } from '@/lib/aiToolsData';
import AiToolForm from '@/components/ai-tools/AiToolForm';
import AiToolResponse from '@/components/ai-tools/AiToolResponse';

// Find the tool data for Raina (AI Teaching Assistant)
const toolData = allTools.find(tool => tool.id === 'assistant'); // Use 'assistant' ID

// Define ApiResponse interface
interface ApiResponse {
    response?: string;
    error?: string;
    details?: string;
}

export default function RainaPage() {
    const router = useRouter();
    const { user, isLoading: authIsLoading, isAuthenticated } = useAuth();
    const [pageLoading, setPageLoading] = useState(true);
    const [response, setResponse] = useState<ApiResponse | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (!authIsLoading && !isAuthenticated) {
            router.push('/login?from=ai-tools/raina'); // Update redirect path
            return;
        }
        if (!authIsLoading) {
            setPageLoading(false);
        }
    }, [authIsLoading, isAuthenticated, router]);

    // Form submission handler
    const handleSubmit = useCallback(async (formData: Record<string, any>) => {
        if (!toolData) return;
        setIsGenerating(true);
        setResponse(null);
        console.log('Submitting Raina (Assistant) Request:', formData);

        try {
            // Use the assistant API route
            const apiResponse = await fetch('/api/assistant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data: ApiResponse = await apiResponse.json();
            if (!apiResponse.ok) throw new Error(data.details || data.error || `HTTP error! status: ${apiResponse.status}`);
            setResponse(data);
        } catch (err: any) {
            console.error('API call failed:', err);
            setResponse({ error: 'Request failed', details: err.message });
        } finally {
            setIsGenerating(false);
        }
    }, []);

    if (pageLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Loading Raina...</p>
            </div>
        );
    }

    if (!toolData) {
        return (
            <div className={styles.pageContainer}>
                <p>Error: AI Teaching Assistant tool data could not be loaded.</p>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <h1 className={styles.title}>
                    {toolData.icon} {toolData.name}
                    {toolData.beta && <span className={styles.betaTag}>BETA</span>}
                </h1>
                <p className={styles.description}>{toolData.description}</p>
                {toolData.disclaimer && <p className={styles.disclaimer}>{toolData.disclaimer}</p>}
            </header>

            <AiToolForm
                formFields={toolData.formFields}
                onSubmit={handleSubmit}
                isLoading={isGenerating}
                submitButtonText="Ask Raina"
            />
            <AiToolResponse response={response} isLoading={isGenerating} />

        </div>
    );
} 