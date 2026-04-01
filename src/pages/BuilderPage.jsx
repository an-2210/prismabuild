import { useState } from "react";
import { motion } from "framer-motion";
import { DndContext, DragOverlay, closestCenter, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import TopNavbar from "@/components/builder/TopNavbar.jsx";
import ElementsPanel from "@/components/builder/ElementsPanel.jsx";
import BuilderCanvas from "@/components/builder/BuilderCanvas.jsx";
import PropertiesPanel from "@/components/builder/PropertiesPanel.jsx";
import LayersPanel from "@/components/builder/LayersPanel.jsx";
import { useBuilderStore } from "@/store/builderStore.js";
import { COMPONENT_REGISTRY } from "@/lib/registry.jsx";

const pageTransition = {
  initial: { opacity: 0, scale: 0.96, filter: "blur(10px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  transition: { duration: 0.6, ease: "easeOut" },
};

const BuilderPage = () => {
  const { addElement, moveElement, updateElementProps } = useBuilderStore();
  const [activeDragElement, setActiveDragElement] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    if (active.data.current?.isSidebarItem) {
      setActiveDragElement(active.data.current.type);
    } else if (active.data.current?.isCanvasItem) {
      const elType = useBuilderStore.getState().elements.find(e => e.id === active.id)?.type;
      setActiveDragElement(elType);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDragElement(null);
    if (!over) return;
    
    
    let isAbsoluteItem = false;
    let extraProps = {};
    const itemType = active.data.current?.type || useBuilderStore.getState().elements.find(e => e.id === active.id)?.type;
    
    if (itemType === "Button" || itemType === "SecondaryButton") {
       isAbsoluteItem = true;
       const canvasEl = document.getElementById("builder-canvas-page");
       if (canvasEl && event.active.rect.current.translated) {
         const rect = canvasEl.getBoundingClientRect();
         const dropRect = event.active.rect.current.translated;
         
         const leftPercentage = ((dropRect.left - rect.left) / rect.width) * 100;
         const topPixel = dropRect.top - rect.top;
         
         extraProps = { 
           position: 'absolute', 
           left: `${Math.max(0, Math.min(100, leftPercentage))}%`, 
           top: `${Math.max(0, topPixel)}px` 
         };
       }
    }

    
    if (active.data.current?.isSidebarItem) {
       if (over.id === "builder-canvas" || over.data.current?.isCanvasItem) {
         let insertIndex = null;
         if (!isAbsoluteItem && over.id !== "builder-canvas") {
            const elements = useBuilderStore.getState().elements;
            const targetIndex = elements.findIndex(el => el.id === over.id);
            if (targetIndex !== -1) {
              insertIndex = targetIndex;
            }
         }
         addElement(active.data.current.type, insertIndex, extraProps);
       }
       return;
    }
    
    
    if (active.data.current?.isCanvasItem) {
      if (isAbsoluteItem && Object.keys(extraProps).length > 0) {
          updateElementProps(active.id, extraProps);
      } else {
        if (over.data.current?.isCanvasItem) {
          if (active.id !== over.id) {
            moveElement(active.id, over.id);
          }
        } else if (over.id === "builder-canvas") {
          const elements = useBuilderStore.getState().elements;
          if (elements.length > 0) {
            const lastElement = elements[elements.length - 1];
            if (active.id !== lastElement.id) {
              moveElement(active.id, lastElement.id);
            }
          }
        }
      }
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}
    >
      <motion.div
        className="h-screen flex flex-col overflow-hidden"
        {...pageTransition}
      >
        <TopNavbar />

        <div className="flex flex-1 pt-14 overflow-hidden">
          <div className="flex flex-col p-2 pr-0 gap-0">
            <ElementsPanel />
            <LayersPanel />
          </div>

          <BuilderCanvas />

          <div className="p-2 pl-0">
            <PropertiesPanel />
          </div>
        </div>
      </motion.div>
      
      <DragOverlay>
        {activeDragElement ? (
          <div className="px-4 py-2 bg-primary/20 backdrop-blur-md border border-primary/40 rounded-lg text-primary text-sm font-semibold shadow-2xl">
            {COMPONENT_REGISTRY[activeDragElement]?.name || activeDragElement}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default BuilderPage;
