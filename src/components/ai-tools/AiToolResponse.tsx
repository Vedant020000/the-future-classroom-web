'use client';

import React from 'react';
import styles from './AiToolResponse.module.css';

interface ApiResponse {
    response?: string;
    error?: string;
    details?: string;
}

interface AiToolResponseProps {
    response: ApiResponse | null;
    isLoading: boolean;
}

const AiToolResponse: React.FC<AiToolResponseProps> = ({ response, isLoading }) => {
    if (isLoading) {
        return (
            <div className={`${styles.responseContainer} ${styles.loading}`}>
                <div className={styles.spinner}></div>
                <p>Generating response...</p>
            </div>
        );
    }

    if (!response) {
        return null; // Nothing to show yet
    }

    if (response.error) {
        return (
            <div className={`${styles.responseContainer} ${styles.error}`}>
                <h3>Error</h3>
                <p>{response.error}</p>
                {response.details && <p className={styles.errorDetails}>{response.details}</p>}
            </div>
        );
    }

    if (response.response) {
        return (
            <div className={`${styles.responseContainer} ${styles.success}`}>
                <h3>Response</h3>
                {/* Render newlines correctly and handle potential markdown */}
                <div className={styles.responseText} dangerouslySetInnerHTML={{ __html: response.response.replace(/\n/g, '<br />') }}></div>
                {/* Note: dangerouslySetInnerHTML is used for simplicity. Consider a markdown parser for safer rendering */}
            </div>
        );
    }

    return null; // Should not happen if response object is well-formed
};

export default AiToolResponse; 