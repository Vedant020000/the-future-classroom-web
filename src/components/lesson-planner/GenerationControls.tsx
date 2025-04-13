'use client';

import React from 'react';
import styles from './GenerationControls.module.css'; // We'll create this

interface GenerationControlsProps {
    onGenerate: () => void; // Function to trigger AI generation
    // Add props for saving, loading state, etc. later
    isGenerating?: boolean;
}

const GenerationControls: React.FC<GenerationControlsProps> = ({ onGenerate, isGenerating }) => {
    return (
        <div className={styles.controlsContainer}>
            <h2 className={styles.controlsTitle}>Actions</h2>
            {/* Add inputs for global settings like Subject, Grade Level here? */}
            <button
                onClick={onGenerate}
                className={`${styles.generateButton} ${isGenerating ? styles.disabled : ''}`}
                disabled={isGenerating}
            >
                {isGenerating ? (
                    <>
                        <div className={styles.spinner}></div> Generating...
                    </>
                ) : (
                    '✨ Generate with AI'
                )}
            </button>
            {/* Add Save button later */}
            {/* <button className={styles.saveButton}>Save Lesson Plan</button> */}
        </div>
    );
};

export default GenerationControls; 