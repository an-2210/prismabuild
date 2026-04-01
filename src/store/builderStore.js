import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { COMPONENT_REGISTRY } from '@/lib/registry.jsx';
import { arrayMove } from "@dnd-kit/sortable";

export const useBuilderStore = create(
  persist(
    (set, get) => ({
      elements: [
        { id: crypto.randomUUID(), type: 'HeroSection', props: COMPONENT_REGISTRY['HeroSection'].defaultProps },
        { id: crypto.randomUUID(), type: 'TextBlock', props: COMPONENT_REGISTRY['TextBlock'].defaultProps },
        { id: crypto.randomUUID(), type: 'CardsGrid', props: COMPONENT_REGISTRY['CardsGrid'].defaultProps },
      ],
      selectedElementId: null,
      deviceMode: 'desktop',
      previewMode: false,

      setDeviceMode: (mode) => set({ deviceMode: mode }),
      setPreviewMode: (mode) => set({ previewMode: mode }),
      selectElement: (id) => set({ selectedElementId: id }),

      updateElementProps: (id, updates) =>
        set((state) => ({
          elements: state.elements.map((el) =>
            el.id === id ? { ...el, props: { ...el.props, ...updates } } : el
          ),
        })),

      addElement: (type, index = null, extraProps = {}) => {
        set((state) => {
          const defaultProps = COMPONENT_REGISTRY[type]?.defaultProps || {};
          const newElement = {
            id: crypto.randomUUID(),
            type,
            props: { ...defaultProps, ...extraProps }
          };
          
          const newElements = [...state.elements];
          if (index !== null) {
            newElements.splice(index, 0, newElement);
          } else {
            newElements.push(newElement);
          }
          return { elements: newElements, selectedElementId: newElement.id };
        });
      },

      removeElement: (id) => set((state) => ({
        elements: state.elements.filter(el => el.id !== id),
        selectedElementId: state.selectedElementId === id ? null : state.selectedElementId
      })),

      updateElement: (id, newProps) => set((state) => ({
        elements: state.elements.map(el => 
          el.id === id ? { ...el, props: { ...el.props, ...newProps } } : el
        )
      })),

      moveElement: (activeId, overId) => set((state) => {
        const oldIndex = state.elements.findIndex(el => el.id === activeId);
        const newIndex = state.elements.findIndex(el => el.id === overId);
        
        if (oldIndex === -1 || newIndex === -1) return state;

        return { elements: arrayMove(state.elements, oldIndex, newIndex) };
      }),
      
      clearCanvas: () => set({ elements: [], selectedElementId: null }),
      
      exportJSON: () => {
        const state = get();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.elements, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "canvas_schema.json");
        document.body.appendChild(downloadAnchorNode); 
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      }
    }),
    {
      name: 'aurora-canvas-storage',
      partialize: (state) => ({ elements: state.elements, deviceMode: state.deviceMode }),
    }
  )
);
