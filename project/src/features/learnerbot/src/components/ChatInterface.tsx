import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, Menu, X } from 'lucide-react';
import { Message, UserProgress } from '../types';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import Button from './ui/Button';
import Card from './ui/Card';
import Avatar from './Avatar';
import { apiService } from '../services/apiService';
import { progressService } from '../services/progressService';
import type { ChatMessage } from '../services/apiService';

interface ChatInterfaceProps {
}

const ChatInterface: React.FC<ChatInterfaceProps> = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [progress, setProgress] = useState<UserProgress>(progressService.getProgress());
  const [showSidebar, setShowSidebar] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [userName] = useState(
    () => localStorage.getItem('learnerbot_username') || 'Learning Champion'
  );
  const [isDesktop, setIsDesktop] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : false
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);

  // Responsive: track desktop vs mobile
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initial welcome message & first badge (avoid double-fire in StrictMode)
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const welcomeMessage: Message = {
      id: '1',
      type: 'bot',
      content: `🎉 Hey there, ${userName}! Welcome to the most awesome learning adventure ever! I'm your AI learning buddy, and I'm super excited to explore the world with you! \n\nWhat makes you curious today? I love talking about science, math, space, animals, technology, and so much more! \n\nReady to start our learning journey? 🚀`,
      timestamp: new Date(),
      isQuestion: true,
      options: [
        "Let's learn about space! 🌌",
        'Show me cool science! 🔬',
        'Math can be fun? 🧮',
        'Surprise me! ✨',
      ],
      emoji: '🎓',
    };

    setMessages([welcomeMessage]);

    const badge = progressService.earnBadge('first-chat');
    if (badge) {
      triggerConfetti();
      setProgress(progressService.getProgress());
    }
  }, [userName]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0;
    }
  }, []);

  // Scroll to bottom for new messages (but only after initial mount)
  useEffect(() => {
    // Disabled auto-scroll to prevent page jumping
    // Users can manually scroll if needed
  }, [messages, isTyping]);

  const triggerConfetti = async () => {
    try {
      // Load confetti from CDN if not available locally
      if (typeof window !== 'undefined' && !(window as any).confetti) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js';
        script.onload = () => {
          const confetti = (window as any).confetti;
          if (typeof confetti === 'function') {
            confetti({
              particleCount: 140,
              spread: 75,
              origin: { y: 0.6 },
              colors: ['#8B5CF6', '#EC4899', '#06B6D4', '#10B981'],
              scalar: 1.1,
            });
          }
        };
        document.head.appendChild(script);
      } else if ((window as any).confetti) {
        const confetti = (window as any).confetti;
        confetti({
          particleCount: 140,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#8B5CF6', '#EC4899', '#06B6D4', '#10B981'],
          scalar: 1.1,
        });
      }
    } catch (e) {
      // Silently fail if canvas-confetti is not available
      console.warn('confetti not available');
    }
  };

  const callApi = async (message: string): Promise<string> => {
    try {
      const response = await apiService.sendMessage(message, conversationHistory);

      // Log but don't break UX for missing API key
      if (response.error && !response.error.includes('API key not configured')) {
        console.warn('API Warning:', response.error);
      }

      return response.message;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  // Award tokens in the same localStorage shape used by the main app's TokenContext
  const awardLocalTokens = (amount: number, reason = 'learnerbot') => {
    try {
      const key = 'learnkins_tokens';
      const raw = localStorage.getItem(key);
      let state = { balance: 0, transactions: [] as any[] };
      if (raw) state = JSON.parse(raw);
      const tx = { id: Date.now().toString(), amount, reason, date: new Date().toISOString() };
      state.balance = (state.balance || 0) + amount;
      state.transactions = [tx, ...(state.transactions || [])].slice(0, 100);
      localStorage.setItem(key, JSON.stringify(state));
      console.log(`Awarded ${amount} tokens via LearnerBot for ${reason}`);
    } catch (e) {
      console.warn('Failed to award local tokens', e);
    }
  };

  // Award badges based on message count (after each update)
  useEffect(() => {
    if (messages.length >= 10) {
      const badge = progressService.earnBadge('curious-mind');
      if (badge) {
        triggerConfetti();
        setProgress(progressService.getProgress());
      }
    }
  }, [messages.length]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isTyping) return;

    const cleanContent = content.trim();

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: cleanContent,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const newUserMessage: ChatMessage = { role: 'user', content: cleanContent };
    setConversationHistory((prev) => [...prev, newUserMessage]);

    setIsTyping(true);

    try {
      const botResponse = await callApi(cleanContent);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        emoji: '🤖',
      };

      setMessages((prev) => [...prev, botMessage]);

      const newBotMessage: ChatMessage = { role: 'assistant', content: botResponse };
      setConversationHistory((prev) => [...prev, newBotMessage]);

      // XP progression
      const updatedProgress = progressService.addXP(10);
      setProgress(updatedProgress);
      // Award a small token for using the bot
      try {
        awardLocalTokens(1, 'learnerbot:message');
      } catch (e) {}
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content:
          "Oops! Something went wrong, but don't worry - I'm still here to help you learn amazing things! Let's try again! 🌟",
        timestamp: new Date(),
        emoji: '😅',
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error('Chat API Error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleOptionClick = (option: string) => {
    handleSendMessage(option);
  };

  const earnedBadges = progress.badges.filter((b) => b.earned);
  const recentBadges = earnedBadges.slice(-3);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-950 via-purple-950 to-sky-950 flex items-stretch justify-center text-white">
      {/* App shell for nicer desktop centering */}
      <div className="relative flex h-full w-full max-w-7xl mx-auto md:my-4 md:rounded-3xl md:border md:border-slate-800/70 md:shadow-[0_0_60px_rgba(15,23,42,0.9)] overflow-hidden bg-slate-950/80 backdrop-blur-2xl">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setShowSidebar((prev) => !prev)}
          className="fixed md:hidden top-4 left-4 z-50 w-11 h-11 bg-slate-900/95 hover:bg-slate-800/95 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-sm border border-slate-700/70"
        >
          {showSidebar ? (
            <X className="w-6 h-6 text-slate-200" />
          ) : (
            <Menu className="w-6 h-6 text-slate-200" />
          )}
        </button>

        {/* Sidebar */}
        <AnimatePresence>
          {(showSidebar || isDesktop) && (
            <motion.aside
              initial={{ x: -260, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -260, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed md:relative z-40 w-80 h-full bg-slate-950/90 backdrop-blur-xl border-r border-slate-800/70 shadow-2xl flex-shrink-0"
            >
              <div className="p-5 h-full overflow-y-auto space-y-6 custom-scrollbar">
                {/* Profile Card */}
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-5 mb-3 bg-slate-900/90 border-slate-700/70 shadow-lg hover:border-purple-400/60 hover:shadow-purple-500/20 transition-all duration-300">
                    <div className="flex flex-col items-center text-center">
                      <Avatar type="user" size="lg" />
                      <h3 className="text-xl font-extrabold text-white mt-4 mb-1">
                        {userName}!
                      </h3>
                      <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span>
                          Level{' '}
                          <span className="font-semibold text-amber-300">
                            {progress.level}
                          </span>
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400">
                        Keep chatting to power up your learning hero ⚡
                      </p>
                    </div>
                  </Card>
                </motion.div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 text-center bg-slate-900/80 border-slate-700/70 shadow hover:shadow-slate-900/80 transition-all duration-200">
                    <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">
                      XP Points
                    </div>
                    <div className="text-2xl font-extrabold text-purple-300">
                      {progress.xp}
                    </div>
                    <div className="mt-1 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full w-1/2 bg-gradient-to-r from-purple-500 to-pink-500" />
                    </div>
                  </Card>
                  <Card className="p-4 text-center bg-slate-900/80 border-slate-700/70 shadow hover:shadow-slate-900/80 transition-all duration-200">
                    <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">
                      Day Streak
                    </div>
                    <div className="text-2xl font-extrabold text-cyan-300">
                      {progress.streak}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-400">
                      Come back daily to keep it glowing 🔥
                    </div>
                  </Card>
                </div>

                {/* Recent Badges */}
                <Card className="p-4 bg-slate-900/80 border-purple-500/40 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      Recent Badges
                    </h4>
                    {earnedBadges.length > 0 && (
                      <span className="text-[10px] text-slate-400">
                        {earnedBadges.length} earned
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {recentBadges.length > 0 ? (
                      recentBadges.map((badge) => (
                        <motion.div
                          key={badge.id}
                          whileHover={{ scale: 1.08, rotate: 3 }}
                          className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center text-lg shadow-lg border border-amber-300/60"
                          title={badge.name}
                        >
                          {badge.emoji}
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500">
                        Keep chatting to unlock your first badge! 🎯
                      </p>
                    )}
                  </div>
                </Card>

                {/* Actions */}
                <div className="space-y-3">
                  <Button
                    onClick={() => handleSendMessage("Let's do a quiz!")}
                    variant="success"
                    className="w-full !py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-emerald-500/20"
                  >
                    🎯 Quick Quiz
                  </Button>
                </div>

                {/* Tip Card */}
                <Card className="p-4 mt-2 bg-gradient-to-r from-purple-600/25 via-pink-600/25 to-cyan-500/25 border-purple-500/40 shadow-md">
                  <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
                    💡 Learning Tip
                  </h4>
                  <p className="text-xs text-slate-100 leading-relaxed">
                    Ask follow-up questions and try explaining concepts in your own words.
                    Teaching your AI buddy is one of the best ways to learn! 🌱
                  </p>
                </Card>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/70 px-4 py-3 shadow-lg">
            <div className="flex items-center justify-between max-w-5xl mx-auto gap-3">
              <div className="flex items-center space-x-4">
                <Avatar type="bot" emoji="🎓" size="md" />
                <div className="space-y-0.5">
                  <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
                    LearnerBot
                  </h1>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-xs md:text-sm text-slate-300">
                      Online · Ready to learn with you 🚀
                    </span>
                  </div>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-3 text-sm">
                <div className="flex items-center gap-2 bg-purple-600/20 px-3 py-1.5 rounded-full border border-purple-500/40 shadow-sm">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-semibold">
                    Level {progress.level}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-cyan-600/20 px-3 py-1.5 rounded-full border border-cyan-400/40 shadow-sm">
                  <span className="text-cyan-300 font-semibold">{progress.xp} XP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-6 relative custom-scrollbar"
          >
            {/* Soft animated background blobs */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                className="absolute top-16 left-16 w-40 h-40 bg-purple-500/40 rounded-full blur-2xl"
              />
              <motion.div
                animate={{
                  rotate: [360, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute bottom-20 right-20 w-56 h-56 bg-cyan-500/40 rounded-full blur-3xl"
              />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto space-y-4">
              {/* subtle “today” pill when there are messages */}
              {messages.length > 0 && (
                <div className="flex justify-center mb-1">
                  <span className="px-3 py-1 text-[11px] rounded-full bg-slate-900/80 border border-slate-700/70 text-slate-300">
                    ✨ New learning session
                  </span>
                </div>
              )}

              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onOptionClick={handleOptionClick}
                />
              ))}

              {isTyping && <TypingIndicator />}
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* Input – sticky with slight elevated card */}
          <div className="border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-xl">
            <div className="max-w-4xl mx-auto px-3 sm:px-6 py-3">
              <div className="rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-[0_0_30px_rgba(15,23,42,0.9)]">
                <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
              </div>
              <p className="mt-1.5 text-[10px] text-slate-500 text-center">
                Tip: Ask “Give me a fun quiz on …” to practice what you’ve learned 🎯
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {showSidebar && !isDesktop && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
