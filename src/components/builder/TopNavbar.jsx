import { motion } from "framer-motion";
import {
  Undo2, Redo2, Eye, Download, Monitor, Tablet, Smartphone,
  Sparkles, Save, Trash2
} from "lucide-react";
import GradientText from "@/components/reactbits/GradientText.jsx";
import Magnet from "@/components/reactbits/Magnet.jsx";
import { useBuilderStore } from "@/store/builderStore.js";

const TopNavbar = () => {
  const { deviceMode, setDeviceMode, previewMode, setPreviewMode, exportJSON, clearCanvas } = useBuilderStore();

  const devices = [
    { mode: "desktop", icon: Monitor, label: "Desktop" },
    { mode: "tablet", icon: Tablet, label: "Tablet" },
    { mode: "mobile", icon: Smartphone, label: "Mobile" },
  ];

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      className="glass-navbar fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-5"
    >
      <Magnet padding={50} magnetStrength={3}>
        <div className="flex items-center gap-2.5 cursor-pointer">
          <motion.div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, hsl(260 100% 68%), hsl(330 90% 62%))",
            }}
            whileHover={{ rotate: 90, scale: 1.1 }}
            transition={{ duration: 0.4 }}
          >
            <Sparkles className="w-4.5 h-4.5 text-primary-foreground" />
          </motion.div>
          <GradientText
            colors={["#8b5cf6", "#ec4899", "#3b82f6", "#8b5cf6"]}
            animationSpeed={5}
            className="text-lg tracking-tight"
          >
            PrismaBuild
          </GradientText>
        </div>
      </Magnet>

      <div className={`flex items-center gap-2 transition-opacity ${previewMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mr-2">
          Viewport
        </span>
        <div className="flex items-center gap-0.5 glass-inset px-1 py-1 rounded-xl">
          {devices.map(({ mode, icon: Icon, label }) => (
            <motion.button
              key={mode}
              onClick={() => setDeviceMode(mode)}
              className={`relative px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-300 ${
                deviceMode === mode
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              whileTap={{ scale: 0.92 }}
            >
              {deviceMode === mode && (
                <motion.div
                  layoutId="viewport-pill"
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: "hsl(260 100% 68% / 0.12)",
                    border: "1px solid hsl(260 100% 68% / 0.2)",
                    boxShadow: "0 0 12px -3px hsl(260 100% 68% / 0.3)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10 hidden sm:inline">{label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <motion.button className="icon-btn text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={clearCanvas} whileTap={{ scale: 0.85 }} title="Clear Canvas">
          <Trash2 className="w-4 h-4" />
        </motion.button>

        <div className="w-px h-5 bg-border/40 mx-1.5" />

        <motion.button
          onClick={() => setPreviewMode(!previewMode)}
          className={`icon-btn flex items-center gap-1.5 px-3 text-xs font-medium ${previewMode ? 'bg-primary/20 text-primary' : ''}`}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.03 }}
        >
          <Eye className="w-4 h-4" />
          <span className={previewMode ? "text-primary" : "text-muted-foreground"}>{previewMode ? "Edit" : "Preview"}</span>
        </motion.button>

        <Magnet padding={50} magnetStrength={3}>
          <motion.button
            onClick={exportJSON}
            whileTap={{ scale: 0.93 }}
            whileHover={{ scale: 1.05 }}
            className="ml-1 px-4 py-2 rounded-xl text-sm font-semibold text-primary-foreground flex items-center gap-2"
            style={{
              background: "linear-gradient(135deg, hsl(260 100% 68%), hsl(330 90% 62%))",
              boxShadow: "0 0 20px -4px hsl(260 100% 68% / 0.5)",
            }}
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </motion.button>
        </Magnet>
      </div>
    </motion.header>
  );
};

export default TopNavbar;
