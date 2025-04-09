'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { useAuth } from '@/lib/AuthContext';
import { redirect } from 'next/navigation';
import { allTools, AiTool, FormField } from '@/lib/aiToolsData';
import PbImage from '@/components/PbImage';
import { getUserUsage, AiUsageRecord } from '@/lib/aiUsage';

export default function AIAccessPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const toolId = searchParams.get('tool');

    const currentTool = allTools.find((t: AiTool) => t.id === toolId);

    // --- State for Form ---
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [generatedContent, setGeneratedContent] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- State for Usage ---
    const [usageStats, setUsageStats] = useState<AiUsageRecord | null>(null);
    const [usageLoading, setUsageLoading] = useState(true);

    // --- Load Usage Stats ---
    useEffect(() => {
        const loadUsageStats = async () => {
            if (user?.id) {
                setUsageLoading(true);
                try {
                    const stats = await getUserUsage(user.id);
                    setUsageStats(stats);
                } catch (error) {
                    console.error('Failed to load usage stats:', error);
                } finally {
                    setUsageLoading(false);
                }
            }
        };

        loadUsageStats();
    }, [user]);

    // --- Initialize Form State ---
    useEffect(() => {
        if (currentTool) {
            const initialFormData: Record<string, string> = {};
            currentTool.formFields.forEach(field => {
                initialFormData[field.id] = ''; // Initialize all fields to empty string
            });
            setFormData(initialFormData);
            setGeneratedContent(null); // Reset content when tool changes
            setError(null); // Reset error when tool changes
        }
    }, [currentTool]);

    // --- Authentication and Tool Validation ---
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            const safeToolId = toolId ? encodeURIComponent(toolId) : '';
            const fromPath = encodeURIComponent(`/ai-access?tool=${safeToolId}`);
            console.log('Redirecting to login, from path:', fromPath); // Debug log
            redirect(`/login?from=${fromPath}`);
        }
        if (!isLoading && isAuthenticated && !currentTool && toolId !== null) {
            // Debug logs before redirecting back
            console.warn('Redirecting back to /ai-tools. Values:');
            console.log(`  isLoading: ${isLoading}`);
            console.log(`  isAuthenticated: ${isAuthenticated}`);
            console.log(`  toolId: ${toolId}`);
            console.log(`  currentTool found: ${!!currentTool}`); // Log if currentTool is truthy/falsy
            router.push('/ai-tools');
        }
    }, [isLoading, isAuthenticated, toolId, currentTool, router]);

    // --- Form Input Change Handler ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- Form Submission Handler ---
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!currentTool || isGenerating) return;

        setIsGenerating(true);
        setGeneratedContent(null); // Clear previous content
        setError(null); // Clear previous error

        try {
            // Basic validation: check for required fields
            let missingFields = false;
            for (const field of currentTool.formFields) {
                if (field.required && !formData[field.id]?.trim()) {
                    missingFields = true;
                    break;
                }
            }
            if (missingFields) {
                throw new Error("Please fill in all required fields.");
            }

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    toolId: currentTool.id,
                    formData: formData // Send the structured form data
                }),
            });

            if (!response.ok) {
                let errorMsg = 'API request failed';
                try {
                    const errorData = await response.json();
                    if (response.status === 429) {
                        // Daily limit reached error
                        errorMsg = errorData.message || 'You have reached your daily limit of AI queries. Please try again tomorrow.';
                    } else {
                        errorMsg = errorData.error || `Server responded with status ${response.status}`;
                    }
                } catch (jsonError) {
                    // Handle cases where the response is not valid JSON
                    errorMsg = `Server responded with status ${response.status}`;
                }
                throw new Error(errorMsg);
            }

            const data = await response.json();
            setGeneratedContent(data.generatedText || 'Sorry, I couldn\'t generate a response.');

            // Update usage stats after successful generation
            if (data.usage?.queryRecorded && user?.id) {
                const updatedStats = await getUserUsage(user.id);
                setUsageStats(updatedStats);
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setIsGenerating(false);
        }
    };

    // --- Loading State ---
    if (isLoading || (toolId !== null && !currentTool)) { // Check toolId exists before complaining about currentTool
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Loading tool...</p>
            </div>
        );
    }
    // Handle case where no tool ID is provided in the URL at all
    if (!toolId) {
        return (
            <div className={styles.loadingContainer}>
                <p>No AI tool selected. Please go back and choose a tool.</p>
                <Link href="/ai-tools" className={styles.backButtonStandalone}>
                    Back to Tools
                </Link>
            </div>
        );
    }

    // --- Helper for User Initials ---
    const getUserInitials = (name?: string) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length > 1) {
            return parts[0][0] + parts[parts.length - 1][0];
        } else if (parts[0].length > 1) {
            return parts[0].substring(0, 2);
        }
        return name[0] || 'U';
    };
    const userInitials = getUserInitials(user?.name);

    // --- Helper Function to Render Form Fields ---
    const renderFormField = (field: FormField) => {
        const commonProps = {
            id: field.id,
            name: field.id,
            value: formData[field.id] || '',
            onChange: handleInputChange,
            placeholder: field.placeholder || '',
            required: field.required,
            className: styles.formInput // Add a common class
        };

        switch (field.type) {
            case 'textarea':
                return <textarea {...commonProps} rows={4} />;
            case 'select':
                return (
                    <select {...commonProps}>
                        <option value="">{field.placeholder || 'Select an option'}</option>
                        {field.options?.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                );
            case 'text':
            default:
                return <input type="text" {...commonProps} />;
        }
    };

    // --- Render Component ---
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/ai-access" className={styles.backButton}>
                    Back to Tools
                </Link>

                {usageStats && (
                    <div className={styles.usageStatus}>
                        <span className={styles.usageText}>
                            Daily Usage: <strong>{usageStats.daily_queries}</strong> / {usageStats.daily_limit} queries
                        </span>
                        <div className={styles.usageBar}>
                            <div
                                className={styles.usageBarFill}
                                style={{
                                    width: `${Math.min(100, (usageStats.daily_queries / usageStats.daily_limit) * 100)}%`,
                                    backgroundColor: usageStats.daily_queries >= usageStats.daily_limit ? '#ff4d4f' : '#52c41a'
                                }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            {currentTool && (
                <>
                    <div className={styles.toolHeader}>
                        <div className={styles.toolIconLarge}>{currentTool.icon}</div>
                        <div>
                            <h1 className={styles.toolTitle}>{currentTool.name}</h1>
                            <p className={styles.toolSubtitle}>{currentTool.description}</p>
                        </div>
                        {currentTool.beta && <span className={styles.betaBadgeLarge}>Beta</span>}
                    </div>

                    {currentTool.welcomeMessage && (
                        <div className={styles.welcomeMessage}>
                            <p>{currentTool.welcomeMessage}</p>
                        </div>
                    )}
                </>
            )}

            <div className={styles.mainContentFullWidth}>
                {currentTool && (
                    <>
                        {/* Form Section */}
                        <div className={styles.formSection}>
                            <h1>{currentTool.icon} {currentTool.name}</h1>
                            <p className={styles.toolDescription}>{currentTool.description}</p>
                            {currentTool.beta && <span className={styles.betaBadge}>Beta</span>}

                            <form onSubmit={handleFormSubmit} className={styles.aiForm}>
                                {currentTool.formFields.map(field => (
                                    <div key={field.id} className={styles.formField}>
                                        <label htmlFor={field.id} className={styles.formLabel}>
                                            {field.label}
                                            {field.required && <span className={styles.requiredAsterisk}>*</span>}
                                        </label>
                                        {renderFormField(field)}
                                    </div>
                                ))}

                                {currentTool.disclaimer && (
                                    <p className={styles.disclaimer}>{currentTool.disclaimer}</p>
                                )}

                                <button
                                    type="submit"
                                    className={`${styles.submitButton} ${isGenerating ? styles.submitButtonDisabled : ''}`}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? (
                                        <>
                                            <div className={styles.buttonSpinner}></div>
                                            Generating...
                                        </>
                                    ) : (
                                        'Generate Response'
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Response Section */}
                        <div className={styles.responseSection}>
                            <h2>Generated Response</h2>
                            {error && (
                                <div className={styles.errorMessage}>{error}</div>
                            )}
                            {isGenerating && (
                                <div className={styles.responseLoading}>
                                    <div className={styles.spinner}></div>
                                    <p>Generating response...</p>
                                </div>
                            )}
                            {generatedContent && !isGenerating && (
                                <div className={styles.responseContent}>
                                    {/* Basic formatting for newlines */}
                                    {generatedContent.split('\n').map((line, index) => (
                                        <p key={index}>{line}</p>
                                    ))}
                                </div>
                            )}
                            {!generatedContent && !isGenerating && !error && (
                                <p className={styles.responsePlaceholder}>Your generated content will appear here once you submit the form.</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
} 