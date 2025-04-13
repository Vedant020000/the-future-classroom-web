import Link from 'next/link';
import styles from './page.module.css';

export default function FeedbackPage() {
    return (
        <div className={styles.page}>
            {/* Header */}
            <section className={`${styles.section} ${styles.sectionAlt}`}>
                <div className={styles.container}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.title}>
                            <span className={styles.gradientText}>Request a New AI Tool</span>
                        </h1>
                        <p className={styles.subtitle}>
                            Can't find what you're looking for? Let us know what AI tool would help you in your teaching journey.
                        </p>
                    </div>
                </div>
            </section>

            {/* Feedback Form */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.formContainer}>
                        <div className={styles.formCard}>
                            <div className={styles.formSection}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="toolName" className={styles.label}>
                                        Tool Name (optional)
                                    </label>
                                    <input
                                        type="text"
                                        id="toolName"
                                        className={styles.input}
                                        placeholder="E.g., Student Engagement Analyzer"
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label htmlFor="toolCategory" className={styles.label}>
                                        Category
                                    </label>
                                    <select id="toolCategory" className={styles.select}>
                                        <option value="">Select a category</option>
                                        <option value="lesson-planning">Lesson Planning</option>
                                        <option value="assessment">Assessment & Grading</option>
                                        <option value="content-creation">Content Creation</option>
                                        <option value="classroom-management">Classroom Management</option>
                                        <option value="student-engagement">Student Engagement</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label htmlFor="toolDescription" className={styles.label}>
                                        Describe the tool you need
                                    </label>
                                    <textarea
                                        id="toolDescription"
                                        className={styles.textarea}
                                        placeholder="Please describe what this tool would do and how it would help you as an educator..."
                                        rows={5}
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label htmlFor="teachingLevel" className={styles.label}>
                                        Teaching Level
                                    </label>
                                    <select id="teachingLevel" className={styles.select}>
                                        <option value="">Select your teaching level</option>
                                        <option value="elementary">Elementary School</option>
                                        <option value="middle">Middle School</option>
                                        <option value="high">High School</option>
                                        <option value="higher-ed">Higher Education</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label htmlFor="email" className={styles.label}>
                                        Email (optional)
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className={styles.input}
                                        placeholder="Your email for updates about your request"
                                    />
                                    <p className={styles.helperText}>
                                        We'll notify you when we add this tool or something similar
                                    </p>
                                </div>

                                <button className={styles.submitButton}>
                                    Submit Request
                                    <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                    </svg>
                                </button>
                            </div>
                            <div className={styles.formImageSection}>
                                <div className={styles.formImageContent}>
                                    <div className={styles.iconContainer}>
                                        <span className={styles.formIcon}>💡</span>
                                    </div>
                                    <h3 className={styles.formImageTitle}>We Value Your Input</h3>
                                    <p className={styles.formImageText}>
                                        Your requests directly influence our development roadmap. We're constantly working to create tools that make teaching more effective and engaging.
                                    </p>

                                    <div className={styles.bulletPoints}>
                                        <div className={styles.bulletItem}>
                                            <span className={styles.bullet}>✓</span>
                                            <span>Regular tool releases</span>
                                        </div>
                                        <div className={styles.bulletItem}>
                                            <span className={styles.bullet}>✓</span>
                                            <span>Community-driven development</span>
                                        </div>
                                        <div className={styles.bulletItem}>
                                            <span className={styles.bullet}>✓</span>
                                            <span>Educator-focused AI solutions</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={`${styles.section} ${styles.sectionAlt}`}>
                <div className={styles.container}>
                    <div className={styles.ctaCard}>
                        <h2 className={styles.ctaTitle}>
                            <span className={styles.gradientText}>Explore Our Existing Tools</span>
                        </h2>
                        <p className={styles.ctaText}>
                            While we work on your request, check out our current collection of AI tools designed to enhance your teaching experience.
                        </p>
                        <div className={styles.ctaButtonGroup}>
                            <Link href="/tool-finder" className={styles.primaryButton}>
                                Browse AI Tools
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