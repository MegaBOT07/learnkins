import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trophy, Star, X } from "lucide-react";
import type { NewAchievementData } from "../utils/achievements";

const CATEGORY_STYLES: Record<string, { accent: string; bg: string; text: string; badge: string }> = {
  learning: { accent: "bg-blue-500", bg: "bg-blue-50", text: "text-blue-800", badge: "bg-blue-100 text-blue-700 border-blue-300" },
  social: { accent: "bg-green-500", bg: "bg-green-50", text: "text-green-800", badge: "bg-green-100 text-green-700 border-green-300" },
  exploration: { accent: "bg-purple-500", bg: "bg-purple-50", text: "text-purple-800", badge: "bg-purple-100 text-purple-700 border-purple-300" },
  mastery: { accent: "bg-orange-500", bg: "bg-orange-50", text: "text-orange-800", badge: "bg-orange-100 text-orange-700 border-orange-300" },
};

const DEFAULT_STYLE = { accent: "bg-yellow-500", bg: "bg-yellow-50", text: "text-yellow-800", badge: "bg-yellow-100 text-yellow-700 border-yellow-300" };

interface AchievementToastItem extends NewAchievementData {
  id: number;
  category?: string;
}

interface AchievementToastContextValue {
  showAchievementToast: (data: NewAchievementData & { category?: string }) => void;
}

const AchievementToastContext = createContext<AchievementToastContextValue | null>(null);

let nextId = 0;

export function AchievementToastProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<AchievementToastItem[]>([]);
  const [active, setActive] = useState<AchievementToastItem | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToastRef = useRef<(data: NewAchievementData & { category?: string }) => void>(() => {});

  const dismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setActive(null);
  }, []);

  const showAchievementToast = useCallback(
    (data: NewAchievementData & { category?: string }) => {
      const item: AchievementToastItem = { ...data, id: nextId++ };
      setQueue((prev) => [...prev, item]);
    },
    []
  );

  // Keep ref in sync so the event listener (mounted once) always calls the latest callback
  useEffect(() => {
    showToastRef.current = showAchievementToast;
  }, [showAchievementToast]);

  // Process queue: if nothing active and queue has items, pop one
  useEffect(() => {
    if (active || queue.length === 0) return;

    const [next, ...rest] = queue;
    setActive(next);
    setQueue(rest);

    timerRef.current = setTimeout(() => {
      setActive(null);
      timerRef.current = null;
    }, 3800);
  }, [active, queue]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Auto-listen for achievement unlock events from storeNewAchievements()
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<NewAchievementData[]>).detail;
      detail.forEach((ach) => showToastRef.current(ach));
    };
    window.addEventListener("learnkins-achievement-unlocked", handler);
    return () => window.removeEventListener("learnkins-achievement-unlocked", handler);
  }, []);

  const style = active ? (CATEGORY_STYLES[active.category || ""] || DEFAULT_STYLE) : DEFAULT_STYLE;

  return (
    <AchievementToastContext.Provider value={{ showAchievementToast }}>
      {children}

      {/* Toast container — top-right */}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="pointer-events-auto"
            >
              <div
                className={`relative overflow-hidden bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4`}
              >
                {/* Category accent bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${style.accent}`} />

                {/* Sparkle decoration */}
                <motion.div
                  className="absolute top-2 right-10 text-yellow-400"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: [0, 1.2, 1], rotate: [-45, 15, 0] }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Star size={14} fill="currentColor" />
                </motion.div>
                <motion.div
                  className="absolute top-6 right-4 text-yellow-300"
                  initial={{ scale: 0, rotate: 45 }}
                  animate={{ scale: [0, 1, 0.8], rotate: [45, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Star size={10} fill="currentColor" />
                </motion.div>

                <div className="flex items-center gap-3.5 pl-2">
                  {/* Achievement icon */}
                  <motion.div
                    className="text-4xl flex-shrink-0"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
                  >
                    {active.icon}
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <motion.p
                      className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-0.5"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      Achievement Unlocked
                    </motion.p>
                    <motion.p
                      className="font-black text-black text-sm leading-tight truncate"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      {active.name}
                    </motion.p>
                    <motion.div
                      className="flex items-center gap-2 mt-1.5"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.badge}`}
                      >
                        +{active.points} pts
                      </span>
                      <Trophy size={12} className="text-yellow-500" />
                    </motion.div>
                  </div>

                  {/* Dismiss */}
                  <button
                    onClick={dismiss}
                    className="flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity p-1"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Progress bar — auto-dismiss timer visual */}
                <motion.div
                  className="absolute bottom-0 left-1.5 right-0 h-1 bg-gray-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    className={`h-full ${style.accent} opacity-40`}
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 3.6, ease: "linear", delay: 0.2 }}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AchievementToastContext.Provider>
  );
}

export function useAchievementToast() {
  const ctx = useContext(AchievementToastContext);
  if (!ctx) throw new Error("useAchievementToast must be used within AchievementToastProvider");
  return ctx;
}
