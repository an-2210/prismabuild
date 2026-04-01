import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Copy, Move } from "lucide-react";
import { useBuilderStore } from "@/store/builderStore.js";
import { COMPONENT_REGISTRY } from "@/lib/registry.jsx";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const canvasWidths = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

const FloatingToolbar = ({ onClose }) => (
  <motion.div
    initial={{ y: 10, opacity: 0, scale: 0.9 }}
    animate={{ y: 0, opacity: 1, scale: 1 }}
    exit={{ y: 10, opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
    className="absolute -top-12 left-1/2 -translate-x-1/2 glass-strong flex items-center gap-0.5 px-2 py-1.5 z-20 rounded-xl"
  >
    <motion.button className="icon-btn p-1.5" whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
      <Copy className="w-3.5 h-3.5" />
    </motion.button>
    <div className="w-px h-4 bg-border/30 mx-1" />
    <motion.button className="icon-btn p-1.5 text-destructive" onClick={onClose} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
      <Trash2 className="w-3.5 h-3.5" />
    </motion.button>
  </motion.div>
);

const ResizeHandle = ({ position }) => {
  const posClasses = {
    "top-left": "-top-1.5 -left-1.5 cursor-nw-resize",
    "top-right": "-top-1.5 -right-1.5 cursor-ne-resize",
    "bottom-left": "-bottom-1.5 -left-1.5 cursor-sw-resize",
    "bottom-right": "-bottom-1.5 -right-1.5 cursor-se-resize",
  };
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className={`absolute w-3 h-3 rounded-full bg-primary border-2 border-background ${posClasses[position]}`}
      style={{ boxShadow: "0 0 8px hsl(260 100% 68% / 0.5)" }}
      whileHover={{ scale: 1.5 }}
    />
  );
};

const SortableCanvasElement = ({ element, isSelected, onSelect }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: element.id,
    data: { 
      type: element.type,
      isCanvasItem: true 
    }
  });
  
  const [hovered, setHovered] = useState(false);
  const previewMode = useBuilderStore(state => state.previewMode);
  const removeElement = useBuilderStore(state => state.removeElement);

  const isAbsolute = element.props.position === 'absolute';

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 100 : (isAbsolute ? 50 : 1),
    ...(isAbsolute ? {
      position: 'absolute',
      left: element.props.left,
      top: element.props.top,
      margin: 0,
    } : {})
  };

  const Component = COMPONENT_REGISTRY[element.type]?.render;
  if (!Component) return null;

  if (previewMode) {
    return <Component props={element.props} />;
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`canvas-element group cursor-grab active:cursor-grabbing ${isSelected ? "selected" : ""} ${isAbsolute ? "" : "relative"}`}
      onClick={(e) => { e.stopPropagation(); onSelect(element.id); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...(!previewMode ? { ...listeners, ...attributes } : {})}
      layout
    >

      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            className="absolute -top-7 left-1 tooltip-tag"
          >
            {COMPONENT_REGISTRY[element.type]?.name}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`pointer-events-none transition-all ${isSelected ? 'opacity-100' : 'opacity-90'}`}>
         <Component props={element.props} />
      </div>

      <AnimatePresence>
        {isSelected && (
          <>
            <FloatingToolbar onClose={(e) => { e.stopPropagation(); removeElement(element.id); }} />
            <ResizeHandle position="top-left" />
            <ResizeHandle position="top-right" />
            <ResizeHandle position="bottom-left" />
            <ResizeHandle position="bottom-right" />
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const BuilderCanvas = () => {
  const elements = useBuilderStore(state => state.elements);
  const deviceMode = useBuilderStore(state => state.deviceMode);
  const previewMode = useBuilderStore(state => state.previewMode);
  const selectedElementId = useBuilderStore(state => state.selectedElementId);
  const selectElement = useBuilderStore(state => state.selectElement);

  const { setNodeRef, isOver } = useDroppable({
    id: 'builder-canvas',
  });

  return (
    <div
      className={`flex-1 overflow-auto flex justify-center relative transition-all duration-500`}
      style={{ background: previewMode ? 'hsl(var(--canvas-page))' : 'hsl(var(--canvas-bg))', paddingTop: previewMode ? '0' : '1.5rem' }}
      onClick={() => selectElement(null)}
    >
      {!previewMode && (
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      )}

      {!previewMode && (
        <>
          <motion.div
            className="absolute top-20 left-1/3 w-[500px] h-[300px] pointer-events-none rounded-full"
            animate={{ opacity: [0.04, 0.08, 0.04] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ background: "radial-gradient(ellipse, hsl(260 100% 68% / 0.15), transparent 70%)" }}
          />
          <motion.div
            className="absolute bottom-20 right-1/4 w-[400px] h-[250px] pointer-events-none rounded-full"
            animate={{ opacity: [0.03, 0.06, 0.03] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            style={{ background: "radial-gradient(ellipse, hsl(210 100% 60% / 0.1), transparent 70%)" }}
          />
        </>
      )}

      <div className={`p-6 w-full flex justify-center ${previewMode ? 'mt-14' : ''}`}>
        <motion.div
          animate={{ width: canvasWidths[deviceMode] }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative max-w-[1100px] w-full z-10"
        >
          {!previewMode && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between mb-3 px-1"
            >
              <span className="tooltip-tag">Live Preview</span>
              <span className="text-[10px] font-mono text-muted-foreground/40">
                {deviceMode === "desktop" ? "1200px" : deviceMode === "tablet" ? "768px" : "375px"} × auto
              </span>
            </motion.div>
          )}

          <motion.div
            id="builder-canvas-page"
            ref={setNodeRef}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
            className={`min-h-[550px] transition-all duration-300 relative ${previewMode ? '' : 'bg-canvas-page rounded-2xl overflow-hidden'} ${isOver ? 'ring-2 ring-primary bg-primary/5' : ''}`}
            style={!previewMode ? {
              boxShadow: "0 25px 60px -12px hsl(230 25% 0% / 0.5), 0 0 0 1px hsl(0 0% 100% / 0.05)",
            } : {}}
          >
            <SortableContext items={elements.map(e => e.id)} strategy={rectSortingStrategy}>
              {elements.length === 0 && !previewMode && (
                <div className="flex items-center justify-center h-full min-h-[500px] text-muted-foreground">
                  Drag and drop elements here
                </div>
              )}
              {elements.map((el, idx) => (
                <SortableCanvasElement 
                  key={el.id} 
                  element={el} 
                  isSelected={selectedElementId === el.id} 
                  onSelect={selectElement}
                />
              ))}
            </SortableContext>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default BuilderCanvas;
