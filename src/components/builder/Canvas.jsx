import React from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import { useCanvasStore } from '../../lib/utils';
import componentRegistry from '../../lib/componentRegistry';

const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || !componentRegistry[active.id]) {
        console.warn('Invalid drop target or component ID');
        return;
    }

    const newComponent = {
        id: `${active.id}-${Date.now()}`, 
        type: active.id,
        props: componentRegistry[active.id].defaultProps,
    };
    useCanvasStore.getState().addComponent(newComponent);
};

const Canvas = () => {
    const { setNodeRef } = useDroppable({ id: 'canvas' });
    const canvasSchema = useCanvasStore((state) => state.canvasSchema);

    if (!canvasSchema || canvasSchema.length === 0) {
        return (
            <div
                ref={setNodeRef}
                className="flex-1 bg-gray-50 p-4 border border-dashed border-gray-300 flex items-center justify-center text-gray-500"
            >
                Drag components here to start building!
            </div>
        );
    }

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div
                ref={setNodeRef}
                className="flex-1 bg-gray-50 p-4 border border-dashed border-gray-300"
            >
                {canvasSchema.map((component, index) => {
                    const Component = componentRegistry[component.type]?.component || 'div';
                    return (
                        <Component
                            key={component.id || index}
                            {...component.props}
                            className={component.props.style}
                        />
                    );
                })}
            </div>
        </DndContext>
    );
};

export default Canvas;