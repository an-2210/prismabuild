import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Zap, Layers, Palette, MousePointer2 } from "lucide-react";
import ParticleField from "@/components/reactbits/ParticleField.jsx";
import GradientText from "@/components/reactbits/GradientText.jsx";
import BlurText from "@/components/reactbits/BlurText.jsx";
import DecryptedText from "@/components/reactbits/DecryptedText.jsx";
import RotatingText from "@/components/reactbits/RotatingText.jsx";
import SpotlightCard from "@/components/reactbits/SpotlightCard.jsx";
import Magnet from "@/components/reactbits/Magnet.jsx";

const features = [
  {
    icon: MousePointer2,
    title: "Drag & Drop",
    desc: "Place elements visually with zero code",
    color: "#8b5cf6",
  },
  {
    icon: Palette,
    title: "Style Engine",
    desc: "Full CSS control with visual properties",
    color: "#ec4899",
  },
  {
    icon: Layers,
    title: "Layer System",
    desc: "Organize with a Figma-like layer tree",
    color: "#3b82f6",
  },
  {
    icon: Zap,
    title: "Instant Preview",
    desc: "See changes live across all devices",
    color: "#06b6d4",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState(null);

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col" style={{ background: "hsl(var(--background))" }}>
      <ParticleField
        particleCount={100}
        colors={["#8b5cf640", "#3b82f640", "#ec489940", "#06b6d440"]}
        speed={0.2}
        connectionDistance={100}
      />

      <motion.div
        className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: "radial-gradient(circle, hsl(260 100% 68% / 0.3), transparent 60%)" }}
      />
      <motion.div
        className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.12, 0.06] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{ background: "radial-gradient(circle, hsl(330 90% 62% / 0.25), transparent 60%)" }}
      />
      <motion.div
        className="absolute top-[40%] right-[20%] w-[400px] h-[400px] rounded-full pointer-events-none"
        animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.1, 0.04] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        style={{ background: "radial-gradient(circle, hsl(210 100% 60% / 0.2), transparent 60%)" }}
      />

      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 flex items-center justify-between px-8 py-5"
      >
        <Magnet padding={50} magnetStrength={3}>
          <div className="flex items-center gap-2.5 cursor-pointer">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, hsl(260 100% 68%), hsl(330 90% 62%))" }}
              whileHover={{ rotate: 90, scale: 1.1 }}
              transition={{ duration: 0.4 }}
            >
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <GradientText colors={["#8b5cf6", "#ec4899", "#3b82f6", "#8b5cf6"]} animationSpeed={5} className="text-xl tracking-tight">
              PrismaBuild
            </GradientText>
          </div>
        </Magnet>

        <div className="flex items-center gap-6">
        </div>
      </motion.nav>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 -mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="glass-inset px-4 py-1.5 rounded-full flex items-center gap-2 mb-8">
            <motion.div
              className="w-2 h-2 rounded-full bg-green-400"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <DecryptedText
              text="Now in Public Beta"
              speed={40}
              maxIterations={6}
              sequential
              className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
              animateOn="view"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="text-center max-w-3xl"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.1] tracking-tight mb-2">
            <BlurText text="Build websites" className="justify-center text-foreground" delay={60} animateBy="words" />
          </h1>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.1] tracking-tight">
            <span className="text-foreground">that are </span>
            <RotatingText
              texts={["stunning", "responsive", "powerful", "beautiful"]}
              rotationInterval={2200}
              className="text-primary neon-text-purple"
              splitBy="characters"
              staggerDuration={0.03}
            />
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-lg text-muted-foreground text-center max-w-lg mt-6 leading-relaxed"
        >
          The no-code website builder with a{" "}
          <span className="text-foreground font-medium">design-tool feel</span>.
          Drag, drop, and ship production-ready sites in minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="flex justify-center mt-10 w-full"
        >
          <Magnet padding={60} magnetStrength={2.5}>
            <motion.button
              onClick={() => navigate("/builder")}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.04 }}
              className="group px-8 py-3.5 rounded-2xl text-sm font-semibold text-primary-foreground flex items-center gap-2.5 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, hsl(260 100% 68%), hsl(330 90% 62%))",
                boxShadow: "0 0 30px -6px hsl(260 100% 68% / 0.5), 0 10px 30px -10px hsl(260 100% 68% / 0.3)",
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
              />
              <span className="relative z-10">Start Building</span>
              <motion.div
                className="relative z-10"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.button>
          </Magnet>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-20 max-w-3xl w-full"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.1 }}
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <SpotlightCard
                className="glass p-4 h-full cursor-pointer"
                spotlightColor={`${feature.color}25`}
              >
                <motion.div
                  animate={hoveredFeature === i ? { y: -3, scale: 1.05 } : { y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{
                      background: `${feature.color}15`,
                      border: `1px solid ${feature.color}25`,
                    }}
                  >
                    <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{feature.desc}</p>
                </motion.div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="relative z-10 h-20 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};

export default LandingPage;
