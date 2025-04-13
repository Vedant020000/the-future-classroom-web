'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import GenerationControls from './GenerationControls';
import styles from './LessonPlannerWorkspace.module.css'; // We'll create this

interface LessonPlannerWorkspaceProps {
    lessonPlanId?: string; // ID if editing existing, 'new' if creating
}

const LessonPlannerWorkspace: React.FC<LessonPlannerWorkspaceProps> = ({ lessonPlanId }) => {
    // State for the items on the canvas will be managed here or in Canvas
    const [canvasItems, setCanvasItems] = React.useState<any[]>([]);

    // Placeholder: Function to handle dropping an item onto the canvas
    const handleDrop = (item: any) => {
        console.log('Dropped item:', item);
        setCanvasItems((prevItems) => [...prevItems, { ...item, id: Date.now().toString() }]);
    };

    // Placeholder: Function to trigger AI generation
    const handleGenerate = () => {
        console.log("Triggering AI generation with items:", canvasItems);
        // TODO: Format canvasItems into a prompt and call the API
    };

    return (
        <div className={styles.workspaceContainer}>
            <Sidebar />
            <Canvas items={canvasItems} onDrop={handleDrop} />
            <GenerationControls onGenerate={handleGenerate} />
        </div>
    );
};

export default LessonPlannerWorkspace; 