'use client';

import React, { useState, useCallback } from 'react';
import styles from './page.module.css';
import { allTools, AiTool } from '@/lib/aiToolsData';
import AiToolForm from '@/components/ai-tools/AiToolForm'; // Assuming a reusable form component exists
import AiToolResponse from '@/components/ai-tools/AiToolResponse'; // Assuming a reusable response component

// Find the tool data for AI Teaching Assistant
const toolData = allTools.find(tool => tool.id === 'assistant');

interface ApiResponse {
    response?: string;
    error?: string;
    details?: string;
}

const AssistantPage = () => {
    const [response, setResponse] = useState<ApiResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = useCallback(async (formData: Record<string, any>) => {
        if (!toolData) return;
        setIsLoading(true);
        setResponse(null);
        console.log('Submitting Assistant Request:', formData);

        try {
            // Construct payload - needs backend agreement (e.g., JSON)
            const payload = { ...formData };

            const apiResponse = await fetch('/api/assistant', { // Changed API endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data: ApiResponse = await apiResponse.json();

            if (!apiResponse.ok) {
                throw new Error(data.details || data.error || `HTTP error! status: ${apiResponse.status}`);
            }

            setResponse(data);

        } catch (err: any) {
            console.error('API call failed:', err);
            setResponse({ error: 'Request failed', details: err.message });
        } finally {
            setIsLoading(false);
        }
    }, []);

    if (!toolData) {
        return <p>Error: Tool data not found.</p>;
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
                isLoading={isLoading}
                submitButtonText="Ask Assistant"
            />

            <AiToolResponse response={response} isLoading={isLoading} />

        </div>
    );
};

export default AssistantPage; 