/**
 * Maya — LearnKins Robot Guide + Chat Companion
 *
 * • Physically flies to viewport coordinates during tour (game-guide NPC)
 * • SVG robot body — no emoji sprite
 * • Speaks every tour message via Web Speech API (mutable)
 * • After tour: idle in corner — click to open mini embedded chat
 *   powered by the local LearnerBot API service
 */

import React, {
  useState, useEffect, useRef, useCallback, FormEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  X, ChevronRight, ChevronLeft,
  Send, Volume2, VolumeX, MessageSquare, Map,
} from "lucide-react";
// LearnerBot API (OpenRouter-backed)
import { apiService } from "../../features/learnerbot/src/services/apiService";
import type { ChatMessage } from "../../features/learnerbot/src/services/apiService";

export const MAYA_TOUR_KEY = "learnkins_maya_tour_v3";

/* ── Tour steps ─────────────────────────────────────────────── */
const STEPS = [
  { path:"/",           vw:50,vh:42, color:"#a855f7", grad:["#7c3aed","#ec4899"] as [string,string], emoji:"👋", title:"Hey! I'm Maya!",       message:"Welcome to LearnKins! I'm your AI guide bot. I'll fly across the site and show you around. Let's begin the tour!" },
  { path:"/subjects",   vw:28,vh:38, color:"#3b82f6", grad:["#2563eb","#06b6d4"] as [string,string], emoji:"📚", title:"Subjects",             message:"Explore Maths, Science, Social Science and English. Each subject has chapters, notes, video lessons and quizzes to help you master every topic." },
  { path:"/flashcards", vw:68,vh:48, color:"#f59e0b", grad:["#d97706","#f97316"] as [string,string], emoji:"🃏", title:"Flashcards",           message:"Create your own flashcard decks or use ready-made ones. Flip cards, test your memory and lock in what you learn for good." },
  { path:"/games-quiz", vw:32,vh:55, color:"#ef4444", grad:["#dc2626","#f97316"] as [string,string], emoji:"🎮", title:"Games & Quizzes",      message:"Play subject-based quizzes and fun learning games. Every correct answer and win earns you tokens to spend in the Diamond Store!" },
  { path:"/games",      vw:70,vh:30, color:"#8b5cf6", grad:["#7c3aed","#6366f1"] as [string,string], emoji:"🕹️", title:"Interactive Games",    message:"Dive into our interactive games — History Game, Grammar Warrior, Word Builder, Treasure Hunt and more! Learning through play is the best way to master concepts." },
  { path:"/quizzes",    vw:28,vh:58, color:"#ec4899", grad:["#db2777","#f43f5e"] as [string,string], emoji:"🎯", title:"Professional Quizzes", message:"Challenge yourself with comprehensive professional quizzes across all subjects. Track your scores, see rankings, and earn recognition!" },
  { path:"/community",  vw:70,vh:42, color:"#10b981", grad:["#059669","#0d9488"] as [string,string], emoji:"👥", title:"Community",            message:"Connect with fellow learners, join study groups, share resources and collaborate. Learning together makes everything more fun." },
  { path:"/learnerbot", vw:50,vh:45, color:"#f59e0b", grad:["#f59e0b","#ec4899"] as [string,string], emoji:"🤖", title:"AI LearnerBot",       message:"Meet your AI study companion! Ask questions, get explanations, practice with custom quizzes and learn at your own pace — all powered by AI." },
  { path:"/",           vw:50,vh:42, color:"#a855f7", grad:["#7c3aed","#ec4899"] as [string,string], emoji:"🚀", title:"You're all set!",      message:"Tour complete! I'll be in the bottom corner. Click me to restart the tour or open my chat and ask anything study related. Happy learning!" },
];

/* ── Voice / TTS ────────────────────────────────────────────── */
function speak(text: string, muted: boolean) {
  if (muted || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text.replace(/[🎉📚🎮💎👥📈🚀👋🃏✨]/gu, ""));
  utt.rate  = 1.07;
  utt.pitch = 1.15;
  // Prefer a friendly en-GB or en-US voice
  const voices = window.speechSynthesis.getVoices();
  const pick = voices.find(v => /Samantha|Karen|Google UK English Female|Microsoft Zira|en-GB|en-US/i.test(v.name))
    ?? voices.find(v => v.lang.startsWith("en"));
  if (pick) utt.voice = pick;
  window.speechSynthesis.speak(utt);
}

/* ── Robot SVG Sprite ───────────────────────────────────────── */
interface BotSpriteProps {
  size?: number;
  color?: string;
  flipX?: boolean;
  blinking?: boolean;
  talking?: boolean;
}
const BotSprite: React.FC<BotSpriteProps> = ({
  size = 64, color = "#a855f7", flipX = false, blinking = false, talking = false,
}) => {
  const uid = color.replace(/[^a-z0-9]/gi, "x");
  return (
    <svg
      width={size} height={Math.round(size * 1.38)}
      viewBox="0 0 64 88" fill="none"
      style={{ transform: flipX ? "scaleX(-1)" : "none", overflow:"visible", display:"block" }}
    >
      <defs>
        <radialGradient id={`bg${uid}`} cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#1e1b4b" /><stop offset="100%" stopColor="#0f0a1e" />
        </radialGradient>
        <radialGradient id={`eg${uid}`} cx="38%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#e0e7ff" /><stop offset="100%" stopColor="#a5b4fc" />
        </radialGradient>
        <radialGradient id={`gl${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" /><stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`hg${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.55" /><stop offset="100%" stopColor={color} />
        </linearGradient>
        <linearGradient id={`cg${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" /><stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Glow aura */}
      <ellipse cx="32" cy="50" rx="28" ry="36" fill={`url(#gl${uid})`} />

      {/* Antenna */}
      <line x1="32" y1="6" x2="32" y2="14" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="4" r="4" fill={color} />
      <motion.circle cx="32" cy="4" r="4"
        fill="none" stroke={color} strokeWidth="1.5" opacity={0}
        animate={{ r:[4,9], opacity:[0.7,0] }}
        transition={{ duration:1.6, repeat:Infinity }}
      />

      {/* Head */}
      <rect x="10" y="14" width="44" height="36" rx="9" fill={`url(#bg${uid})`} />
      <rect x="10" y="14" width="44" height="36" rx="9" stroke={color} strokeWidth="1.8" strokeOpacity="0.6" />
      {/* Head shine */}
      <ellipse cx="28" cy="18" rx="10" ry="4" fill="white" fillOpacity="0.04" />

      {/* Eye sockets */}
      <rect x="14" y="20" width="15" height="18" rx="5" fill={`url(#eg${uid})`} fillOpacity="0.15" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
      <rect x="35" y="20" width="15" height="18" rx="5" fill={`url(#eg${uid})`} fillOpacity="0.15" stroke={color} strokeWidth="1" strokeOpacity="0.5" />

      {/* Eye lenses */}
      <ellipse cx="21.5" cy="29" rx={blinking ? 5.5 : 5.5} ry={blinking ? 1 : 7} fill={`url(#eg${uid})`} />
      <ellipse cx="42.5" cy="29" rx={blinking ? 5.5 : 5.5} ry={blinking ? 1 : 7} fill={`url(#eg${uid})`} />
      {!blinking && (
        <>
          <circle cx="21.5" cy="29" r="3.5" fill={color} />
          <circle cx="42.5" cy="29" r="3.5" fill={color} />
          <circle cx="21.5" cy="29" r="1.8" fill="#0f0a1e" />
          <circle cx="42.5" cy="29" r="1.8" fill="#0f0a1e" />
          <circle cx="23"   cy="27" r="1"   fill="white" />
          <circle cx="44"   cy="27" r="1"   fill="white" />
        </>
      )}

      {/* Mouth / speaker grille */}
      <rect x="18" y="41" width="28" height={talking ? 6 : 4} rx="2.5" fill={color} fillOpacity="0.3"
        style={{ transition:"height 0.1s" }} />
      {[0,1,2,3].map(i => (
        <line key={i}
          x1={21 + i * 7} y1="41" x2={21 + i * 7} y2={talking ? 47 : 45}
          stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7"
          style={{ transition:"y2 0.1s" }}
        />
      ))}

      {/* Neck */}
      <rect x="27" y="50" width="10" height="6" rx="3" fill={color} fillOpacity="0.35" />

      {/* Body */}
      <rect x="12" y="56" width="40" height="28" rx="8" fill={`url(#cg${uid})`} stroke={color} strokeWidth="1.5" strokeOpacity="0.5" />
      {/* Chest gradient bar */}
      <rect x="12" y="56" width="40" height="5" rx="8" fill={`url(#hg${uid})`} />

      {/* Chest LEDs */}
      <motion.circle cx="22" cy="68" r="2.5" fill={color}
        animate={{ opacity:[1,0.2,1] }} transition={{ duration:1.2, repeat:Infinity }} />
      <motion.circle cx="30" cy="68" r="2.5" fill={color}
        animate={{ opacity:[1,0.2,1] }} transition={{ duration:1.2, repeat:Infinity, delay:0.4 }} />
      <motion.circle cx="38" cy="68" r="2.5" fill={color}
        animate={{ opacity:[1,0.2,1] }} transition={{ duration:1.2, repeat:Infinity, delay:0.8 }} />
      {/* Chest vent lines */}
      <line x1="18" y1="74" x2="46" y2="74" stroke={color} strokeWidth="1" strokeOpacity="0.3" />
      <line x1="18" y1="77" x2="46" y2="77" stroke={color} strokeWidth="1" strokeOpacity="0.2" />

      {/* Arms */}
      <rect x="1" y="58" width="11" height="20" rx="5.5" fill={`url(#cg${uid})`} stroke={color} strokeWidth="1.2" strokeOpacity="0.4" />
      <rect x="52" y="58" width="11" height="20" rx="5.5" fill={`url(#cg${uid})`} stroke={color} strokeWidth="1.2" strokeOpacity="0.4" />
      {/* Hand dots */}
      <circle cx="6.5" cy="79" r="3" fill={color} fillOpacity="0.45" />
      <circle cx="57.5" cy="79" r="3" fill={color} fillOpacity="0.45" />

      {/* Hover jets */}
      <ellipse cx="22" cy="86" rx="6" ry="2.5" fill={color} fillOpacity="0.18" />
      <ellipse cx="42" cy="86" rx="6" ry="2.5" fill={color} fillOpacity="0.18" />
      <motion.ellipse cx="22" cy="87" rx={5} ry={2}
        fill={color} fillOpacity={0.45}
        animate={{ ry:[2,3.5,2], fillOpacity:[0.45,0.1,0.45] }}
        transition={{ duration:0.55, repeat:Infinity, ease:"easeInOut" }}
      />
      <motion.ellipse cx="42" cy="87" rx={5} ry={2}
        fill={color} fillOpacity={0.45}
        animate={{ ry:[2,3.5,2], fillOpacity:[0.45,0.1,0.45] }}
        transition={{ duration:0.55, repeat:Infinity, ease:"easeInOut", delay:0.28 }}
      />
    </svg>
  );
};

/* ── Signal ring particles ──────────────────────────────────── */
const SignalRings: React.FC<{ color: string }> = ({ color }) =>
  <>{[0,1,2].map(i=>(
    <motion.div key={i}
      style={{ position:"absolute", inset:-6-i*10, borderRadius:"50%",
        border:`1.5px solid ${color}`, opacity:0 }}
      animate={{ opacity:[0,0.5,0], scale:[0.9,1.35,1.5] }}
      transition={{ duration:2, repeat:Infinity, delay:i*0.65, ease:"easeOut" }}
    />
  ))}</>;

/* ── Tour Speech Bubble ─────────────────────────────────────── */
const SpeechBubble: React.FC<{
  step: typeof STEPS[0]; stepIndex: number; total: number;
  onNext: ()=>void; onPrev: ()=>void; onSkip: ()=>void;
  isLast: boolean; isFirst: boolean; side: "left"|"right";
  isMuted: boolean; onToggleMute: ()=>void;
}> = ({ step, stepIndex, total, onNext, onPrev, onSkip, isLast, isFirst, side, isMuted, onToggleMute }) => {
  const isLeft = side === "left";
  return (
    <motion.div key={stepIndex}
      initial={{ opacity:0, scale:0.82, x: isLeft ? 16 : -16 }}
      animate={{ opacity:1, scale:1, x:0 }}
      exit={{ opacity:0, scale:0.82, x: isLeft ? 16 : -16 }}
      transition={{ type:"spring", damping:22, stiffness:280 }}
      style={{
        position:"absolute", top:"50%", transform:"translateY(-50%)",
        ...(isLeft ? { right:"calc(100% + 18px)" } : { left:"calc(100% + 18px)" }),
        width:290, background:"#080c1a", borderRadius:18,
        border:"1.5px solid rgba(255,255,255,0.1)",
        boxShadow:"0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)",
        zIndex:100, pointerEvents:"auto",
      }}
    >
      {/* Colour bar */}
      <div style={{ height:3, borderRadius:"18px 18px 0 0", background:`linear-gradient(90deg,${step.grad[0]},${step.grad[1]})` }} />
      {/* Caret */}
      <div style={{
        position:"absolute", top:"50%", transform:"translateY(-50%) rotate(45deg)",
        ...(isLeft
          ? { right:-7, borderTop:"1.5px solid rgba(255,255,255,0.1)", borderRight:"1.5px solid rgba(255,255,255,0.1)" }
          : { left:-7, borderBottom:"1.5px solid rgba(255,255,255,0.1)", borderLeft:"1.5px solid rgba(255,255,255,0.1)" }),
        width:13, height:13, background:"#080c1a",
      }} />
      {/* Header row */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 12px 4px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:28,height:28,borderRadius:8,background:`linear-gradient(135deg,${step.grad[0]},${step.grad[1]})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14 }}>{step.emoji}</div>
          <span style={{ fontSize:12.5,fontWeight:700,color:"#f8fafc" }}>{step.title}</span>
        </div>
        <div style={{ display:"flex",gap:5 }}>
          <button onClick={onToggleMute} title={isMuted?"Unmute":"Mute"}
            style={{ background:"rgba(255,255,255,0.07)",border:"none",borderRadius:7,width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color: isMuted?"#ef4444":"#a78bfa" }}>
            {isMuted ? <VolumeX size={11}/> : <Volume2 size={11}/>}
          </button>
          <button onClick={onSkip}
            style={{ background:"rgba(255,255,255,0.07)",border:"none",borderRadius:7,width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#64748b" }}>
            <X size={11}/>
          </button>
        </div>
      </div>
      <div style={{ padding:"4px 12px 10px", fontSize:11.5, color:"#94a3b8", lineHeight:1.65 }}>{step.message}</div>
      {/* Progress dots */}
      <div style={{ padding:"0 12px 7px", display:"flex", gap:4, alignItems:"center" }}>
        {Array.from({length:total}).map((_,i)=>(
          <div key={i} style={{ height:3.5,borderRadius:2,background:i===stepIndex?step.grad[0]:i<stepIndex?"#334155":"#1e293b",width:i===stepIndex?16:6,transition:"all 0.3s" }} />
        ))}
        <span style={{ marginLeft:"auto",fontSize:10,color:"#475569",fontWeight:600 }}>{stepIndex+1}/{total}</span>
      </div>
      {/* Buttons */}
      <div style={{ padding:"5px 12px 12px", display:"flex", gap:7 }}>
        {!isFirst && (
          <button onClick={onPrev} style={{ flex:1,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:9,padding:"7px 0",color:"#94a3b8",fontSize:11,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:3 }}>
            <ChevronLeft size={12}/> Back
          </button>
        )}
        <button onClick={onNext} style={{ flex:2,background:`linear-gradient(135deg,${step.grad[0]},${step.grad[1]})`,border:"none",borderRadius:9,padding:"7px 0",color:"#fff",fontSize:11.5,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4,boxShadow:`0 4px 16px ${step.color}44` }}>
          {isLast ? "🎉 Let's go!" : <>Next <ChevronRight size={12}/></>}
        </button>
      </div>
    </motion.div>
  );
};

/* ── Mini Chat panel ─────────────────────────────────────────── */
interface ChatMsg { role:"user"|"bot"; text:string; id:number; }

const MiniChat: React.FC<{ color:string; isMuted:boolean; onToggleMute:()=>void; onClose:()=>void }> = ({
  color, isMuted, onToggleMute, onClose,
}) => {
  const [msgs,    setMsgs]   = useState<ChatMsg[]>([{
    role:"bot", text:"Hey! I'm Maya 🤖 Ask me anything about your subjects, quizzes, or just about learning!", id:0,
  }]);
  const [input,   setInput]  = useState("");
  const [loading, setLoading]= useState(false);
  const [history, setHistory]= useState<ChatMessage[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    endRef.current?.scrollIntoView({ behavior:"smooth" });
  },[msgs, loading]);

  const send = async (e?: FormEvent) => {
    e?.preventDefault();
    const txt = input.trim();
    if (!txt || loading) return;
    const id = Date.now();
    setMsgs(p=>[...p,{ role:"user", text:txt, id }]);
    setInput("");
    setLoading(true);
    try {
      const newHistory: ChatMessage[] = [...history, { role:"user", content:txt }];
      const res = await apiService.sendMessage(txt, newHistory);
      const botText = res.message;
      setHistory([...newHistory, { role:"assistant", content:botText }]);
      setMsgs(p=>[...p,{ role:"bot", text:botText, id:id+1 }]);
      speak(botText, isMuted);
    } catch {
      setMsgs(p=>[...p,{ role:"bot", text:"Oops, I had trouble thinking. Try again!", id:id+2 }]);
    } finally {
      setLoading(false);
    }
  };

  const grad = `linear-gradient(135deg,${color},${color}88)`;

  return (
    <motion.div
      initial={{ opacity:0, scale:0.88, y:16 }}
      animate={{ opacity:1, scale:1, y:0 }}
      exit={{ opacity:0, scale:0.88, y:16 }}
      transition={{ type:"spring", damping:22, stiffness:280 }}
      style={{
        position:"absolute", bottom:"calc(100% + 14px)", right:0,
        width:340, height:460, display:"flex", flexDirection:"column",
        background:"#080c1a", borderRadius:20,
        border:"1.5px solid rgba(255,255,255,0.1)",
        boxShadow:"0 24px 70px rgba(0,0,0,0.85)",
        overflow:"hidden", zIndex:200,
      }}
    >
      {/* Header */}
      <div style={{ height:3, background:grad, flexShrink:0 }} />
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px 8px", flexShrink:0, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          <div style={{ width:32,height:32,borderRadius:10,background:grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17 }}>🤖</div>
          <div>
            <div style={{ fontSize:12.5,fontWeight:700,color:"#f8fafc" }}>Maya Bot</div>
            <div style={{ fontSize:10.5,color:"#475569" }}>AI Study Companion</div>
          </div>
        </div>
        <div style={{ display:"flex",gap:6 }}>
          <button onClick={onToggleMute} title={isMuted?"Unmute":"Mute"}
            style={{ background:"rgba(255,255,255,0.06)",border:"none",borderRadius:7,width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:isMuted?"#ef4444":"#a78bfa" }}>
            {isMuted ? <VolumeX size={12}/> : <Volume2 size={12}/>}
          </button>
          <button onClick={onClose}
            style={{ background:"rgba(255,255,255,0.06)",border:"none",borderRadius:7,width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#64748b" }}>
            <X size={12}/>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"12px 14px", display:"flex", flexDirection:"column", gap:10 }}>
        {msgs.map(m => (
          <div key={m.id} style={{ display:"flex", justifyContent: m.role==="user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth:"80%", padding:"8px 11px", borderRadius: m.role==="user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
              background: m.role==="user" ? grad : "rgba(255,255,255,0.06)",
              fontSize:11.5, color: m.role==="user" ? "#fff" : "#cbd5e1",
              lineHeight:1.6, whiteSpace:"pre-wrap",
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", gap:5, padding:"4px 0" }}>
            {[0,1,2].map(i=>(
              <motion.div key={i} style={{ width:7,height:7,borderRadius:"50%",background:color }}
                animate={{ y:[0,-6,0] }} transition={{ duration:0.7, repeat:Infinity, delay:i*0.15 }} />
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <form onSubmit={send} style={{ display:"flex", gap:8, padding:"10px 12px 12px", flexShrink:0, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
        <input
          value={input}
          onChange={e=>setInput(e.target.value)}
          placeholder="Ask me anything…"
          style={{ flex:1,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:11,padding:"8px 11px",fontSize:11.5,color:"#f8fafc",outline:"none" }}
          disabled={loading}
        />
        <button type="submit" disabled={!input.trim()||loading}
          style={{ width:36,height:36,borderRadius:11,background:input.trim()&&!loading?grad:"rgba(255,255,255,0.07)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:input.trim()&&!loading?"pointer":"default",flexShrink:0 }}>
          <Send size={14} color={input.trim()&&!loading?"#fff":"#475569"} />
        </button>
      </form>
    </motion.div>
  );
};

/* ── Idle menu (tour done) ──────────────────────────────────── */
const IdleMenu: React.FC<{
  onRestart:()=>void; onChat:()=>void; onClose:()=>void;
  isMuted:boolean; onToggleMute:()=>void;
}> = ({ onRestart, onChat, onClose, isMuted, onToggleMute }) => (
  <motion.div
    initial={{ opacity:0,scale:0.85,y:12 }} animate={{ opacity:1,scale:1,y:0 }} exit={{ opacity:0,scale:0.85,y:12 }}
    transition={{ type:"spring",damping:20,stiffness:260 }}
    style={{ position:"absolute",bottom:"calc(100% + 12px)",right:0,width:210,background:"#080c1a",borderRadius:16,border:"1.5px solid rgba(255,255,255,0.1)",boxShadow:"0 20px 60px rgba(0,0,0,0.8)",overflow:"hidden",zIndex:100 }}
  >
    <div style={{ height:3,background:"linear-gradient(90deg,#7c3aed,#06b6d4)" }} />
    <div style={{ padding:"12px 12px 10px" }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
        <div>
          <div style={{ fontSize:12.5,fontWeight:700,color:"#f8fafc" }}>Maya</div>
          <div style={{ fontSize:10.5,color:"#475569" }}>Your guide bot</div>
        </div>
        <button onClick={onClose} style={{ background:"rgba(255,255,255,0.07)",border:"none",borderRadius:7,width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#64748b" }}><X size={11}/></button>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:7 }}>
        <button onClick={onChat}
          style={{ width:"100%",background:"linear-gradient(135deg,#7c3aed,#06b6d4)",border:"none",borderRadius:9,padding:"9px 12px",color:"#fff",fontSize:11.5,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:7,boxShadow:"0 4px 18px #7c3aed44" }}>
          <MessageSquare size={13}/> Chat with me
        </button>
        <button onClick={onRestart}
          style={{ width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:9,padding:"8px 12px",color:"#94a3b8",fontSize:11.5,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:7 }}>
          <Map size={13} style={{ color:"#f59e0b" }}/> Restart Tour
        </button>
        <button onClick={onToggleMute}
          style={{ width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:9,padding:"8px 12px",color:"#94a3b8",fontSize:11.5,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:7 }}>
          {isMuted ? <><VolumeX size={13} style={{color:"#ef4444"}}/> Unmute voice</> : <><Volume2 size={13} style={{color:"#a78bfa"}}/> Mute voice</>}
        </button>
      </div>
    </div>
    {/* Caret */}
    <div style={{ position:"absolute",bottom:-7,right:22,width:13,height:13,background:"#080c1a",transform:"rotate(45deg)",borderRight:"1.5px solid rgba(255,255,255,0.1)",borderBottom:"1.5px solid rgba(255,255,255,0.1)" }} />
  </motion.div>
);

/* ── Main Component ─────────────────────────────────────────── */
type MayaMode = "hidden"|"touring"|"flying"|"idle"|"menu-open"|"chat-open";

const MayaCompanion: React.FC = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const AUTH_ROUTES = ["/login","/register","/forgot-password"];
  const onAuthPage = AUTH_ROUTES.includes(location.pathname);

  const [mode,      setMode]      = useState<MayaMode>("hidden");
  const [step,      setStep]      = useState(0);
  const [blink,     setBlink]     = useState(false);
  const [flipX,     setFlipX]     = useState(false);
  const [talking,   setTalking]   = useState(false);
  const [targetPos, setTargetPos] = useState({ x:0, y:0 });
  const [isMuted,   setIsMuted]   = useState(()=>localStorage.getItem("maya_muted")==="true");
  const flyingRef = useRef(false);

  const toggleMute = useCallback(()=>{
    setIsMuted(m=>{
      const next = !m;
      localStorage.setItem("maya_muted", String(next));
      if (next) window.speechSynthesis?.cancel();
      return next;
    });
  },[]);

  const resolvePos = useCallback((s: typeof STEPS[0]) => ({
    x: (s.vw/100) * window.innerWidth,
    y: (s.vh/100) * window.innerHeight,
  }),[]);

  const idlePos = useCallback(() => ({
    x: window.innerWidth  - 60,
    y: window.innerHeight - 60,
  }),[]);

  /* Init */
  useEffect(() => {
    if (onAuthPage) { setMode("hidden"); return; }
    const done = localStorage.getItem(MAYA_TOUR_KEY);
    const t = setTimeout(()=>{
      if (!done) {
        setTargetPos(resolvePos(STEPS[0]));
        setMode("touring");
      } else {
        setTargetPos(idlePos());
        setMode("idle");
      }
    },1800);
    return ()=>clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(()=>{ if(onAuthPage) setMode("hidden"); }, [location.pathname, onAuthPage]);

  /* Speak tour step when it becomes active */
  useEffect(()=>{
    if (mode !== "touring") return;
    const target = STEPS[step].path;
    if (location.pathname !== target) navigate(target);
    window.scrollTo({top:0, behavior:"smooth"});
    // speak after short delay so voices list is loaded
    const voiced = STEPS[step].message;
    const t = setTimeout(()=>{
      setTalking(true);
      speak(voiced, isMuted);
      // approximate duration: ~70ms per character with ~1.07 rate
      const dur = Math.max(1500, voiced.length * 65);
      setTimeout(()=>setTalking(false), dur);
    }, 400);
    return ()=>{ clearTimeout(t); window.speechSynthesis?.cancel(); setTalking(false); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[step, mode]);

  /* Blink every 4 s */
  useEffect(()=>{
    const t = setInterval(()=>{ setBlink(true); setTimeout(()=>setBlink(false),180); },4000);
    return ()=>clearInterval(t);
  },[]);

  /* Keep idle Maya in corner on resize */
  useEffect(()=>{
    const f=()=>{ if(mode==="idle"||mode==="menu-open"||mode==="chat-open") setTargetPos(idlePos()); };
    window.addEventListener("resize",f);
    return ()=>window.removeEventListener("resize",f);
  },[mode, idlePos]);

  const goToStep = useCallback((next: number)=>{
    if (flyingRef.current) return;
    flyingRef.current = true;
    window.speechSynthesis?.cancel(); setTalking(false);
    const np = resolvePos(STEPS[next]);
    setFlipX(np.x < targetPos.x);
    setMode("flying");
    const needsNav = STEPS[next].path !== location.pathname;
    if (needsNav) { navigate(STEPS[next].path); window.scrollTo({top:0,behavior:"smooth"}); }
    setTargetPos(np);
    setTimeout(()=>{ setStep(next); setFlipX(false); setMode("touring"); flyingRef.current=false; }, needsNav?700:500);
  },[targetPos, location.pathname, navigate, resolvePos]);

  const completeTour = useCallback(()=>{
    window.speechSynthesis?.cancel(); setTalking(false);
    localStorage.setItem(MAYA_TOUR_KEY,"true");
    setTargetPos(idlePos());
    setTimeout(()=>setMode("idle"),500);
  },[idlePos]);

  const restartTour = useCallback(()=>{
    localStorage.removeItem(MAYA_TOUR_KEY);
    setStep(0); setMode("flying");
    setTargetPos(resolvePos(STEPS[0]));
    navigate("/"); window.scrollTo({top:0,behavior:"smooth"});
    setTimeout(()=>{ setMode("touring"); flyingRef.current=false; },700);
  },[navigate,resolvePos]);

  const handleAvatarClick = ()=>{
    if (mode==="idle")        setMode("menu-open");
    else if(mode==="menu-open") setMode("idle");
    else if(mode==="chat-open") setMode("idle");
  };

  if (mode==="hidden") return null;

  const cur         = STEPS[step];
  const spriteColor = (mode==="idle"||mode==="menu-open"||mode==="chat-open") ? "#06b6d4" : cur.color;
  const isTourActive = mode==="touring" || mode==="flying";
  const bubbleSide: "left"|"right" =
    mode==="touring" ? (targetPos.x > window.innerWidth*0.58 ? "left":"right") : "right";

  return (
    <AnimatePresence>
      <motion.div key="maya-root"
        style={{ position:"fixed", zIndex:9998, top:0, left:0, width:0, height:0, pointerEvents:"none" }}
      >
        <motion.div
          animate={{ x: targetPos.x - 32, y: targetPos.y - 44 }}
          transition={
            mode==="flying"
              ? { type:"spring", damping:16, stiffness:48, mass:1.3 }
              : { type:"spring", damping:24, stiffness:130 }
          }
          style={{ position:"absolute", pointerEvents:"auto" }}
        >
          {/* Tour speech bubble */}
          <AnimatePresence mode="wait">
            {mode==="touring" && (
              <div style={{ position:"relative" }}>
                <SpeechBubble
                  step={cur} stepIndex={step} total={STEPS.length}
                  onNext={()=>step<STEPS.length-1 ? goToStep(step+1) : completeTour()}
                  onPrev={()=>step>0 && goToStep(step-1)}
                  onSkip={completeTour}
                  isLast={step===STEPS.length-1} isFirst={step===0}
                  side={bubbleSide}
                  isMuted={isMuted} onToggleMute={toggleMute}
                />
              </div>
            )}
          </AnimatePresence>

          {/* Flying whoosh trail */}
          <AnimatePresence>
            {mode==="flying" && (
              <motion.div
                initial={{ opacity:0.7 }} animate={{ opacity:0 }} exit={{ opacity:0 }}
                transition={{ duration:0.6 }}
                style={{ position:"absolute", left:flipX?18:-120, top:20, width:120, height:24, borderRadius:20,
                  background:`linear-gradient(${flipX?"90deg":"270deg"},${spriteColor}66 0%,transparent 100%)`,
                  pointerEvents:"none" }}
              />
            )}
          </AnimatePresence>

          {/* Idle mini-chat panel */}
          <AnimatePresence>
            {mode==="chat-open" && (
              <MiniChat
                color={spriteColor}
                isMuted={isMuted}
                onToggleMute={toggleMute}
                onClose={()=>setMode("idle")}
              />
            )}
          </AnimatePresence>

          {/* Idle menu */}
          <AnimatePresence>
            {mode==="menu-open" && (
              <IdleMenu
                onRestart={restartTour}
                onChat={()=>setMode("chat-open")}
                onClose={()=>setMode("idle")}
                isMuted={isMuted}
                onToggleMute={toggleMute}
              />
            )}
          </AnimatePresence>

          {/* Hovering sprite */}
          <motion.div
            animate={{ y:[0,-8,0] }}
            transition={{ duration:3, repeat:Infinity, ease:"easeInOut" }}
            style={{ position:"relative" }}
            onClick={handleAvatarClick}
          >
            {/* Ground shadow */}
            <motion.div
              animate={{ scaleX:[1,1.35,1], opacity:[0.4,0.12,0.4] }}
              transition={{ duration:3, repeat:Infinity, ease:"easeInOut" }}
              style={{ position:"absolute",bottom:-4,left:"50%",transform:"translateX(-50%)",width:36,height:8,borderRadius:"50%",background:spriteColor,filter:"blur(8px)",opacity:0.35 }}
            />

            {/* Tour signal rings */}
            {isTourActive && (
              <div style={{ position:"absolute",inset:0,pointerEvents:"none" }}>
                <SignalRings color={spriteColor} />
              </div>
            )}

            {/* Idle pulse rings */}
            {(mode==="idle"||mode==="menu-open"||mode==="chat-open") && [0,1].map(i=>(
              <motion.div key={i}
                style={{ position:"absolute",inset:-6-i*10,borderRadius:"50%",border:`2px solid ${spriteColor}`,opacity:0 }}
                animate={{ opacity:[0,0.4,0], scale:[0.9,1.4,1.6] }}
                transition={{ duration:2.5, repeat:Infinity, delay:i*0.9, ease:"easeOut" }}
              />
            ))}

            <BotSprite size={64} color={spriteColor} flipX={flipX} blinking={blink} talking={talking} />

            {/* Mute indicator badge */}
            {isMuted && !isTourActive && (
              <div style={{ position:"absolute",top:-8,right:-8,width:18,height:18,borderRadius:"50%",background:"#ef4444",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px #ef444488" }}>
                <VolumeX size={10} color="#fff"/>
              </div>
            )}

            {/* Skip pill during tour */}
            <AnimatePresence>
              {isTourActive && (
                <motion.button
                  initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:8 }}
                  onClick={completeTour}
                  style={{ position:"absolute",top:-32,left:"50%",transform:"translateX(-50%)",background:"rgba(8,12,26,0.92)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,padding:"4px 10px",fontSize:10,color:"#94a3b8",cursor:"pointer",whiteSpace:"nowrap",backdropFilter:"blur(8px)",userSelect:"none" }}
                >
                  Skip tour ✕
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MayaCompanion;
