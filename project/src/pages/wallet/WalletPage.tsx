import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Gift,
  Star,
  BookOpen,
  Gamepad2,
  Trophy,
  Zap,
  Clock,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Target,
  Users,
  Sparkles,
  Loader2,
  IndianRupee,
  BadgeCheck,
  CreditCard,
} from "lucide-react";
import { useTokens } from "../../context/TokenContext";
import { paymentAPI } from "../../utils/api";

type FilterType = "all" | "earned" | "spent";

type Plan = {
  key: string;
  label: string;
  priceINR: number;
  tokens: number;
};

const earnWays = [
  { icon: <BookOpen className="h-5 w-5" />, label: "Complete a quiz", tokens: 10, color: "text-blue-400 bg-blue-900/30" },
  { icon: <Gamepad2 className="h-5 w-5" />, label: "Win a game", tokens: 15, color: "text-purple-400 bg-purple-900/30" },
  { icon: <Star className="h-5 w-5" />, label: "Perfect quiz score", tokens: 25, color: "text-yellow-400 bg-yellow-900/30" },
  { icon: <Trophy className="h-5 w-5" />, label: "Daily login streak", tokens: 5, color: "text-orange-400 bg-orange-900/30" },
  { icon: <Target className="h-5 w-5" />, label: "Study flashcards", tokens: 5, color: "text-green-400 bg-green-900/30" },
  { icon: <Users className="h-5 w-5" />, label: "Join community", tokens: 20, color: "text-pink-400 bg-pink-900/30" },
];

declare global {
  interface Window {
    Razorpay: any;
  }
}

const WalletPage: React.FC = () => {
  const { balance, transactions, claimDailyReward, canClaimDaily, fetchBalance } = useTokens();
  const [filter, setFilter] = useState<FilterType>("all");
  const [showGuide, setShowGuide] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [justClaimed, setJustClaimed] = useState(false);

  // Buy tokens state
  const [plans, setPlans] = useState<Plan[]>([]);
  const [buyingPlan, setBuyingPlan] = useState<string | null>(null);
  const [buying, setBuying] = useState(false);
  const [showBuyCard, setShowBuyCard] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const res = await paymentAPI.getPlans();
        setPlans(res.data?.data || []);
      } catch {
        // fallback plans
        setPlans([
          { key: "starter", label: "Starter Pack", priceINR: 49, tokens: 500 },
          { key: "popular", label: "Popular Pack", priceINR: 99, tokens: 1200 },
          { key: "pro", label: "Pro Pack", priceINR: 199, tokens: 3000 },
          { key: "elite", label: "Elite Pack", priceINR: 499, tokens: 8000 },
          { key: "ultimate", label: "Ultimate Pack", priceINR: 999, tokens: 20000 },
        ]);
      }
    };
    loadPlans();
  }, []);

  const handleBuyTokens = useCallback(async (plan: Plan) => {
    setBuyingPlan(plan.key);
    setBuying(true);
    try {
      // 1. Create Razorpay order on our backend
      const orderRes = await paymentAPI.createOrder(plan.key);
      const { orderId, amount, currency, keyId } = orderRes.data.data;

      // 2. Load Razorpay checkout script
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
        document.body.appendChild(script);
      });

      // 3. Open Razorpay checkout
      const options = {
        key: keyId,
        amount,
        currency,
        name: "LearnKins",
        description: `${plan.label} — ${plan.tokens.toLocaleString()} tokens`,
        image: "/favicon.ico",
        order_id: orderId,
        handler: async (response: any) => {
          // 4. Verify payment on backend
          try {
            const verifyRes = await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (verifyRes.data.success) {
              fetchBalance();
              alert(`✅ Payment successful! ${plan.tokens.toLocaleString()} tokens added to your wallet.`);
            }
          } catch {
            alert("Payment verification failed. Please contact support if tokens were not credited.");
          }
        },
        modal: {
          ondismiss: () => setBuying(false),
        },
        prefill: {
          contact: "",
        },
        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp: any) => {
        alert(`Payment failed: ${resp.error.description || "Please try again."}`);
        setBuying(false);
      });
      rzp.open();
    } catch (err: any) {
      alert(err?.message || "Failed to initiate payment. Please try again.");
      setBuying(false);
    }
  }, [fetchBalance]);

  const loadPaymentHistory = async () => {
    try {
      const res = await paymentAPI.getHistory();
      setPaymentHistory(res.data?.data || []);
    } catch {
      setPaymentHistory([]);
    }
  };

  const handleClaim = async () => {
    if (!canClaimDaily || claiming) return;
    setClaiming(true);
    await claimDailyReward();
    setClaiming(false);
    setJustClaimed(true);
    setTimeout(() => setJustClaimed(false), 3000);
  };

  const filtered = transactions.filter((t) => {
    if (filter === "earned") return t.amount > 0;
    if (filter === "spent") return t.amount < 0;
    return true;
  });

  const totalEarned = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalSpent = transactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-16">
      {/* Hero balance card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 pb-24 pt-10">
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 right-0 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-2 flex items-center justify-center gap-2"
          >
            <Wallet className="h-6 w-6 text-purple-300" />
            <span className="text-lg font-medium text-purple-200">My Wallet</span>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative inline-block"
          >
            <div className="text-7xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                {balance.toLocaleString()}
              </span>
            </div>
            <span className="mt-1 block text-sm font-medium text-purple-300 tracking-widest uppercase">LearnKins Tokens</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex justify-center gap-6"
          >
            <div className="rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-green-300">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-medium">Total Earned</span>
              </div>
              <div className="mt-0.5 text-xl font-bold text-white">+{totalEarned.toLocaleString()}</div>
            </div>
            <div className="rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-red-300">
                <TrendingDown className="h-4 w-4" />
                <span className="text-xs font-medium">Total Spent</span>
              </div>
              <div className="mt-0.5 text-xl font-bold text-white">-{totalSpent.toLocaleString()}</div>
            </div>
            <div className="rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-yellow-300">
                <Zap className="h-4 w-4" />
                <span className="text-xs font-medium">Transactions</span>
              </div>
              <div className="mt-0.5 text-xl font-bold text-white">{transactions.length}</div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl -mt-10 px-4 space-y-6">

        {/* Buy Tokens card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className={`relative overflow-hidden rounded-2xl border p-5 ${
            showBuyCard ? "border-indigo-500/40 bg-gradient-to-r from-indigo-900/40 to-purple-900/40" : "border-gray-700 bg-gray-900"
          }`}
        >
          {showBuyCard && (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5" />
          )}
          <button
            onClick={() => setShowBuyCard(!showBuyCard)}
            className="flex w-full items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${showBuyCard ? "bg-indigo-500/20" : "bg-gray-800"}`}>
                <CreditCard className={`h-6 w-6 ${showBuyCard ? "text-indigo-400" : "text-gray-500"}`} />
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">Buy Tokens</div>
                <div className="text-sm text-gray-400">
                  {showBuyCard ? "Choose a pack to purchase" : "Get more tokens with real money via Razorpay"}
                </div>
              </div>
            </div>
            <motion.div animate={{ rotate: showBuyCard ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <Filter className="h-4 w-4 text-gray-400" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showBuyCard && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="border-t border-gray-800 mt-4 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {plans.map((plan) => {
                      const bonus = Math.round((plan.tokens / plan.priceINR) * 100) / 100;
                      const isPopular = plan.key === "popular";
                      return (
                        <div
                          key={plan.key}
                          className={`relative rounded-xl border p-4 flex flex-col items-center text-center transition-all ${
                            isPopular
                              ? "border-indigo-500/50 bg-indigo-900/20"
                              : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                          }`}
                        >
                          {isPopular && (
                            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wider text-white">
                              Best Value
                            </div>
                          )}
                          <div className="text-3xl mb-1">
                            {plan.key === "starter" ? "🌱" : plan.key === "popular" ? "🔥" : plan.key === "pro" ? "🚀" : plan.key === "elite" ? "👑" : "💎"}
                          </div>
                          <div className="text-sm font-bold text-white mt-1">{plan.label}</div>
                          <div className="text-2xl font-extrabold text-yellow-400 mt-1">
                            {plan.tokens.toLocaleString()}
                            <span className="text-sm text-gray-400 ml-1">tokens</span>
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            {bonus.toFixed(1)} tokens/₹
                          </div>
                          <button
                            onClick={() => handleBuyTokens(plan)}
                            disabled={buying && buyingPlan === plan.key}
                            className={`mt-3 w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
                              isPopular
                                ? "bg-indigo-600 text-white hover:bg-indigo-500"
                                : "bg-gray-700 text-white hover:bg-gray-600"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {buying && buyingPlan === plan.key ? (
                              <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                            ) : (
                              <><IndianRupee className="h-4 w-4" /> ₹{plan.priceINR}</>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => { loadPaymentHistory(); setShowPaymentHistory(!showPaymentHistory); }}
                    className="mt-3 text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
                  >
                    <Clock className="h-3 w-3" /> {showPaymentHistory ? "Hide" : "View"} payment history
                  </button>

                  {showPaymentHistory && (
                    <div className="mt-3 rounded-xl bg-gray-800/50 border border-gray-700 divide-y divide-gray-700/50">
                      {paymentHistory.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">No purchases yet</p>
                      ) : (
                        paymentHistory.map((p: any) => (
                          <div key={p._id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                            <div className="flex items-center gap-2">
                              <BadgeCheck className={`h-4 w-4 ${p.status === 'paid' ? 'text-green-400' : 'text-gray-500'}`} />
                              <span className="capitalize text-gray-300">{p.plan} pack</span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-yellow-400">+{p.tokenAmount}</span>
                              <span className="text-gray-500 ml-2">₹{(p.amount / 100).toFixed(0)}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Daily reward card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`relative overflow-hidden rounded-2xl border p-5 flex items-center justify-between gap-4 ${
            canClaimDaily
              ? "border-yellow-500/40 bg-gradient-to-r from-yellow-900/40 to-orange-900/40"
              : "border-gray-700 bg-gray-900"
          }`}
        >
          {canClaimDaily && (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5" />
          )}
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${canClaimDaily ? "bg-yellow-500/20" : "bg-gray-800"}`}>
              🎁
            </div>
            <div>
              <div className="font-semibold text-white">Daily Login Reward</div>
              <div className="text-sm text-gray-400">
                {canClaimDaily ? "Claim your +5 tokens for logging in today!" : "You've already claimed today's reward ✓"}
              </div>
            </div>
          </div>
          <motion.button
            whileHover={canClaimDaily ? { scale: 1.05 } : {}}
            whileTap={canClaimDaily ? { scale: 0.97 } : {}}
            onClick={handleClaim}
            disabled={!canClaimDaily || claiming}
            className={`shrink-0 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
              canClaimDaily
                ? "bg-yellow-500 text-black hover:bg-yellow-400"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
          >
            {justClaimed ? (
              <><CheckCircle className="h-4 w-4" /> Claimed!</>
            ) : claiming ? (
              <><Sparkles className="h-4 w-4 animate-spin" /> Claiming...</>
            ) : (
              <><Gift className="h-4 w-4" /> {canClaimDaily ? "Claim +5" : "Claimed"}</>
            )}
          </motion.button>
        </motion.div>

        {/* How to earn card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-gray-900 border border-gray-800 overflow-hidden"
        >
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="flex w-full items-center justify-between px-5 py-4 hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-500/20">
                <Gift className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">How to Earn Free Tokens</div>
                <div className="text-xs text-gray-400">Complete activities to earn more 💎</div>
              </div>
            </div>
            <motion.div animate={{ rotate: showGuide ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <Filter className="h-4 w-4 text-gray-400" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showGuide && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="border-t border-gray-800 px-5 py-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {earnWays.map((w, i) => (
                    <div key={i} className={`flex items-center gap-3 rounded-xl p-3 ${w.color.split(" ")[1]}`}>
                      <div className={w.color.split(" ")[0]}>{w.icon}</div>
                      <div>
                        <div className="text-xs font-medium text-white">{w.label}</div>
                        <div className="text-xs text-yellow-400 font-bold">+{w.tokens} tokens</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Transaction history */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-gray-900 border border-gray-800"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20">
                <Clock className="h-5 w-5 text-indigo-400" />
              </div>
              <span className="font-semibold text-white">Transaction History</span>
            </div>
            <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
              {(["all", "earned", "spent"] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${
                    filter === f
                      ? "bg-indigo-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-gray-800/50">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <CheckCircle className="h-10 w-10 mb-3 opacity-30" />
                <p className="text-sm">No transactions yet</p>
                <p className="text-xs mt-1">Complete activities to earn your first tokens!</p>
              </div>
            ) : (
              filtered.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                        t.amount > 0 ? "bg-green-900/40" : "bg-red-900/40"
                      }`}
                    >
                      {t.amount > 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-green-400" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white capitalize">{t.reason}</div>
                      <div className="text-xs text-gray-500">{formatDate(t.date)}</div>
                    </div>
                  </div>
                  <div
                    className={`text-sm font-bold ${
                      t.amount > 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {t.amount > 0 ? `+${t.amount}` : t.amount}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WalletPage;
