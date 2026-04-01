import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  MousePointer
} from "lucide-react";
import SpotlightCard from "@/components/reactbits/SpotlightCard.jsx";
import { useBuilderStore } from "@/store/builderStore.js";
import { COMPONENT_REGISTRY } from "@/lib/registry.jsx";

const tabs = ["Content", "Style", "Layout"];

const SliderControl = ({ label, value, max = 200, unit = "px", onChange }) => (
  <div>
    <div className="flex justify-between mb-2">
      <span className="prop-label mb-0">{label}</span>
      <span className="text-[11px] font-mono text-muted-foreground/60">{value}{unit}</span>
    </div>
    <div className="flex items-center gap-3">
      <input 
        type="range" 
        min="0" 
        max={max} 
        value={value || 0} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary bg-background/50 h-1.5 rounded-lg appearance-none"
      />
    </div>
  </div>
);

const ColorControl = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between mb-3">
    <span className="prop-label mb-0">{label}</span>
    <div className="flex items-center gap-2">
      <div 
        className="w-6 h-6 rounded-md border border-border/40 shadow-sm"
        style={{ backgroundColor: value }}
      />
      <input 
        type="text" 
        value={value || ""} 
        onChange={(e) => onChange(e.target.value)}
        className="prop-input text-xs w-20 py-1 px-2"
        placeholder="#000000"
      />
    </div>
  </div>
);

const PropertiesPanel = () => {
  const [activeTab, setActiveTab] = useState("Content");
  
  const elements = useBuilderStore(state => state.elements);
  const selectedElementId = useBuilderStore(state => state.selectedElementId);
  const updateElement = useBuilderStore(state => state.updateElement);
  const previewMode = useBuilderStore(state => state.previewMode);

  if (previewMode) return null;

  const selectedElement = elements.find(el => el.id === selectedElementId);
  const elementConfig = selectedElement ? COMPONENT_REGISTRY[selectedElement.type] : null;

  const handlePropChange = (key, value) => {
    if (!selectedElement) return;
    updateElement(selectedElement.id, { [key]: value });
  };

  const renderContentControls = () => {
    if (!selectedElement) return null;
    const styleKeys = ['color', 'backgroundColor', 'titleColor', 'subtitleColor', 'descriptionColor', 'textColor', 'fontSize', 'fontWeight', 'textAlign', 'borderRadius'];
    const layoutKeys = ['paddingTop', 'paddingBottom', 'paddingX', 'paddingY', 'width', 'columns', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'buttonPosition'];
    
    
    const activeKeys = Object.keys(selectedElement.props).filter(k => !styleKeys.includes(k) && !layoutKeys.includes(k));

    if (activeKeys.length === 0) return <div className="text-xs text-muted-foreground/50">No content properties available.</div>;

    return activeKeys.map(key => {
      let displayName = key.replace(/([A-Z])/g, ' $1').trim();
      if (key === 'src') displayName = 'Image URL (src)';

      return (
      <div key={key} className="mb-4">
        <label className="prop-label capitalize">{displayName}</label>
        {typeof selectedElement.props[key] === 'boolean' ? (
          <div className="flex items-center gap-2 mt-2">
             <input type="checkbox" checked={selectedElement.props[key]} onChange={(e) => handlePropChange(key, e.target.checked)} className="w-4 h-4 accent-primary" />
             <span className="text-xs text-muted-foreground">{selectedElement.props[key] ? 'On' : 'Off'}</span>
          </div>
        ) : key.toLowerCase().includes('desc') || key === 'content' ? (
          <textarea
            className="prop-input resize-none h-24 text-xs leading-relaxed"
            value={selectedElement.props[key]}
            onChange={(e) => handlePropChange(key, e.target.value)}
          />
        ) : (
          <input
            className="prop-input text-xs"
            value={selectedElement.props[key]}
            onChange={(e) => handlePropChange(key, e.target.value)}
          />
        )}
      </div>
    )});
  };

  const renderStyleControls = () => {
    if (!selectedElement) return null;
    const styleKeys = ['color', 'backgroundColor', 'titleColor', 'subtitleColor', 'descriptionColor', 'textColor', 'fontSize', 'fontWeight', 'textAlign', 'borderRadius'];
    const activeKeys = Object.keys(selectedElement.props).filter(k => styleKeys.includes(k));

    if (activeKeys.length === 0) return <div className="text-xs text-muted-foreground/50">No style properties available.</div>;

    return (
      <div className="space-y-4">
        {activeKeys.filter(k => k.toLowerCase().includes('color')).length > 0 && (
          <SpotlightCard className="glass-inset p-3 rounded-xl" spotlightColor="rgba(139, 92, 246, 0.08)">
            <label className="prop-label mb-3">Colors</label>
            {activeKeys.filter(k => k.toLowerCase().includes('color')).map(key => (
              <ColorControl 
                key={key} 
                label={key.replace(/([A-Z])/g, ' $1').trim()} 
                value={selectedElement.props[key]} 
                onChange={(val) => handlePropChange(key, val)} 
              />
            ))}
          </SpotlightCard>
        )}

        {activeKeys.includes('fontSize') && (
           <SpotlightCard className="glass-inset p-3 rounded-xl" spotlightColor="rgba(139, 92, 246, 0.08)">
             <label className="prop-label">Typography</label>
             <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <span className="text-[9px] text-muted-foreground/50 uppercase tracking-wider">Size (px)</span>
                  <input type="number" className="prop-input text-xs mt-1" value={selectedElement.props.fontSize} onChange={(e) => handlePropChange('fontSize', Number(e.target.value))} />
                </div>
                {activeKeys.includes('fontWeight') && (
                  <div>
                    <span className="text-[9px] text-muted-foreground/50 uppercase tracking-wider">Weight</span>
                    <select className="prop-input text-xs mt-1" value={selectedElement.props.fontWeight} onChange={(e) => handlePropChange('fontWeight', e.target.value)}>
                      <option value="bold">Bold</option>
                      <option value="semibold">Semi</option>
                      <option value="medium">Medium</option>
                      <option value="normal">Regular</option>
                    </select>
                  </div>
                )}
             </div>
           </SpotlightCard>
        )}

        {activeKeys.includes('textAlign') && (
          <div>
            <label className="prop-label">Alignment</label>
            <div className="flex gap-1">
              {[
                { icon: AlignLeft, value: 'left' },
                { icon: AlignCenter, value: 'center' },
                { icon: AlignRight, value: 'right' },
              ].map(({ icon: Icon, value }) => (
                <motion.button
                  key={value}
                  onClick={() => handlePropChange('textAlign', value)}
                  whileTap={{ scale: 0.88 }}
                  className={`icon-btn flex-1 flex justify-center ${selectedElement.props.textAlign === value ? "active" : ""}`}
                >
                  <Icon className="w-4 h-4" />
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {activeKeys.includes('borderRadius') && (
          <SliderControl 
            label="Border Radius" 
            value={selectedElement.props.borderRadius} 
            max={50} 
            onChange={(val) => handlePropChange('borderRadius', val)} 
          />
        )}
      </div>
    );
  };

  const renderLayoutControls = () => {
    if (!selectedElement) return null;
    const layoutKeys = ['paddingTop', 'paddingBottom', 'paddingX', 'paddingY', 'width', 'columns', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'buttonPosition'];
    const activeKeys = Object.keys(selectedElement.props).filter(k => layoutKeys.includes(k));

    if (activeKeys.length === 0) return <div className="text-xs text-muted-foreground/50">No layout properties available.</div>;

    return (
      <div className="space-y-4">
        {activeKeys.includes('columns') && (
           <SliderControl 
              label="Columns" 
              value={selectedElement.props.columns} 
              max={4} 
              unit=""
              onChange={(val) => handlePropChange('columns', val)} 
           />
        )}
        
        {activeKeys.includes('buttonPosition') && (
          <div>
            <label className="prop-label">Button Position</label>
            <select className="prop-input text-xs mt-1" value={selectedElement.props.buttonPosition} onChange={(e) => handlePropChange('buttonPosition', e.target.value)}>
              <option value="left">Left</option>
              <option value="center">Center / Inside</option>
              <option value="right">Right</option>
            </select>
          </div>
        )}
        
        {activeKeys.includes('paddingTop') && (
          <SliderControl 
            label="Padding Top" 
            value={selectedElement.props.paddingTop} 
            max={200} 
            onChange={(val) => handlePropChange('paddingTop', val)} 
          />
        )}
        
        {activeKeys.includes('paddingBottom') && (
          <SliderControl 
            label="Padding Bottom" 
            value={selectedElement.props.paddingBottom} 
            max={200} 
            onChange={(val) => handlePropChange('paddingBottom', val)} 
          />
        )}

        {activeKeys.includes('paddingX') && (
          <SliderControl 
            label="Horizontal Padding" 
            value={selectedElement.props.paddingX} 
            max={100} 
            onChange={(val) => handlePropChange('paddingX', val)} 
          />
        )}

        {activeKeys.includes('paddingY') && (
          <SliderControl 
            label="Vertical Padding" 
            value={selectedElement.props.paddingY} 
            max={100} 
            onChange={(val) => handlePropChange('paddingY', val)} 
          />
        )}

        {activeKeys.includes('marginTop') && (
          <SliderControl 
            label="Margin Top" 
            value={selectedElement.props.marginTop} 
            max={200} 
            onChange={(val) => handlePropChange('marginTop', val)} 
          />
        )}

        {activeKeys.includes('marginBottom') && (
          <SliderControl 
            label="Margin Bottom" 
            value={selectedElement.props.marginBottom} 
            max={200} 
            onChange={(val) => handlePropChange('marginBottom', val)} 
          />
        )}

        {activeKeys.includes('marginLeft') && (
          <SliderControl 
            label="Margin Left" 
            value={selectedElement.props.marginLeft} 
            max={200} 
            onChange={(val) => handlePropChange('marginLeft', val)} 
          />
        )}

        {activeKeys.includes('marginRight') && (
          <SliderControl 
            label="Margin Right" 
            value={selectedElement.props.marginRight} 
            max={200} 
            onChange={(val) => handlePropChange('marginRight', val)} 
          />
        )}

        {activeKeys.includes('width') && (
          <div>
            <label className="prop-label">Width</label>
            <input 
              className="prop-input text-xs" 
              value={selectedElement.props.width} 
              onChange={(e) => handlePropChange('width', e.target.value)} 
            />
          </div>
         )}
      </div>
    );
  };

  return (
    <motion.aside
      initial={{ x: 280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 280, opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
      className="glass w-[280px] flex-shrink-0 flex flex-col overflow-hidden h-full z-10"
    >
      <div className="px-4 pt-4 pb-3 border-b border-border/20">
        <div className="panel-header mb-3">
          <span>Properties</span>
        </div>

        <div className="flex gap-0.5 glass-inset p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-[11px] font-semibold py-2 rounded-lg transition-all duration-300 relative ${
                activeTab === tab
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="prop-tab-bg"
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: "hsl(260 100% 68% / 0.1)",
                    border: "1px solid hsl(260 100% 68% / 0.15)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 pb-4">
        <AnimatePresence mode="wait">
          {!selectedElement ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <motion.div
                className="w-14 h-14 rounded-2xl glass-inset flex items-center justify-center mb-4"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <MousePointer className="w-6 h-6 text-muted-foreground/40" />
              </motion.div>
              <p className="text-sm text-muted-foreground/60 font-medium">Click an element</p>
              <p className="text-[11px] text-muted-foreground/40 mt-1">on the canvas to edit its properties</p>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-5 pt-4"
            >
              {activeTab === "Content" && renderContentControls()}
              {activeTab === "Style" && renderStyleControls()}
              {activeTab === "Layout" && renderLayoutControls()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};

export default PropertiesPanel;
