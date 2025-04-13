'use client';

import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './Sidebar'; // Import item types
import LessonBlock from './LessonBlock';
import styles from './Canvas.module.css'; // We'll create this

interface CanvasProps {
    items: any[]; // Current items on the canvas
    onDrop: (item: any) => void; // Function to call when an item is dropped
}

const Canvas: React.FC<CanvasProps> = ({ items, onDrop }) => {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: ItemTypes.LESSON_BLOCK, // Accepts items defined in Sidebar
        drop: (item, monitor) => {
            // Call the onDrop function passed from the workspace
            onDrop(item);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    }));

    const isActive = canDrop && isOver;
    let backgroundColor = 'var(--canvas-bg)';
    if (isActive) {
        backgroundColor = 'var(--canvas-drop-hover-bg)';
    } else if (canDrop) {
        backgroundColor = 'var(--canvas-can-drop-bg)';
    }

    return (
        <div
            ref={drop}
            className={styles.canvasContainer}
            style={{ backgroundColor }}
        >
            {items.length === 0 && (
                <p className={styles.placeholderText}>
                    Drag components from the sidebar here to build your lesson plan.
                </p>
            )}
            {items.map((item, index) => (
                <LessonBlock key={item.id || index} item={item} />
            ))}
        </div>
    );
};

export default Canvas; 