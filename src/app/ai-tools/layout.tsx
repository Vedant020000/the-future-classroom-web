'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './layout.module.css';
import { allTools, AiTool } from '@/lib/aiToolsData'; // Import the source of truth

// Remove the hardcoded list below
// const aiTools = [ ... ];

// Function to assign colors if not present in AiTool data (optional, can be removed if colors added to data)
const colors = ['#4f46e5', '#0ea5e9', '#ec4899', '#f59e0b', '#10b981', '#6d28d9', '#db2777', '#047857'];
const getToolColor = (tool: AiTool, index: number): string => {
    // Assuming AiTool might have an optional color property later
    // return tool.color || colors[index % colors.length];
    return colors[index % colors.length]; // Simple cycling for now
};

export default function AIToolsLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    // Check if we're on the main AI tools page overview (/ai-tools)
    const isMainPage = pathname === '/ai-tools';

    // If we're on the main overview page, don't render the sidebar layout
    if (isMainPage) {
        return <>{children}</>;
    }

    // Prepare tools data for the sidebar, adding paths and colors
    const sidebarTools = allTools.map((tool, index) => ({
        ...tool,
        path: `/ai-tools/${tool.id}`,
        color: getToolColor(tool, index)
    }));

    // For individual tool pages, render the sidebar layout
    return (
        <div className={styles.layoutContainer}>
            <div className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <Link href="/ai-tools" className={styles.backButton}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5" />
                            <path d="M12 19l-7-7 7-7" />
                        </svg>
                        <span>All Tools</span>
                    </Link>
                </div>
                {/* Use the processed sidebarTools list */}
                <div className={styles.toolsList}>
                    {sidebarTools.map((tool) => (
                        <Link
                            key={tool.id}
                            href={tool.path}
                            className={`${styles.toolItem} ${pathname === tool.path ? styles.activeTool : ''}`}
                            title={`${tool.name}: ${tool.description}`} // Add tooltip for better UX
                        >
                            <div className={styles.toolIcon} style={{ backgroundColor: `${tool.color}20`, color: tool.color }}>
                                <span>{tool.icon}</span>
                            </div>
                            <div className={styles.toolInfo}>
                                <span className={styles.toolName}>{tool.name}</span>
                                <span className={styles.toolDescription}>{tool.description}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <main className={styles.contentArea}>
                {children}
            </main>
        </div>
    );
} 