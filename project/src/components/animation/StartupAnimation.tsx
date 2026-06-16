import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, GraduationCap, Gamepad2, Brain, Trophy, Star } from "lucide-react";

interface StartupAnimationProps {
  onComplete: () => void;
}

const StartupAnimation = ({ onComplete }: StartupAnimationProps) => {
  const [showLogo, setShowLogo] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [showFloatingIcons, setShowFloatingIcons] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setShowFloatingIcons(true), 300),
      setTimeout(() => setShowLogo(true), 800),
      setTimeout(() => setShowSubtitle(true), 1400),
      setTimeout(() => setShowLoading(true), 1800),
      setTimeout(() => setShowSkipButton(true), 500),
      setTimeout(() => onComplete(), 5500),
    ];

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [onComplete]);

  const handleSkip = () => onComplete();

  const floatingIcons = [
    { icon: <GraduationCap className="w-8 h-8" />, color: "bg-cyan-500", position: "top-[15%] left-[10%]", delay: 0 },
    { icon: <Gamepad2 className="w-8 h-8" />, color: "bg-purple-500", position: "top-[20%] right-[15%]", delay: 0.4 },
    { icon: <Brain className="w-8 h-8" />, color: "bg-orange-500", position: "bottom-[20%] left-[15%]", delay: 0.8 },
    { icon: <Trophy className="w-8 h-8" />, color: "bg-yellow-500", position: "bottom-[25%] right-[10%]", delay: 1.2 },
    { icon: <Star className="w-8 h-8" />, color: "bg-green-500", position: "top-[45%] left-[5%]", delay: 0.6 },
    { icon: <Sparkles className="w-8 h-8" />, color: "bg-pink-500", position: "bottom-[40%] right-[5%]", delay: 1 },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-white flex items-center justify-center overflow-hidden"
      >
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Skip Button */}
        {showSkipButton && (
          <motion.button
            onClick={handleSkip}
            className="absolute top-8 right-8 z-[110] px-6 py-2 bg-black text-white font-black rounded-xl border-2 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            SKIP
          </motion.button>
        )}

        {/* Floating Icons */}
        {showFloatingIcons &&
          floatingIcons.map((item, idx) => (
            <motion.div
              key={idx}
              className={`absolute p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${item.color} ${item.position}`}
              initial={{ scale: 0, opacity: 0, rotate: -20 }}
              animate={{
                scale: [0, 1.1, 1],
                opacity: 1,
                rotate: [0, 10, -10, 0],
                y: [0, -15, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: item.delay,
                ease: "easeInOut",
              }}
            >
              {item.icon}
            </motion.div>
          ))}

        {/* Main Content */}
        <div className="relative z-10 text-center px-4">
          <AnimatePresence>
            {showLogo && (
              <motion.div
                initial={{ y: 50, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                className="mb-4"
              >
                <h1 className="text-7xl md:text-9xl font-black text-black tracking-tighter">
                  LEARN<span className="text-cyan-500">KINS</span>
                </h1>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showSubtitle && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <div className="inline-block px-6 py-2 bg-yellow-400 border-2 border-black font-black text-xl md:text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-1">
                  Education Meets Adventure!
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading Animation */}
          {showLoading && (
            <div className="w-full max-w-sm mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <div className="h-8 w-full bg-white border-4 border-black rounded-full overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-orange-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3.5, ease: "easeInOut" }}
                  />
                </div>
                <motion.div
                  className="mt-4 font-black text-black tracking-widest uppercase text-sm"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  Loading Adventure...
                </motion.div>
              </motion.div>
            </div>
          )}
        </div>

        {/* Corner Decals */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-8 border-t-8 border-black m-8" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-8 border-b-8 border-black m-8" />
      </motion.div>
    </AnimatePresence>
  );
};

export default StartupAnimation;
