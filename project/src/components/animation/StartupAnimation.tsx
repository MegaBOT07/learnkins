import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StartupAnimationProps {
  onComplete: () => void;
}

const StartupAnimation = ({ onComplete }: StartupAnimationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [showFloatingIcons, setShowFloatingIcons] = useState(false);

  useEffect(() => {
    console.log("Startup animation starting...");

    const timers = [
      setTimeout(() => {
        console.log("Showing particles");
        setShowParticles(true);
      }, 300),
      setTimeout(() => {
        console.log("Showing logo");
        setShowLogo(true);
      }, 800),
      setTimeout(() => {
        console.log("Showing subtitle");
        setShowSubtitle(true);
      }, 1500),
      setTimeout(() => {
        console.log("Showing loading");
        setShowLoading(true);
      }, 2000),
      setTimeout(() => {
        console.log("Showing skip button");
        setShowSkipButton(true);
      }, 1000),
      setTimeout(() => {
        console.log("Showing floating icons");
        setShowFloatingIcons(true);
      }, 500),
      setTimeout(() => {
        console.log("Animation complete");
        onComplete();
      }, 4500),
    ];

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [onComplete]);

  const handleSkip = () => {
    console.log("Skipping animation");
    onComplete();
  };

  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    size: Math.random() * 6 + 3,
    duration: Math.random() * 2 + 2,
  }));

  const colors = ["#4f7cff", "#a855f7", "#ff8c42", "#22c55e"];

  const floatingIcons = [
    { emoji: "📚", position: "top-1/4 left-1/4", delay: 0 },
    { emoji: "🎮", position: "top-1/3 right-1/4", delay: 0.5 },
    { emoji: "🏆", position: "bottom-1/4 left-1/3", delay: 1 },
    { emoji: "⭐", position: "bottom-1/3 right-1/3", delay: 0.8 },
    { emoji: "🧠", position: "top-1/2 left-1/6", delay: 0.3 },
    { emoji: "🎯", position: "bottom-1/3 left-1/6", delay: 1.2 },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-learnkins-blue-900 to-slate-800 flex items-center justify-center overflow-hidden"
      >
        {/* Skip Button */}
        {showSkipButton && (
          <motion.button
            onClick={handleSkip}
            className="absolute top-4 right-4 z-20 px-4 py-2 text-white text-sm border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-300"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Skip
          </motion.button>
        )}

        {/* Animated Background Particles */}
        {showParticles && (
          <div className="absolute inset-0">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: colors[particle.id % colors.length],
                  boxShadow: `0 0 ${particle.size * 2}px ${
                    colors[particle.id % colors.length]
                  }`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [0, -100, -200],
                  x: [0, Math.random() * 50 - 25, Math.random() * 100 - 50],
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}

        {/* Main Content */}
        <div className="relative z-10 text-center">
          {/* Logo/Title Animation */}
          {showLogo && (
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 1.2,
              }}
              className="mb-8"
            >
              <motion.h1
                className="text-6xl md:text-8xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1 }}
              >
                LearnKins
              </motion.h1>
            </motion.div>
          )}

          {/* Subtitle Animation */}
          {showSubtitle && (
            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Education meets adventure
            </motion.p>
          )}

          {/* Loading Progress Bar */}
          {showLoading && (
            <motion.div
              className="mt-8 w-64 h-2 bg-gray-700 rounded-full overflow-hidden mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-learnkins-blue-500 via-learnkins-purple-500 to-learnkins-orange-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5, delay: 0.5, ease: "easeInOut" }}
              />
            </motion.div>
          )}
        </div>

        {/* Floating Elements */}
        {showFloatingIcons &&
          floatingIcons.map((icon, index) => (
            <motion.div
              key={index}
              className={`absolute text-4xl ${icon.position}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0.8],
                scale: [0, 1, 0.9],
                y: [0, -20, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: icon.delay,
              }}
            >
              {icon.emoji}
            </motion.div>
          ))}

        {/* Background Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-radial-gradient opacity-30" />
      </motion.div>
    </AnimatePresence>
  );
};

export default StartupAnimation;
