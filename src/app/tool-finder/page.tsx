'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import styles from './page.module.css';

export default function ToolFinderPage() {
    const router = useRouter();
    const { user, isLoading, isAuthenticated } = useAuth();

    // Search states
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    // Category states
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [filteredTools, setFilteredTools] = useState<any[]>([]);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login?from=/tool-finder');
        }
    }, [isLoading, isAuthenticated, router]);

    // Handle category selection
    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
        // Filter popular tools based on category
        const filtered = popularTools.filter(tool =>
            tool.tags.some((tag: string) =>
                tag.toLowerCase().includes(category.toLowerCase())
            )
        );
        setFilteredTools(filtered);
        setHasSearched(false);
    };

    // Handle search submission
    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setSearchError(null);

        try {
            const response = await fetch('/api/tool-search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: searchQuery,
                }),
            });

            if (!response.ok) {
                let errorMsg = 'Failed to search for tools';
                try {
                    const errorData = await response.json();
                    if (response.status === 429) {
                        // Daily limit reached error
                        errorMsg = errorData.message || 'You have reached your daily limit of AI queries. Please try again tomorrow.';
                    } else if (response.status === 401) {
                        // Authentication error
                        router.push('/login?from=/tool-finder');
                        return;
                    } else {
                        errorMsg = errorData.error || `Server responded with status ${response.status}`;
                    }
                } catch (jsonError) {
                    errorMsg = `Server responded with status ${response.status}`;
                }
                throw new Error(errorMsg);
            }

            const data = await response.json();
            setSearchResults(data.tools || []);
            setHasSearched(true);
            setSelectedCategory(null);
        } catch (error) {
            setSearchError(error instanceof Error ? error.message : 'An unknown error occurred');
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    // Get the tools to display based on search/category state
    const getDisplayTools = () => {
        if (hasSearched) {
            return searchResults;
        } else if (selectedCategory) {
            return filteredTools;
        } else {
            return popularTools;
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className={styles.page}>
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Loading tool finder...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            {/* Header */}
            <section className={`${styles.section} ${styles.sectionAlt}`}>
                <div className={styles.container}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.title}>
                            <span className={styles.gradientText}>AI Tool Finder</span>
                        </h1>
                        <p className={styles.subtitle}>
                            Discover the perfect AI tools for your classroom needs. Our smart search helps you find the right tools to enhance your teaching experience.
                        </p>
                    </div>
                </div>
            </section>

            {/* Search Section */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.searchContainer}>
                        <form onSubmit={handleSearch} className={styles.searchBox}>
                            <input
                                type="text"
                                placeholder="What type of AI tool are you looking for? (e.g., lesson planning, grading, quizzes)"
                                className={styles.searchInput}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                disabled={isSearching}
                            />
                            <button
                                type="submit"
                                className={styles.searchButton}
                                disabled={isSearching || searchQuery.trim() === ''}
                            >
                                {isSearching ? (
                                    <>
                                        <div className={styles.buttonSpinner}></div>
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                        Search
                                    </>
                                )}
                            </button>
                        </form>
                        <p className={styles.aiAssistText}>
                            <span className={styles.aiIcon}>✨</span> Our AI will analyze your query and suggest the most relevant tools
                        </p>

                        {searchError && (
                            <div className={styles.errorMessage}>
                                {searchError}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className={`${styles.section} ${styles.sectionAlt}`}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>
                        <span className={styles.gradientText}>Browse by Category</span>
                    </h2>
                    <div className={styles.categoriesGrid}>
                        {categories.map((category, index) => (
                            <div key={index} className={styles.categoryCard}>
                                <div className={styles.categoryIcon}>{category.icon}</div>
                                <h3 className={styles.categoryTitle}>{category.name}</h3>
                                <p className={styles.categoryDescription}>{category.description}</p>
                                <button
                                    className={styles.categoryButton}
                                    onClick={() => handleCategorySelect(category.name)}
                                >
                                    Explore Tools
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tools Section */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>
                        <span className={styles.gradientText}>
                            {hasSearched
                                ? `Results for "${searchQuery}"`
                                : selectedCategory
                                    ? `${selectedCategory} Tools`
                                    : 'Popular AI Tools'}
                        </span>
                    </h2>

                    {hasSearched && searchResults.length === 0 ? (
                        <div className={styles.noResultsContainer}>
                            <div className={styles.noResultsIcon}>🔍</div>
                            <h3 className={styles.noResultsTitle}>No tools found</h3>
                            <p className={styles.noResultsText}>
                                We couldn't find any tools matching your search. Try different keywords or browse our categories.
                            </p>
                            <button
                                className={styles.resetButton}
                                onClick={() => {
                                    setHasSearched(false);
                                    setSearchQuery('');
                                }}
                            >
                                Browse All Tools
                            </button>
                        </div>
                    ) : (
                        <div className={styles.toolsGrid}>
                            {getDisplayTools().map((tool, index) => (
                                <div key={index} className={styles.toolCard}>
                                    <div className={styles.toolHeader}>
                                        <div className={styles.smallIconCircle}>
                                            <span className={styles.smallIconText}>{tool.icon}</span>
                                        </div>
                                        <div className={styles.toolNameWrapper}>
                                            <h3 className={styles.toolTitle}>{tool.name}</h3>
                                            {tool.beta && (
                                                <span className={styles.betaBadge}>
                                                    BETA
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p className={styles.cardDescription}>{tool.description}</p>
                                    <div className={styles.tagContainer}>
                                        {tool.tags.map((tag: string, tagIndex: number) => (
                                            <span key={tagIndex} className={styles.tag}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <Link
                                        href={`/ai-access?tool=${tool.id}`}
                                        className={styles.toolLinkText}
                                    >
                                        Try this tool
                                        <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                        </svg>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Request New Tool */}
            <section className={`${styles.section} ${styles.sectionAlt}`}>
                <div className={styles.container}>
                    <div className={styles.requestCard}>
                        <div className={styles.requestContent}>
                            <h2 className={styles.requestTitle}>
                                <span className={styles.gradientText}>Can't Find What You Need?</span>
                            </h2>
                            <p className={styles.requestText}>
                                We're constantly expanding our collection of AI tools for educators. Let us know what you're looking for, and we'll consider adding it to our platform.
                            </p>
                            <Link href="/feedback" className={styles.primaryButton}>
                                Request a New Tool
                                <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                </svg>
                            </Link>
                        </div>
                        <div className={styles.requestImageContainer}>
                            <div className={styles.requestImagePlaceholder}>
                                <span className={styles.requestImageIcon}>💡</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.gradientText}>How Our Tool Finder Works</span>
                        </h2>
                        <p className={styles.subtitle}>
                            Finding the perfect AI tool for your teaching needs is easy with our intelligent search system.
                        </p>
                    </div>

                    <div className={styles.stepsContainer}>
                        <div className={styles.stepsLine} />
                        <div className={styles.stepsGrid}>
                            {steps.map((step, index) => (
                                <div key={index} className={styles.stepItem}>
                                    <div className={styles.stepIcon}>
                                        <span className={styles.stepNumber}>
                                            {index + 1}
                                        </span>
                                        <span className={styles.stepIconText}>{step.icon}</span>
                                    </div>
                                    <h3 className={styles.stepTitle}>{step.title}</h3>
                                    <p className={styles.stepDescription}>{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={`${styles.section} ${styles.sectionAlt}`}>
                <div className={styles.container}>
                    <div className={styles.ctaCard}>
                        <h2 className={styles.ctaTitle}>
                            <span className={styles.gradientText}>Ready to Enhance Your Teaching?</span>
                        </h2>
                        <p className={styles.ctaText}>
                            Try our AI tools today and join thousands of educators who are revolutionizing their teaching experience.
                        </p>
                        <div className={styles.ctaButtonGroup}>
                            <Link href="/ai-access" className={styles.primaryButton}>
                                Explore All Tools
                            </Link>
                            <Link href="/community" className={styles.secondaryButton}>
                                Join Teacher Community
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

// Data
const categories = [
    {
        icon: '📝',
        name: 'Lesson Planning',
        description: 'Create, organize, and optimize your lesson plans with AI assistance',
    },
    {
        icon: '📊',
        name: 'Assessment & Grading',
        description: 'Generate quizzes, tests, and automated grading solutions',
    },
    {
        icon: '🎮',
        name: 'Interactive Activities',
        description: 'Engage students with AI-powered games and learning activities',
    },
    {
        icon: '📚',
        name: 'Content Creation',
        description: 'Generate worksheets, presentations, and educational materials',
    },
    {
        icon: '🧠',
        name: 'Personalized Learning',
        description: 'Tools that adapt to individual student needs and learning styles',
    },
    {
        icon: '👨‍👩‍👧‍👦',
        name: 'Classroom Management',
        description: 'Streamline administrative tasks and student organization',
    },
];

const popularTools = [
    {
        id: 'lesson-generator',
        icon: '📝',
        name: 'AI Lesson Planner',
        description: 'Generate complete, standards-aligned lesson plans in seconds based on your curriculum, grade level, and teaching style.',
        tags: ['Lesson Planning', 'Time-Saver', 'Customizable'],
        beta: false,
    },
    {
        id: 'assessment-creator',
        icon: '📊',
        name: 'Smart Assessment Creator',
        description: 'Create quizzes, tests, and assessments with automatic grading capabilities and detailed student performance analytics.',
        tags: ['Assessment', 'Analytics', 'Grading'],
        beta: true,
    },
    {
        id: 'content-generator',
        icon: '📚',
        name: 'Educational Content Generator',
        description: 'Generate educational content aligned with curriculum standards, including worksheets, presentations, and study guides.',
        tags: ['Content', 'Resources', 'Curriculum'],
        beta: false,
    },
];

const steps = [
    {
        icon: '🔍',
        title: 'Describe Your Need',
        description: 'Enter what you\'re looking for in natural language, like "I need to create interactive vocabulary games"',
    },
    {
        icon: '🤖',
        title: 'AI Analyzes Your Query',
        description: 'Our AI processor understands your teaching context and identifies the most relevant tools',
    },
    {
        icon: '📋',
        title: 'Browse Recommendations',
        description: 'Review the personalized tool suggestions tailored to your specific teaching needs',
    },
    {
        icon: '🚀',
        title: 'Try and Implement',
        description: 'Select a tool to try, and immediately start enhancing your teaching with AI assistance',
    },
]; 