'use client';

import React from 'react';
import { useDrag } from 'react-dnd';
import styles from './Sidebar.module.css'; // We'll create this

// Define item types for drag-and-drop
export const ItemTypes = {
    LESSON_BLOCK: 'lessonBlock',
};

interface DraggableItemProps {
    type: string;
    label: string;
    icon: string;
    defaultContent?: any; // Initial content when dropped
}

const DraggableItem: React.FC<DraggableItemProps> = ({ type, label, icon, defaultContent }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.LESSON_BLOCK, // All draggable items are of this type for now
        item: { type, label, icon, defaultContent }, // Data transferred on drop
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={drag}
            className={`${styles.draggableItem} ${isDragging ? styles.dragging : ''}`}
        >
            <span className={styles.icon}>{icon}</span>
            {label}
        </div>
    );
};

const Sidebar = () => {
    return (
        <div className={styles.sidebarContainer}>
            <h2 className={styles.sidebarTitle}>Components</h2>
            <DraggableItem type="TextBlock" label="Text Block" icon="📄" defaultContent={{ text: '' }} />
            <DraggableItem type="Activity" label="Activity" icon="🏃" defaultContent={{ description: '' }} />
            <DraggableItem type="Resource" label="Resource Link" icon="🔗" defaultContent={{ url: '', description: '' }} />
            <DraggableItem type="Assessment" label="Assessment" icon="❓" defaultContent={{ description: '' }} />
            {/* Add more draggable components as needed */}
        </div>
    );
};

export default Sidebar; 