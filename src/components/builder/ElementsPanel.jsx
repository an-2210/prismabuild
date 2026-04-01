import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import {
  Type, Heading1, Heading2, AlignLeft, MousePointer2, RectangleHorizontal,
  Image, Video, Layout, Columns3, PanelTop, CreditCard, PanelBottom,
  ChevronRight, GripVertical, Search, Plus
} from "lucide-react";
import { useBuilderStore } from "@/store/builderStore.js";

const elementGroups = [
  {
    title: "Layout & Sections",
    color: "hsl(185 100% 55%)",
    items: [
      { label: "Hero Section", type: "HeroSection", icon: RectangleHorizontal, desc: "Full-width intro block" },
      { label: "Text Block", type: "TextBlock", icon: Layout, desc: "Content wrapper" },
      { label: "Cards Grid", type: "CardsGrid", icon: Columns3, desc: "Multi-column grid" },
    ],
  },
  {
    title: "Text",
    color: "hsl(260 100% 68%)",
    items: [
      { label: "Heading", type: "Heading", icon: Heading1, desc: "Main title" },
      { label: "Subheading", type: "Subheading", icon: Heading2, desc: "Section title" },
      { label: "Paragraph", type: "Paragraph", icon: AlignLeft, desc: "Body text" },
    ],
  },
  {
    title: "Buttons",
    color: "hsl(330 90% 62%)",
    items: [
      { label: "Primary Button", type: "Button", icon: MousePointer2, desc: "Call to action" },
      { label: "Secondary Button", type: "SecondaryButton", icon: MousePointer2, desc: "Alternate action" },
    ],
  },
  {
    title: "Media",
    color: "hsl(210 100% 60%)",
    items: [
      { label: "Image", type: "Image", icon: Image, desc: "Photo or graphic" },
    ],
  },
  {
    title: "Components",
    color: "hsl(45 100% 60%)",
    items: [
      { label: "Navbar", type: "Navbar", icon: PanelTop, desc: "Navigation bar" },
      { label: "Footer", type: "Footer", icon: PanelBottom, desc: "Page footer" },
    ],
  },
];

const DraggableItem = ({ item, groupColor }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${item.type}`,
    data: {
      type: item.type,
      isSidebarItem: true,
    },
  });

  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      layout
      className={`element-item group/item cursor-grab ${isDragging ? "opacity-40" : ""}`}
      whileHover={{ x: 3 }}
      whileTap={{ scale: 0.97, cursor: "grabbing" }}
    >
      <GripVertical className="w-3 h-3 text-muted-foreground/20 opacity-0 group-hover/item:opacity-100 transition-opacity" />
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          background: `${groupColor.replace(")", " / 0.1)")}`,
          border: `1px solid ${groupColor.replace(")", " / 0.15)")}`,
        }}
      >
        <item.icon className="w-4 h-4" style={{ color: groupColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground/90">{item.label}</div>
        <div className="text-[10px] text-muted-foreground/60">{item.desc}</div>
      </div>
      <Plus className="w-3.5 h-3.5 text-muted-foreground/30 opacity-0 group-hover/item:opacity-100 transition-opacity" />
    </motion.div>
  );
};


const ElementsPanel = () => {
  const [openGroups, setOpenGroups] = useState(
    new Set(["Layout & Sections", "Text", "Buttons", "Media", "Components"])
  );
  const [search, setSearch] = useState("");
  const previewMode = useBuilderStore((state) => state.previewMode);

  if (previewMode) return null;

  const toggleGroup = (title) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(title) ? next.delete(title) : next.add(title);
      return next;
    });
  };

  const filteredGroups = elementGroups
    .map((g) => ({
      ...g,
      items: g.items.filter((i) =>
        i.label.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <motion.aside
      initial={{ x: -268, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -268, opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
      className="glass w-[268px] flex-shrink-0 flex flex-col overflow-hidden h-full z-10"
    >
      <div className="px-4 pt-4 pb-3 border-b border-border/20">
        <div className="panel-header mb-3">
          <span>Add Elements</span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search components..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="prop-input pl-9 text-xs h-9"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-2">
        {filteredGroups.map((group, gIdx) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + gIdx * 0.06 }}
            className="mb-1"
          >
            <button
              onClick={() => toggleGroup(group.title)}
              className="flex items-center gap-2 w-full px-2 py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
            >
              <div
                className="w-1.5 h-1.5 rounded-full transition-shadow"
                style={{ backgroundColor: group.color, boxShadow: `0 0 6px ${group.color}` }}
              />
              <span className="uppercase tracking-[0.12em]">{group.title}</span>
              <span className="ml-auto font-mono text-[10px] text-muted-foreground/40">
                {group.items.length}
              </span>
              <motion.div
                animate={{ rotate: openGroups.has(group.title) ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-3 h-3 text-muted-foreground/40" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {openGroups.has(group.title) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="overflow-hidden"
                >
                  <div className="space-y-0.5 pb-1">
                    {group.items.map((item) => (
                      <DraggableItem key={item.label} item={item} groupColor={group.color} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.aside>
  );
};

export default ElementsPanel;
