'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import styles from './page.module.css';
import { allTools, AiTool } from '@/lib/aiToolsData'; // Import the actual tools data

// Define a type for the tools displayed on this page, adding path and color
interface DisplayTool extends AiTool {
    path: string;
    color: string; // Assign colors programmatically or add to AiTool interface
}

// Function to assign colors (simple cycle for now)
const colors = ['#4f46e5', '#0ea5e9', '#ec4899', '#f59e0b', '#10b981', '#6d28d9', '#db2777', '#047857'];
const assignDisplayProperties = (tools: AiTool[]): DisplayTool[] => {
    return tools.map((tool, index) => ({
        ...tool,
        path: `/ai-tools/${tool.id}`,
        color: colors[index % colors.length], // Cycle through predefined colors
    }));
};

// Remove hardcoded categories for now, as tools lack category data
// const categories = [ ... ];

export default function AIToolsPage() {
    const router = useRouter();
    const { user, isLoading, isAuthenticated } = useAuth();
    // const [selectedCategory, setSelectedCategory] = useState('all'); // Remove category state
    const [loading, setLoading] = useState(true);
    const [displayTools, setDisplayTools] = useState<DisplayTool[]>([]); // State for processed tools

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login?from=ai-tools');
            return;
        }

        if (!isLoading) {
            setLoading(false);
            // Process the imported tools
            setDisplayTools(assignDisplayProperties(allTools));
        }
    }, [isLoading, isAuthenticated, router]);

    // Remove category filtering logic
    // useEffect(() => { ... }, [selectedCategory]); 

    if (loading) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Loading AI Tools...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>AI Tools</h1>
                <p className={styles.subtitle}>
                    Enhance your teaching with our suite of AI-powered educational tools.
                </p>

                {/* Categories Filter - Removed for now */}
                {/* <div className={styles.filterContainer}> ... </div> */}
            </div>

            {/* Tools Grid - Use displayTools state */}
            <div className={styles.toolsGrid}>
                {displayTools.map(tool => (
                    <Link href={tool.path} key={tool.id} className={styles.toolCard} style={{ borderTop: `4px solid ${tool.color}` }}>
                        <div className={styles.toolHeader}>
                            <div className={styles.toolIcon} style={{ backgroundColor: `${tool.color}20`, color: tool.color }}>
                                <span>{tool.icon}</span>
                                {tool.beta && <span className={styles.betaBadge}>Beta</span>}
                            </div>
                            <h2 className={styles.toolName}>{tool.name}</h2>
                        </div>
                        <p className={styles.toolDescription}>{tool.description}</p>
                        <div className={styles.toolFooter}>
                            {/* Optionally add disclaimer/beta info here too */}
                            <span className={styles.tryButton}>Try Now</span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Empty state might not be needed if we show all tools */}
            {/* {displayTools.length === 0 && ( ... )} */}
        </div>
    );
} 