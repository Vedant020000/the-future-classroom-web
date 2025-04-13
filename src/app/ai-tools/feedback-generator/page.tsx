'use client';

import React, { useState, useCallback } from 'react';
import styles from './page.module.css';
import { allTools } from '@/lib/aiToolsData';
import AiToolForm from '@/components/ai-tools/AiToolForm';
import AiToolResponse from '@/components/ai-tools/AiToolResponse';

const toolData = allTools.find(tool => tool.id === 'feedback-generator');

interface ApiResponse {
    response?: string;
    error?: string;
    details?: string;
}

const FeedbackGeneratorPage = () => {
    const [response, setResponse] = useState<ApiResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = useCallback(async (formData: Record<string, any>) => {
        if (!toolData) return;
        setIsLoading(true);
        setResponse(null);
        console.log('Submitting Feedback Generator Request:', formData);

        try {
            const apiResponse = await fetch('/api/feedback-generator', {
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
            setIsLoading(false);
        }
    }, []);

    if (!toolData) return <p>Error: Tool data not found.</p>;

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <h1 className={styles.title}>{toolData.icon} {toolData.name}</h1>
                <p className={styles.description}>{toolData.description}</p>
                {toolData.disclaimer && <p className={styles.disclaimer}>{toolData.disclaimer}</p>}
            </header>
            <AiToolForm
                formFields={toolData.formFields}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                submitButtonText="Generate Feedback"
            />
            <AiToolResponse response={response} isLoading={isLoading} />
        </div>
    );
};

export default FeedbackGeneratorPage; 