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
  ShoppingBag,
  Gem,
  Shield,
  Package,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useTokens } from "../../context/TokenContext";
import { paymentAPI, shopAPI } from "../../utils/api";
import { useToast } from "../../components/Toast";

type FilterType = "all" | "earned" | "spent";

type Plan = {
  key: string;
  label: string;
  priceINR: number;
  tokens: number;
};

interface ShopItem {
  _id: string;
  title: string;
  description: string;
  type: "flashcard_pack" | "quiz_unlock" | "power_up" | "boost" | "cosmetic";
  price: number;
  icon: string;
  subject?: string;
  grade?: string;
  stock: number;
  isActive: boolean;
}

interface UserPurchase {
  _id: string;
  itemId: ShopItem;
  tokensSpent: number;
  createdAt: string;
  used: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  flashcard_pack: "Flashcard Pack",
  quiz_unlock: "Quiz Unlock",
  power_up: "Power-Up",
  boost: "Boost",
  cosmetic: "Cosmetic",
};

const TYPE_COLORS: Record<string, string> = {
  flashcard_pack: "bg-blue-100 text-blue-700 border-blue-300",
  quiz_unlock: "bg-purple-100 text-purple-700 border-purple-300",
  power_up: "bg-orange-100 text-orange-700 border-orange-300",
  boost: "bg-green-100 text-green-700 border-green-300",
  cosmetic: "bg-pink-100 text-pink-700 border-pink-300",
};

const SHOP_CATEGORIES = ["all", "flashcard_pack", "quiz_unlock", "power_up", "boost", "cosmetic"] as const;

const earnWays = [
  { icon: <BookOpen className="h-5 w-5" />, label: "Complete a quiz", tokens: 10, color: "bg-blue-100 text-blue-700 border-blue-300" },
  { icon: <Gamepad2 className="h-5 w-5" />, label: "Win a game", tokens: 15, color: "bg-purple-100 text-purple-700 border-purple-300" },
  { icon: <Star className="h-5 w-5" />, label: "Perfect quiz score", tokens: 25, color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  { icon: <Trophy className="h-5 w-5" />, label: "Daily login streak", tokens: 5, color: "bg-orange-100 text-orange-700 border-orange-300" },
  { icon: <Target className="h-5 w-5" />, label: "Study flashcards", tokens: 5, color: "bg-green-100 text-green-700 border-green-300" },
  { icon: <Users className="h-5 w-5" />, label: "Join community", tokens: 20, color: "bg-pink-100 text-pink-700 border-pink-300" },
];

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function WalletPage() {
  const { balance, transactions, claimDailyReward, canClaimDaily, fetchBalance } = useTokens();
  const { showToast } = useToast();

  // Wallet state
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

  // Shop state
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [purchases, setPurchases] = useState<UserPurchase[]>([]);
  const [shopLoading, setShopLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);
  const [shopCategory, setShopCategory] = useState<(typeof SHOP_CATEGORIES)[number]>("all");

  // Tab state
  const [activeTab, setActiveTab] = useState<"wallet" | "shop" | "my-items">("wallet");

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const res = await paymentAPI.getPlans();
        setPlans(res.data?.data || []);
      } catch {
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

  const loadShopItems = async () => {
    try {
      setShopLoading(true);
      const params: Record<string, string> = {};
      if (shopCategory !== "all") params.type = shopCategory;
      const res = await shopAPI.getItems(params);
      setShopItems(res.data?.data ?? res.data ?? []);
    } catch {
      // empty
    } finally {
      setShopLoading(false);
    }
  };

  const loadPurchases = async () => {
    if (!isLoggedIn) return;
    try {
      const res = await shopAPI.getMyPurchases();
      setPurchases(res.data?.data ?? res.data ?? []);
    } catch {
      // silent
    }
  };

  useEffect(() => { loadShopItems(); }, [shopCategory]);
  useEffect(() => { loadPurchases(); }, []);

  const ownedIds = new Set(purchases.map(p => (p.itemId as any)?._id ?? p.itemId));

  const handleBuyTokens = useCallback(async (plan: Plan) => {
    setBuyingPlan(plan.key);
    setBuying(true);
    try {
      const orderRes = await paymentAPI.createOrder(plan.key);
      const { orderId, amount, currency, keyId } = orderRes.data.data;
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
        document.body.appendChild(script);
      });
      const options = {
        key: keyId, amount, currency, name: "LearnKins",
        description: `${plan.label} — ${plan.tokens.toLocaleString()} tokens`,
        image: "/favicon.ico", order_id: orderId,
        handler: async (response: any) => {
          try {
            const verifyRes = await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (verifyRes.data.success) {
              fetchBalance();
              showToast(`Payment successful! ${plan.tokens.toLocaleString()} tokens added.`, "success");
            }
          } catch {
            showToast("Payment verification failed. Contact support.", "error");
          }
        },
        modal: { ondismiss: () => setBuying(false) },
        prefill: { contact: "" },
        theme: { color: "#4f7cff" },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp: any) => {
        showToast(`Payment failed: ${resp.error.description || "Try again."}`, "error");
        setBuying(false);
      });
      rzp.open();
    } catch (err: any) {
      showToast(err?.message || "Failed to initiate payment.", "error");
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

  const handleShopPurchase = async (item: ShopItem) => {
    if (!isLoggedIn) { showToast("Please log in to make a purchase.", "error"); return; }
    if (balance < item.price) { showToast("Not enough 💎 Diamonds. Earn more by playing games or taking quizzes!", "error"); return; }
    if (ownedIds.has(item._id)) { showToast("You already own this item.", "error"); return; }
    setPurchaseLoading(item._id);
    try {
      await shopAPI.purchase(item._id);
      showToast(`🎉 Purchased "${item.title}" for ${item.price} 💎`, "success");
      await Promise.all([fetchBalance(), loadPurchases()]);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Purchase failed. Try again.";
      showToast(msg, "error");
    } finally {
      setPurchaseLoading(null);
    }
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

  const filteredShopItems = shopCategory === "all" ? shopItems : shopItems.filter(i => i.type === shopCategory);

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* Hero Header */}
      <div className="relative border-b-2 border-black overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-purple-100 border-2 border-black rounded-full text-sm font-black uppercase tracking-widest mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Gem className="h-4 w-4 text-purple-600" />
              <span>My Wallet & Store</span>
            </div>
            <div className="text-6xl font-black tracking-tight mb-1">
              {balance.toLocaleString()}
            </div>
            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">💎 Diamonds</span>
          </motion.div>

          <div className="flex justify-center gap-4 mt-6">
            <div className="rounded-xl border-2 border-black bg-white px-5 py-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-1.5 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-bold">Earned</span>
              </div>
              <div className="text-lg font-black text-black">+{totalEarned.toLocaleString()}</div>
            </div>
            <div className="rounded-xl border-2 border-black bg-white px-5 py-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-1.5 text-red-500">
                <TrendingDown className="h-4 w-4" />
                <span className="text-xs font-bold">Spent</span>
              </div>
              <div className="text-lg font-black text-black">-{totalSpent.toLocaleString()}</div>
            </div>
            <div className="rounded-xl border-2 border-black bg-white px-5 py-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-1.5 text-blue-500">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-bold">Transactions</span>
              </div>
              <div className="text-lg font-black text-black">{transactions.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Tab Switcher */}
        <div className="flex gap-2 justify-center mb-8">
          {([
            { id: "wallet" as const, label: "💰 Wallet", icon: Wallet },
            { id: "shop" as const, label: "🛒 Shop", icon: ShoppingBag },
            { id: "my-items" as const, label: "🎒 My Items", icon: Package },
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm border-2 border-black transition-all ${
                activeTab === tab.id
                  ? "bg-black text-white shadow-[3px_3px_0px_0px_rgba(79,124,255,1)]"
                  : "bg-white text-black hover:bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ═══ WALLET TAB ═══ */}
        {activeTab === "wallet" && (
          <div className="space-y-5">
            {/* Daily Reward */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border-2 border-black p-5 flex items-center justify-between gap-4 ${
                canClaimDaily ? "bg-yellow-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl border-2 border-black ${canClaimDaily ? "bg-yellow-100" : "bg-gray-100"}`}>
                  🎁
                </div>
                <div>
                  <div className="font-black text-black">Daily Login Reward</div>
                  <div className="text-sm text-gray-500 font-medium">
                    {canClaimDaily ? "Claim your +5 💎 for logging in today!" : "Already claimed today ✓"}
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={canClaimDaily ? { scale: 1.05 } : {}}
                whileTap={canClaimDaily ? { scale: 0.97 } : {}}
                onClick={handleClaim}
                disabled={!canClaimDaily || claiming}
                className={`shrink-0 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold border-2 border-black transition-all ${
                  canClaimDaily
                    ? "bg-yellow-400 text-black hover:bg-yellow-300 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
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

            {/* Buy Tokens */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
            >
              <button
                onClick={() => setShowBuyCard(!showBuyCard)}
                className="flex w-full items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 border-black ${showBuyCard ? "bg-blue-100" : "bg-gray-100"}`}>
                    <CreditCard className={`h-6 w-6 ${showBuyCard ? "text-blue-600" : "text-gray-500"}`} />
                  </div>
                  <div className="text-left">
                    <div className="font-black text-black">Buy Diamonds</div>
                    <div className="text-sm text-gray-500 font-medium">
                      {showBuyCard ? "Choose a pack to purchase" : "Get more 💎 with real money via Razorpay"}
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
                    <div className="border-t-2 border-black px-5 py-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {plans.map((plan) => {
                          const bonus = Math.round((plan.tokens / plan.priceINR) * 100) / 100;
                          const isPopular = plan.key === "popular";
                          return (
                            <div
                              key={plan.key}
                              className={`relative rounded-xl border-2 border-black p-4 flex flex-col items-center text-center transition-all ${
                                isPopular
                                  ? "bg-purple-50 shadow-[3px_3px_0px_0px_rgba(168,85,247,0.4)]"
                                  : "bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                              }`}
                            >
                              {isPopular && (
                                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-wider">
                                  Best Value
                                </div>
                              )}
                              <div className="text-3xl mb-1">
                                {plan.key === "starter" ? "🌱" : plan.key === "popular" ? "🔥" : plan.key === "pro" ? "🚀" : plan.key === "elite" ? "👑" : "💎"}
                              </div>
                              <div className="text-sm font-black text-black mt-1">{plan.label}</div>
                              <div className="text-2xl font-black text-purple-600 mt-1">
                                {plan.tokens.toLocaleString()}
                                <span className="text-sm text-gray-400 ml-1">💎</span>
                              </div>
                              <div className="text-[11px] text-gray-500 mt-0.5 font-bold">
                                {bonus.toFixed(1)} 💎/₹
                              </div>
                              <button
                                onClick={() => handleBuyTokens(plan)}
                                disabled={buying && buyingPlan === plan.key}
                                className={`mt-3 w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold border-2 border-black transition-all ${
                                  isPopular
                                    ? "bg-purple-500 text-white hover:bg-purple-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                    : "bg-white text-black hover:bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
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
                        className="mt-3 text-xs text-gray-500 hover:text-black transition-colors flex items-center gap-1 font-bold"
                      >
                        <Clock className="h-3 w-3" /> {showPaymentHistory ? "Hide" : "View"} payment history
                      </button>

                      {showPaymentHistory && (
                        <div className="mt-3 rounded-xl border-2 border-black divide-y divide-gray-200">
                          {paymentHistory.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4 font-bold">No purchases yet</p>
                          ) : (
                            paymentHistory.map((p: any) => (
                              <div key={p._id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                                <div className="flex items-center gap-2">
                                  <BadgeCheck className={`h-4 w-4 ${p.status === 'paid' ? 'text-green-500' : 'text-gray-400'}`} />
                                  <span className="capitalize text-black font-bold">{p.plan} pack</span>
                                </div>
                                <div className="text-right">
                                  <span className="font-black text-purple-600">+{p.tokenAmount}</span>
                                  <span className="text-gray-400 ml-2 font-bold">₹{(p.amount / 100).toFixed(0)}</span>
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

            {/* How to Earn */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
            >
              <button
                onClick={() => setShowGuide(!showGuide)}
                className="flex w-full items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-100 border-2 border-black">
                    <Gift className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-black text-black">How to Earn Free 💎</div>
                    <div className="text-xs text-gray-500 font-bold">Complete activities to earn more</div>
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
                    <div className="border-t-2 border-black px-5 py-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {earnWays.map((w, i) => (
                        <div key={i} className={`flex items-center gap-3 rounded-xl p-3 border-2 ${w.color}`}>
                          <div>{w.icon}</div>
                          <div>
                            <div className="text-xs font-bold">{w.label}</div>
                            <div className="text-xs font-black">+{w.tokens} 💎</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Transaction History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b-2 border-black">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 border-2 border-black">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="font-black text-black">Transaction History</span>
                </div>
                <div className="flex gap-1 bg-gray-100 border-2 border-black rounded-lg p-1">
                  {(["all", "earned", "spent"] as FilterType[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1 rounded-md text-xs font-bold capitalize transition-all border-2 ${
                        filter === f
                          ? "bg-black text-white border-black"
                          : "bg-white text-black border-transparent hover:border-gray-300"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                    <CheckCircle className="h-10 w-10 mb-3 opacity-30" />
                    <p className="text-sm font-bold">No transactions yet</p>
                    <p className="text-xs mt-1 font-medium">Complete activities to earn your first 💎!</p>
                  </div>
                ) : (
                  filtered.map((t, i) => (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-xl border-2 ${
                          t.amount > 0 ? "bg-green-100 border-green-300" : "bg-red-100 border-red-300"
                        }`}>
                          {t.amount > 0 ? (
                            <ArrowUpRight className="h-4 w-4 text-green-600" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-black capitalize">{t.reason}</div>
                          <div className="text-xs text-gray-400 font-medium">{formatDate(t.date)}</div>
                        </div>
                      </div>
                      <div className={`text-sm font-black ${t.amount > 0 ? "text-green-600" : "text-red-500"}`}>
                        {t.amount > 0 ? `+${t.amount}` : t.amount}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* ═══ SHOP TAB ═══ */}
        {activeTab === "shop" && (
          <div className="space-y-6">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {SHOP_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setShopCategory(cat)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold border-2 border-black transition-all capitalize ${
                    shopCategory === cat
                      ? "bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      : "bg-white text-black hover:bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  }`}
                >
                  {cat === "all" ? "All Items" : TYPE_LABELS[cat]}
                </button>
              ))}
            </div>

            {/* Items Grid */}
            {shopLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border-2 border-black p-5 animate-pulse shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl mb-3 border border-gray-300" />
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-full mb-1" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : filteredShopItems.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-2xl border-2 border-black bg-gray-100 flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Package size={36} className="text-gray-400" />
                </div>
                <p className="font-black text-xl text-black">No items found</p>
                <p className="text-sm text-gray-500 mt-1 font-bold">Check back later for new items!</p>
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence>
                  {filteredShopItems.map(item => {
                    const owned = ownedIds.has(item._id);
                    const busy = purchaseLoading === item._id;
                    const canAfford = balance >= item.price;
                    return (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`relative bg-white rounded-2xl border-2 border-black overflow-hidden transition-all flex flex-col shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                          owned ? "border-green-400" : ""
                        }`}
                      >
                        {owned && (
                          <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 border border-green-600">
                            <CheckCircle size={10} /> Owned
                          </div>
                        )}
                        <div className="p-5 flex-1">
                          <div className="text-4xl mb-3">{item.icon}</div>
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${TYPE_COLORS[item.type] ?? "bg-gray-100 text-gray-600 border-gray-300"}`}>
                            {TYPE_LABELS[item.type] ?? item.type}
                          </span>
                          <h3 className="font-black text-black mt-2 text-base leading-snug">{item.title}</h3>
                          <p className="text-gray-500 text-xs mt-1 leading-relaxed font-medium">{item.description}</p>
                          {item.subject && (
                            <p className="text-blue-500 text-xs mt-2 flex items-center gap-1 font-bold">
                              <BookOpen size={11} /> {item.subject}
                            </p>
                          )}
                        </div>
                        <div className="px-5 pb-5 pt-2 border-t-2 border-black flex items-center justify-between">
                          <div className="flex items-center gap-1 font-black text-purple-600 text-lg">
                            <Gem size={16} className="text-purple-400" />
                            {item.price}
                          </div>
                          {owned ? (
                            <span className="text-xs font-black text-green-600 flex items-center gap-1">
                              <CheckCircle size={13} /> In Library
                            </span>
                          ) : (
                            <button
                              onClick={() => handleShopPurchase(item)}
                              disabled={busy || !canAfford}
                              className={`px-4 py-1.5 rounded-xl text-xs font-black border-2 border-black transition-all ${
                                busy
                                  ? "bg-gray-200 text-gray-500 cursor-wait"
                                  : canAfford
                                  ? "bg-black text-white hover:bg-gray-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                              }`}
                            >
                              {busy ? "Buying…" : canAfford ? "Buy Now" : "Need more 💎"}
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}

            {/* How to Earn */}
            <div className="bg-black text-white rounded-2xl border-2 border-black p-8 shadow-[6px_6px_0px_0px_rgba(79,124,255,0.4)]">
              <h2 className="text-xl font-black mb-4 flex items-center gap-2 uppercase tracking-tight"><Zap size={20} className="text-blue-400" /> How to Earn More 💎</h2>
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <div className="text-2xl mb-1">🎮</div>
                  <p className="font-black">Play Games</p>
                  <p className="text-gray-300 text-xs mt-1 font-medium">Earn up to 25 💎 per game based on your score</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <div className="text-2xl mb-1">📝</div>
                  <p className="font-black">Take Quizzes</p>
                  <p className="text-gray-300 text-xs mt-1 font-medium">Score 100% to earn 25 💎. Every quiz rewards you!</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <div className="text-2xl mb-1">🔥</div>
                  <p className="font-black">Daily Login</p>
                  <p className="text-gray-300 text-xs mt-1 font-medium">Claim 5 💎 every day and build your streak bonus</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ MY ITEMS TAB ═══ */}
        {activeTab === "my-items" && (
          <div>
            {!isLoggedIn ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-2xl border-2 border-black bg-gray-100 flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Shield size={36} className="text-gray-400" />
                </div>
                <p className="font-black text-xl text-black">Log in to see your items</p>
              </div>
            ) : purchases.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-2xl border-2 border-black bg-gray-100 flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <ShoppingBag size={36} className="text-gray-400" />
                </div>
                <p className="font-black text-xl text-black">No purchases yet</p>
                <p className="text-sm text-gray-500 mt-1 font-bold">Head to the Shop to spend your 💎!</p>
                <button
                  onClick={() => setActiveTab("shop")}
                  className="mt-4 px-6 py-2.5 bg-black text-white rounded-xl font-bold text-sm border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  Browse Shop
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {purchases.map(p => {
                  const item = p.itemId as ShopItem;
                  return (
                    <motion.div
                      key={p._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 flex gap-4 items-start"
                    >
                      <div className="text-3xl">{item?.icon ?? "🎁"}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-black truncate">{item?.title ?? "Item"}</p>
                        <p className="text-gray-500 text-xs mt-0.5 line-clamp-2 font-medium">{item?.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-purple-600 font-black flex items-center gap-1">
                            <Gem size={11} /> {p.tokensSpent} spent
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1 font-bold">
                            <Clock size={11} /> {new Date(p.createdAt).toLocaleDateString()}
                          </span>
                          {p.used ? (
                            <span className="text-xs text-gray-400 flex items-center gap-1 font-bold">
                              <CheckCircle size={11} /> Used
                            </span>
                          ) : (
                            <span className="text-xs text-green-600 flex items-center gap-1 font-black">
                              <Star size={11} /> Active
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
