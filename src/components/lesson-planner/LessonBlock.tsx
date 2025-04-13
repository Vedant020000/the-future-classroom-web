'use client';

import React, { useState } from 'react';
import styles from './LessonBlock.module.css'; // We'll create this

interface LessonBlockProps {
    item: any; // The data for this block (type, content, etc.)
}

const LessonBlock: React.FC<LessonBlockProps> = ({ item }) => {
    const [content, setContent] = useState(item.defaultContent || {});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setContent((prevContent: any) => ({ ...prevContent, [name]: value }));
        // TODO: Propagate changes up to the workspace state
    };

    const renderContent = () => {
        switch (item.type) {
            case 'TextBlock':
                return (
                    <textarea
                        name="text"
                        value={content.text || ''}
                        onChange={handleChange}
                        placeholder="Enter text here..."
                        className={styles.textarea}
                    />
                );
            case 'Activity':
                return (
                    <textarea
                        name="description"
                        value={content.description || ''}
                        onChange={handleChange}
                        placeholder="Describe the activity..."
                        className={styles.textarea}
                    />
                );
            case 'Resource':
                return (
                    <div className={styles.resourceInputs}>
                        <input
                            type="url"
                            name="url"
                            value={content.url || ''}
                            onChange={handleChange}
                            placeholder="https://example.com"
                            className={styles.input}
                        />
                        <textarea
                            name="description"
                            value={content.description || ''}
                            onChange={handleChange}
                            placeholder="Description (optional)"
                            className={`${styles.textarea} ${styles.resourceDescription}`}
                        />
                    </div>
                );
            case 'Assessment':
                return (
                    <textarea
                        name="description"
                        value={content.description || ''}
                        onChange={handleChange}
                        placeholder="Describe the assessment method..."
                        className={styles.textarea}
                    />
                );
            default:
                return <p>Unknown block type</p>;
        }
    };

    return (
        <div className={styles.blockContainer}>
            <h3 className={styles.blockTitle}>
                <span className={styles.blockIcon}>{item.icon}</span> {item.label}
            </h3>
            <div className={styles.blockContent}>
                {renderContent()}
            </div>
            {/* Add drag handles, delete buttons, etc. later */}
        </div>
    );
};

export default LessonBlock; 