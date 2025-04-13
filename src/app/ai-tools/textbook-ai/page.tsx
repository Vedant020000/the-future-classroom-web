'use client';

import React, { useState, useCallback, useRef } from 'react';
import styles from './page.module.css';
import { allTools, AiTool } from '@/lib/aiToolsData'; // Assuming this path is correct

// Find the tool data for Textbook AI
const textbookToolData = allTools.find(tool => tool.id === 'textbook-ai');

interface ChapterOutline {
    title: string;
    estimatedTime: string; // e.g., "2-3 hours"
    estimatedClasses: string; // e.g., "3-4 classes"
    error?: string;
}

interface ChatMessage {
    sender: 'user' | 'ai';
    text: string;
}

const TextbookAiPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [analysisResult, setAnalysisResult] = useState<ChapterOutline[] | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<'upload' | 'analysis' | 'chat'>('upload');
    const [textbookId, setTextbookId] = useState<string | null>(null); // Store the ID after analysis
    const [actionLoading, setActionLoading] = useState<string | null>(null); // Track loading state for specific actions

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setError(null);
        } else {
            setFile(null);
            setError('Please select a valid PDF file.');
        }
    };

    const handleAnalyze = useCallback(async () => {
        if (!file) {
            setError('Please select a file first.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setView('analysis');
        setAnalysisResult(null); // Clear previous results
        setTextbookId(null); // Clear previous ID

        const formData = new FormData();
        formData.append('type', 'analyze');
        formData.append('file', file);

        try {
            const response = await fetch('/api/textbook-ai', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            console.log('Analysis successful:', data);
            setAnalysisResult(data.analysis);
            setTextbookId(data.textbookId); // Store the ID for chat
            // Keep view as 'analysis' for user to review before chatting

        } catch (err: any) {
            console.error('Analysis failed:', err);
            setError(`Analysis failed: ${err.message}`);
            setView('upload');
        } finally {
            setIsLoading(false);
        }
    }, [file]);

    // --- Function to handle both regular chat and action buttons ---
    const callChatApi = useCallback(async (payload: FormData) => {
        const isAction = payload.get('type') === 'action';
        const actionType = isAction ? payload.get('action') as string : null;

        if (isAction) {
            setActionLoading(actionType); // Set loading for the specific action
        } else {
            setIsLoading(true); // General loading for regular chat message
        }
        setError(null);

        try {
            const response = await fetch('/api/textbook-ai', {
                method: 'POST',
                body: payload,
            });

            const data = await response.json();

            if (!response.ok) {
                // Use detailed error from API if available
                throw new Error(data.details || data.error || `HTTP error! status: ${response.status}`);
            }

            const aiResponse: ChatMessage = {
                sender: 'ai',
                text: data.response,
            };
            setChatHistory(prev => [...prev, aiResponse]);

        } catch (err: any) {
            console.error('API call failed:', err);
            // Display the specific error message from the catch
            setError(`Request failed: ${err.message}`);
            // If it was a regular chat, optionally remove the user's message
            if (!isAction) {
                // setChatHistory(prev => prev.slice(0, -1)); // Example: Remove last message (user's)
            }
        } finally {
            if (isAction) {
                setActionLoading(null); // Clear loading for the specific action
            } else {
                setIsLoading(false); // Clear general loading
            }
        }
    }, []);

    // --- Regular chat message handler ---
    const handleSendMessage = useCallback(() => {
        if (!currentMessage.trim() || isLoading || !textbookId) {
            if (!textbookId) setError("Analysis must be completed before chatting.");
            return;
        }

        const userMessage: ChatMessage = { sender: 'user', text: currentMessage };
        setChatHistory(prev => [...prev, userMessage]);
        const messageToSend = currentMessage;
        setCurrentMessage('');

        const formData = new FormData();
        formData.append('type', 'chat');
        formData.append('message', messageToSend);
        formData.append('textbookId', textbookId);

        callChatApi(formData);

    }, [currentMessage, isLoading, textbookId, callChatApi]);

    // --- Suggestion button handler ---
    const handleSuggestionClick = useCallback((suggestionText: string, actionType: string, context?: string) => {
        if (actionLoading || !textbookId) { // Prevent concurrent actions
            if (!textbookId) setError("Analysis must be completed before chatting.");
            return;
        }
        console.log(`Triggering action: ${actionType}, Context: ${context}`);

        // Optional: Add a user message indicating the action
        const actionMessage: ChatMessage = { sender: 'user', text: `Action: ${suggestionText}` };
        setChatHistory(prev => [...prev, actionMessage]);

        const formData = new FormData();
        formData.append('type', 'action');
        formData.append('action', actionType);
        formData.append('textbookId', textbookId);
        if (context) {
            formData.append('contextData', context);
        }

        callChatApi(formData);

    }, [textbookId, actionLoading, callChatApi]);

    // --- Define Suggestions with Actions ---
    // We need context for some actions, e.g., the chapter title.
    // For simplicity, let's assume the user knows or we grab the first/last chapter from analysis.
    const firstChapterTitle = analysisResult?.[0]?.title;
    const lastChapterTitle = analysisResult?.[analysisResult.length - 1]?.title;

    const suggestions: { text: string; action: string; context?: string }[] = [
        { text: `Summarize ${firstChapterTitle ? `\`${firstChapterTitle}\`` : 'Chapter 1'}`, action: 'summarize', context: firstChapterTitle || 'Chapter 1' },
        { text: `Quiz for ${firstChapterTitle ? `\`${firstChapterTitle}\`` : 'Intro'}`, action: 'quiz', context: firstChapterTitle || 'Introduction' },
        { text: `Ideas from ${lastChapterTitle ? `\`${lastChapterTitle}\`` : 'last chapter'}`, action: 'ideas', context: lastChapterTitle || 'Conclusion' },
        { text: 'Find relevant videos', action: 'videos', context: 'Core Concepts' } // Example placeholder
    ];

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <h1 className={styles.title}>
                    {textbookToolData?.icon} {textbookToolData?.name || 'Textbook AI'}
                    {textbookToolData?.beta && <span className={styles.betaTag}>BETA</span>}
                </h1>
                <p className={styles.description}>{textbookToolData?.description}</p>
                {textbookToolData?.disclaimer && <p className={styles.disclaimer}>{textbookToolData.disclaimer}</p>}
            </header>

            {error && (
                <div className={styles.errorContainer}>
                    <p className={styles.errorText}>{error}</p>
                    <button onClick={() => setError(null)} className={styles.dismissError}>Dismiss</button>
                </div>
            )}

            {/* --- Upload View --- */}
            {view === 'upload' && (
                <div className={styles.uploadSection}>
                    <label htmlFor="file-upload" className={styles.uploadLabel}>
                        {file ? `Selected: ${file.name}` : 'Click to Upload Textbook PDF'}
                    </label>
                    <input
                        id="file-upload"
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className={styles.fileInput}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={!file || isLoading}
                        className={styles.actionButton}
                    >
                        {isLoading ? 'Analyzing...' : 'Analyze Textbook'}
                    </button>
                </div>
            )}

            {/* --- Analysis View --- */}
            {view === 'analysis' && (
                <div className={styles.analysisSection}>
                    <h2>Textbook Outline & Estimates</h2>
                    {isLoading && !analysisResult && <p className={styles.loadingText}>Analyzing PDF, please wait...</p>}
                    {analysisResult && (
                        <>
                            <ul className={styles.chapterList}>
                                {analysisResult.map((chapter, index) => (
                                    <li key={index} className={styles.chapterItem}>
                                        <strong>{chapter.title}</strong>
                                        {chapter.error ? (
                                            <p className={styles.analysisError}>{chapter.error}</p>
                                        ) : (
                                            <>
                                                <p>Est. Time: {chapter.estimatedTime}</p>
                                                <p>Est. Classes: {chapter.estimatedClasses}</p>
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => {
                                    setView('chat');
                                    setChatHistory([{ sender: 'ai', text: 'Analysis complete. Ask me anything about the textbook or use the suggestions below!' }]);
                                }}
                                className={styles.actionButton}
                                disabled={!textbookId} // Disable if analysis failed badly (no ID)
                            >
                                Start Chatting
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* --- Chat View --- */}
            {view === 'chat' && (
                <div className={styles.chatContainer}>
                    <div className={styles.chatHistory}>
                        {chatHistory.map((msg, index) => (
                            <div key={index} className={`${styles.chatMessage} ${styles[msg.sender]}`}>
                                <span className={styles.senderIcon}>{msg.sender === 'ai' ? '🤖' : '🧑‍🏫'}</span>
                                <p>{msg.text}</p>
                            </div>
                        ))}
                        {isLoading && <div className={`${styles.chatMessage} ${styles.ai}`}><p>Thinking...</p></div>}
                    </div>

                    <div className={styles.suggestionContainer}>
                        <span className={styles.suggestionIcon}>💡</span>
                        {suggestions.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => handleSuggestionClick(s.text, s.action, s.context)}
                                className={styles.suggestionButton}
                                disabled={!!actionLoading || isLoading} // Disable all if any action/chat is loading
                            >
                                {actionLoading === s.action ? 'Processing...' : s.text}
                            </button>
                        ))}
                    </div>

                    <div className={styles.chatInputArea}>
                        <input
                            type="text"
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            placeholder="Ask something about the textbook..."
                            className={styles.chatInput}
                            disabled={isLoading}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!currentMessage.trim() || isLoading}
                            className={styles.sendButton}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TextbookAiPage; 