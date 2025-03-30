'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function AIAccessPage() {
    const searchParams = useSearchParams();
    const initialToolId = searchParams.get('tool');

    const [selectedTool, setSelectedTool] = useState(initialToolId || 'assistant');
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Hello! I\'m your AI teaching assistant. How can I help you today?',
            timestamp: new Date().toISOString(),
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showToolbar, setShowToolbar] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Update selected tool when query parameter changes
    useEffect(() => {
        if (initialToolId) {
            setSelectedTool(initialToolId);

            // Set welcome message based on selected tool
            const tool = allTools.find(t => t.id === initialToolId);
            if (tool) {
                setMessages([
                    {
                        role: 'assistant',
                        content: `Welcome to the ${tool.name}! ${tool.welcomeMessage}`,
                        timestamp: new Date().toISOString(),
                    }
                ]);
            }
        }
    }, [initialToolId]);

    const handleSendMessage = () => {
        if (inputValue.trim() === '') return;

        // Add user message
        const userMessage: Message = {
            role: 'user',
            content: inputValue,
            timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI response after delay
        setTimeout(() => {
            const aiMessage: Message = {
                role: 'assistant',
                content: generateAIResponse(selectedTool, inputValue),
                timestamp: new Date().toISOString(),
            };

            setMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const changeTool = (toolId: string) => {
        setSelectedTool(toolId);

        // Set welcome message for new tool
        const tool = allTools.find(t => t.id === toolId);
        if (tool) {
            setMessages([
                {
                    role: 'assistant',
                    content: `Welcome to the ${tool.name}! ${tool.welcomeMessage}`,
                    timestamp: new Date().toISOString(),
                }
            ]);
        }
    };

    // Get current tool information
    const currentTool = allTools.find(tool => tool.id === selectedTool) || allTools[0];

    return (
        <div className={styles.page}>
            <div className={styles.flexContainer}>
                {/* Sidebar */}
                <div className={styles.sidebar}>
                    <div className={styles.sidebarPadding}>
                        <button
                            className={styles.newChatButton}
                            onClick={() => changeTool('assistant')}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            New Chat
                        </button>
                    </div>

                    <div className={styles.sidebarSection}>
                        <h3 className={styles.sidebarHeading}>
                            AI Tools
                        </h3>
                        <div className={styles.toolList}>
                            {allTools.map((tool) => (
                                <button
                                    key={tool.id}
                                    className={`${styles.toolButton} ${selectedTool === tool.id
                                        ? styles.toolButtonActive
                                        : styles.toolButtonInactive
                                        }`}
                                    onClick={() => changeTool(tool.id)}
                                >
                                    <span className={styles.toolIcon}>{tool.icon}</span>
                                    <span className={styles.toolText}>{tool.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.userProfileSection}>
                        <div className={styles.userProfileCard}>
                            <div className={styles.userAvatar}>
                                <span className={styles.userInitials}>AJ</span>
                            </div>
                            <div className={styles.userInfo}>
                                <p className={styles.userName}>Alex Johnson</p>
                                <p className={styles.userPlan}>Non-profit Access • 14/15 queries today</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className={styles.mainContent}>
                    {/* Tool Header */}
                    <div className={styles.toolHeader}>
                        <div className={styles.toolHeaderContent}>
                            <div className={styles.toolInfo}>
                                <span className={styles.toolHeaderIcon}>{currentTool.icon}</span>
                                <h1 className={styles.toolTitle}>{currentTool.name}</h1>
                                {currentTool.beta && (
                                    <span className={styles.betaBadge}>
                                        BETA
                                    </span>
                                )}
                            </div>
                            <div className={styles.toolActions}>
                                <button
                                    className={`${styles.iconButton} ${styles.mobileMenuButton}`}
                                    onClick={() => { }}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                    </svg>
                                </button>
                                <button className={styles.iconButton}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                    </svg>
                                </button>
                                <button className={styles.iconButton}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className={styles.messagesSection}>
                        <div className={styles.messagesContainer}>
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`${styles.messageGroup} ${message.role === 'user' ? styles.userMessage : ''}`}
                                >
                                    {message.role === 'assistant' && (
                                        <div className={styles.messageHeader}>
                                            <div className={`${styles.messageAvatar} ${styles.aiAvatar}`}>
                                                AI
                                            </div>
                                            <span className={styles.messageSender}>{currentTool.name}</span>
                                            <span className={styles.messageTime}>
                                                {formatTime(message.timestamp)}
                                            </span>
                                        </div>
                                    )}
                                    {message.role === 'user' && (
                                        <div className={`${styles.messageHeader} ${styles.userMessageHeader}`}>
                                            <span className={styles.messageTime}>
                                                {formatTime(message.timestamp)}
                                            </span>
                                            <span className={styles.messageSender}>You</span>
                                            <div className={`${styles.messageAvatar} ${styles.userAvatar}`}>
                                                <span className={styles.userInitials}>AJ</span>
                                            </div>
                                        </div>
                                    )}
                                    <div
                                        className={`${styles.messageBubble} ${message.role === 'assistant'
                                            ? styles.aiMessageBubble
                                            : styles.userMessageBubble
                                            }`}
                                    >
                                        <div className={styles.messageContent}>
                                            {message.content}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Typing indicator */}
                            {isTyping && (
                                <div className={styles.messageGroup}>
                                    <div className={styles.messageHeader}>
                                        <div className={`${styles.messageAvatar} ${styles.aiAvatar}`}>
                                            AI
                                        </div>
                                        <span className={styles.messageSender}>{currentTool.name}</span>
                                    </div>
                                    <div className={`${styles.messageBubble} ${styles.aiMessageBubble}`}>
                                        <div className={styles.typingIndicator}>
                                            <div className={styles.typingDot}></div>
                                            <div className={styles.typingDot}></div>
                                            <div className={styles.typingDot}></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Input area */}
                    <div className={styles.inputArea}>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputWrapper}>
                                <textarea
                                    className={styles.textarea}
                                    placeholder={`Ask the ${currentTool.name} something...`}
                                    rows={1}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    style={{ maxHeight: '200px' }}
                                ></textarea>
                                <div className={styles.sendButtonContainer}>
                                    <button
                                        className={`${styles.sendButton} ${inputValue.trim() === ''
                                            ? styles.sendButtonInactive
                                            : styles.sendButtonActive
                                            }`}
                                        onClick={handleSendMessage}
                                        disabled={inputValue.trim() === ''}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                        </svg>
                                    </button>
                                </div>
                                {showToolbar && (
                                    <div className={styles.toolbarSection}>
                                        <button className={styles.toolbarButton}>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path>
                                            </svg>
                                        </button>
                                        <button className={styles.toolbarButton}>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clipRule="evenodd"></path>
                                                <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className={styles.disclaimer}>
                                This is a non-profit educational service. Usage is limited to 15 queries per day to keep the service accessible for all teachers.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Types
interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

// Sample tools data
const allTools = [
    {
        id: 'assistant',
        name: 'AI Teaching Assistant',
        icon: '🤖',
        beta: false,
        welcomeMessage: 'I can help with lesson planning, answer questions about teaching methodologies, or assist with educational content creation. What would you like help with today?',
        disclaimer: 'Your teaching assistant is here to help, but always use your professional judgment.',
    },
    {
        id: 'lesson-generator',
        name: 'AI Lesson Planner',
        icon: '📝',
        beta: false,
        welcomeMessage: 'I can help you create comprehensive lesson plans tailored to your curriculum, grade level, and teaching style. What subject and grade level are you teaching?',
        disclaimer: 'Lesson plans should be reviewed and adapted to your specific classroom needs.',
    },
    {
        id: 'assessment-creator',
        name: 'Assessment Generator',
        icon: '📊',
        beta: false,
        welcomeMessage: 'I can help you create quizzes, tests, and other assessments aligned with learning objectives. What type of assessment do you need?',
        disclaimer: 'All assessments should be reviewed for accuracy and appropriateness before use.',
    },
    {
        id: 'differentiation-assistant',
        name: 'Differentiation Assistant',
        icon: '🔄',
        beta: false,
        welcomeMessage: 'I can help you adapt your lessons for different learning styles, abilities, and needs. What material would you like to differentiate?',
    },
    {
        id: 'feedback-generator',
        name: 'Feedback Generator',
        icon: '💬',
        beta: false,
        welcomeMessage: 'I can help you craft constructive, personalized feedback for student assignments. What type of assignment are you providing feedback for?',
    },
    {
        id: 'rubric-creator',
        name: 'Rubric Creator',
        icon: '📋',
        beta: false,
        welcomeMessage: 'I can help you design comprehensive grading rubrics for any assignment or project. What are you assessing?',
    },
    {
        id: 'iep-assistant',
        name: 'IEP Goal Writer',
        icon: '👤',
        beta: true,
        welcomeMessage: 'I can help you develop appropriate, measurable IEP goals and objectives. What areas of development are you focusing on?',
        disclaimer: 'IEP goals should always be reviewed by your special education team before implementation.',
    },
];

// Helper functions
function formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function generateAIResponse(toolId: string, query: string): string {
    // This would be replaced with actual AI API call in production
    const responses: Record<string, string[]> = {
        'assistant': [
            "I can definitely help with that! Here are some strategies you might consider...",
            "That's a great question about classroom management. Based on research, effective approaches include...",
            "When it comes to engaging students in STEM subjects, I'd recommend trying these activities...",
        ],
        'lesson-generator': [
            "Here's a comprehensive lesson plan for your topic:\n\n**Lesson Title:** Understanding Photosynthesis\n\n**Grade Level:** 5th Grade\n\n**Duration:** 60 minutes\n\n**Objectives:**\n- Students will be able to explain the process of photosynthesis\n- Students will identify the inputs and outputs of photosynthesis\n- Students will understand the importance of photosynthesis for life on Earth\n\n**Materials:**\n- Plant specimens\n- Hand lenses\n- Diagram handouts\n- Colored pencils\n- Science journals\n\n**Procedure:**\n1. Introduction (10 min): Begin with a question: \"How do plants get their food?\"\n2. Exploration (15 min): Students examine plants with hand lenses\n3. Explanation (20 min): Present diagram and explain photosynthesis process\n4. Elaboration (10 min): Students create their own diagrams\n5. Evaluation (5 min): Exit ticket assessment\n\n**Assessment:**\nExit tickets asking students to list inputs and outputs of photosynthesis\n\n**Extensions:**\nExperiment with plants in different light conditions",
            "I've created a lesson plan based on your specifications:\n\n**Lesson Title:** Ancient Civilizations - The Roman Empire\n\n**Grade Level:** 6th Grade\n\n**Duration:** 45 minutes\n\n**Standards Addressed:**\nSocial Studies 6.2.3 - Analyze the rise and fall of the Roman Empire\n\n**Objectives:**\n- Students will identify key factors that contributed to Rome's success\n- Students will explain at least three contributions Romans made to modern society\n\n**Materials:**\n- Timeline cards\n- Roman artifacts images\n- Guided notes handout\n- Exit ticket templates\n\n**Procedure:**\n1. Hook (5 min): Show images of modern architecture influenced by Romans\n2. Direct Instruction (15 min): Present key facts about Roman civilization\n3. Group Activity (15 min): Timeline arrangement and discussion\n4. Individual Work (5 min): Guided notes completion\n5. Closure (5 min): Exit ticket reflection\n\n**Assessment:**\nExit ticket: \"Name one Roman contribution we still use today and explain its importance.\"\n\n**Differentiation:**\n- Visual learners: Additional images and maps\n- Advanced students: Compare/contrast with Greek civilization",
        ],
        'assessment-creator': [
            "I've created a 10-question assessment on your topic:\n\n**Topic: Fractions - Grade 4**\n\n1. Which fraction is equivalent to 2/4?\n   a) 1/2\n   b) 3/6\n   c) 4/8\n   d) All of the above\n\n2. What is 3/4 + 1/4?\n   a) 3/8\n   b) 4/8\n   c) 4/4\n   d) 3/4\n\n3. Which fraction is greater: 2/5 or 3/8?\n   a) 2/5\n   b) 3/8\n   c) They are equal\n\n4. What is 1/2 of 12?\n   a) 6\n   b) 24\n   c) 1/24\n   d) 6/12\n\n5. Which shows the fractions in order from least to greatest? 1/2, 1/3, 1/4\n   a) 1/4, 1/3, 1/2\n   b) 1/2, 1/3, 1/4\n   c) 1/3, 1/4, 1/2\n   d) 1/4, 1/2, 1/3\n\n*Continued with 5 more questions...*\n\n**Answer Key:**\n1. d\n2. c\n3. a\n4. a\n5. a",
        ],
        'feedback-generator': [
            "Here's personalized feedback for the student's work:\n\n**Assignment: Literary Analysis Essay**\n\n**Strengths:**\n- Your thesis statement is clear and well-focused\n- Good use of textual evidence to support your arguments\n- Strong conclusion that ties back to your main points\n\n**Areas for Growth:**\n- Consider deeper analysis of how the author's techniques create meaning\n- Work on paragraph transitions to improve flow between ideas\n- Proofread carefully for grammar and punctuation errors\n\n**Specific Suggestions:**\n1. In paragraph 2, expand on how the imagery contributes to the theme\n2. Add another example in paragraph 3 to strengthen your point\n3. Review your use of commas throughout the essay\n\n**Overall:**\nThis is a thoughtful analysis with strong potential. Implementing these suggestions will help take your writing to the next level."
        ],
    };

    // Get responses for the current tool, or fall back to assistant
    const toolResponses = responses[toolId] || responses['assistant'];

    // Return a random response from the available options
    return toolResponses[Math.floor(Math.random() * toolResponses.length)];
} 