import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

export default function AIToolsPage() {
    return (
        <div className={styles.page}>
            {/* Header */}
            <section className={`${styles.section} ${styles.sectionAlt}`}>
                <div className={styles.container}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.title}>
                            <span className={styles.gradientText}>Our AI Tools</span>
                        </h1>
                        <p className={styles.subtitle}>
                            Custom-built AI tools designed specifically for K-12 teachers to simplify lesson planning, enhance classroom management, and boost student engagement.
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Tools */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.featuredGrid}>
                        {featuredTools.map((tool, index) => (
                            <div key={index} className={styles.featuredCard}>
                                <div className={styles.cardFlex}>
                                    <div className={styles.cardIconSection}>
                                        <div className={styles.iconCircle}>
                                            <span className={styles.iconText}>{tool.icon}</span>
                                        </div>
                                    </div>
                                    <div className={styles.cardContent}>
                                        <div className={styles.cardHeader}>
                                            <h3 className={styles.cardTitle}>{tool.name}</h3>
                                            <span className={styles.betaBadge}>
                                                {tool.beta ? 'BETA' : 'NEW'}
                                            </span>
                                        </div>
                                        <p className={styles.cardDescription}>{tool.description}</p>
                                        <div className={styles.tagContainer}>
                                            {tool.tags.map((tag, tagIndex) => (
                                                <span key={tagIndex} className={styles.tag}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <Link
                                            href={`/ai-access?tool=${tool.id}`}
                                            className={styles.primaryButton}
                                        >
                                            Try Now
                                            <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* All AI Tools Grid */}
            <section className={`${styles.section} ${styles.sectionAlt}`}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>
                        <span className={styles.gradientText}>All AI Tools</span>
                    </h2>

                    <div className={styles.toolsGrid}>
                        {allTools.map((tool, index) => (
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
                                    {tool.tags.map((tag, tagIndex) => (
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
                </div>
            </section>

            {/* How It Works */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.gradientText}>How Our AI Tools Work</span>
                        </h2>
                        <p className={styles.subtitle}>
                            Our AI tools are designed to be intuitive and easy to use, saving you time and enhancing your teaching effectiveness.
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

            {/* Usage Limits */}
            <section className={`${styles.section} ${styles.sectionAlt}`}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.gradientText}>Our Non-Profit Mission</span>
                        </h2>
                        <p className={styles.subtitle}>
                            We offer limited free access to ensure all educators can benefit from AI tools, regardless of their school's resources.
                        </p>
                    </div>

                    <div className={styles.usageCard}>
                        <div className={styles.usageGrid}>
                            <div className={styles.freeTierSection}>
                                <h3 className={styles.freeTierTitle}>Usage Limits</h3>
                                <ul className={styles.checkList}>
                                    <li className={styles.checkListItem}>
                                        <svg className={styles.checkIcon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                        </svg>
                                        <span>15 AI queries per day</span>
                                    </li>
                                    <li className={styles.checkListItem}>
                                        <svg className={styles.checkIcon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                        </svg>
                                        <span>Access to all tools</span>
                                    </li>
                                    <li className={styles.checkListItem}>
                                        <svg className={styles.checkIcon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                        </svg>
                                        <span>Save up to 10 templates</span>
                                    </li>
                                </ul>
                            </div>
                            <div className={styles.premiumSection}>
                                <h3 className={styles.premiumTitle}>Support Our Mission</h3>
                                <p style={{ marginBottom: '1rem', color: 'rgba(var(--foreground-rgb), 0.8)' }}>
                                    The Future Classroom is a non-profit initiative dedicated to bringing AI tools to K-12 teachers around the world.
                                    We provide limited access to ensure all educators can benefit from these resources.
                                </p>
                                <p style={{ marginBottom: '1.5rem', color: 'rgba(var(--foreground-rgb), 0.8)' }}>
                                    If you'd like to support our mission, please consider making a donation to help us expand our services
                                    and increase usage limits for all educators.
                                </p>
                                <div className={styles.upgradeButton}>
                                    <Link href="/donate" className={styles.primaryButton}>
                                        Make a Donation
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.ctaCard}>
                        <h2 className={styles.ctaTitle}>
                            <span className={styles.gradientText}>Ready to Transform Your Teaching?</span>
                        </h2>
                        <p className={styles.ctaText}>
                            Experience the future of education technology today. Our AI tools are designed for teachers, by teachers.
                        </p>
                        <div className={styles.ctaButtonGroup}>
                            <Link href="/ai-access" className={styles.primaryButton}>
                                Start Using AI Tools
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
const featuredTools = [
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
];

const allTools = [
    {
        id: 'lesson-generator',
        icon: '📝',
        name: 'AI Lesson Planner',
        description: 'Generate complete, standards-aligned lesson plans in seconds.',
        tags: ['Planning'],
        beta: false,
    },
    {
        id: 'assessment-creator',
        icon: '📊',
        name: 'Assessment Creator',
        description: 'Create quizzes, tests, and assessments with automatic grading.',
        tags: ['Assessment'],
        beta: true,
    },
    {
        id: 'differentiation-assistant',
        icon: '👥',
        name: 'Differentiation Assistant',
        description: 'Automatically adapt materials for different learning needs and styles.',
        tags: ['Inclusive'],
        beta: false,
    },
    {
        id: 'rubric-creator',
        icon: '📋',
        name: 'Rubric Builder',
        description: 'Create detailed, fair grading rubrics for any assignment or project.',
        tags: ['Assessment'],
        beta: false,
    },
    {
        id: 'discussion-prompter',
        icon: '💬',
        name: 'Discussion Prompter',
        description: 'Generate thought-provoking discussion questions for any topic or text.',
        tags: ['Engagement'],
        beta: false,
    },
    {
        id: 'feedback-generator',
        icon: '🔄',
        name: 'Feedback Assistant',
        description: 'Provide personalized, constructive feedback on student work quickly.',
        tags: ['Feedback'],
        beta: true,
    },
];

const steps = [
    {
        icon: '🔍',
        title: 'Select Tool',
        description: 'Choose from our range of specialized AI tools designed for specific teaching needs.',
    },
    {
        icon: '⚙️',
        title: 'Input Parameters',
        description: 'Provide details about your needs, preferences, grade level, and subject matter.',
    },
    {
        icon: '✨',
        title: 'Get Results',
        description: 'Receive instant, high-quality content that you can use directly or customize further.',
    },
]; 