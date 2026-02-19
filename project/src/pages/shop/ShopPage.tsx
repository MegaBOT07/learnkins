import { useEffect, useState } from "react";
import { shopAPI } from "../../utils/api";
import { useTokens } from "../../context/TokenContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Gem, CheckCircle, Zap, Star, BookOpen,
  Shield, Package, Clock, RefreshCw, AlertCircle
} from "lucide-react";

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
  flashcard_pack: "bg-blue-100 text-blue-700",
  quiz_unlock: "bg-purple-100 text-purple-700",
  power_up: "bg-orange-100 text-orange-700",
  boost: "bg-green-100 text-green-700",
  cosmetic: "bg-pink-100 text-pink-700",
};

const CATEGORIES = ["all", "flashcard_pack", "quiz_unlock", "power_up", "boost", "cosmetic"] as const;

export default function ShopPage() {
  const { balance, fetchBalance } = useTokens();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [purchases, setPurchases] = useState<UserPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("all");
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeSection, setActiveSection] = useState<"shop" | "my-items">("shop");

  const isLoggedIn = !!localStorage.getItem("token");

  const showNotif = (type: "success" | "error", text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 3500);
  };

  const loadItems = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (category !== "all") params.type = category;
      const res = await shopAPI.getItems(params);
      setItems(res.data?.data ?? res.data ?? []);
    } catch {
      // fallback to empty — UI will show empty state
    } finally {
      setLoading(false);
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

  useEffect(() => { loadItems(); }, [category]);
  useEffect(() => { loadPurchases(); }, []);

  const ownedIds = new Set(purchases.map(p => (p.itemId as any)?._id ?? p.itemId));

  const handlePurchase = async (item: ShopItem) => {
    if (!isLoggedIn) { showNotif("error", "Please log in to make a purchase."); return; }
    if (balance < item.price) { showNotif("error", "Not enough 💎 Diamonds. Earn more by playing games or taking quizzes!"); return; }
    if (ownedIds.has(item._id)) { showNotif("error", "You already own this item."); return; }
    setPurchaseLoading(item._id);
    try {
      await shopAPI.purchase(item._id);
      showNotif("success", `🎉 Purchased "${item.title}" for ${item.price} 💎`);
      await Promise.all([fetchBalance(), loadPurchases()]);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Purchase failed. Please try again.";
      showNotif("error", msg);
    } finally {
      setPurchaseLoading(null);
    }
  };

  const filteredItems = category === "all" ? items : items.filter(i => i.type === category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20 pb-12">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 rounded-xl shadow-xl font-semibold text-sm ${
              notification.type === "success"
                ? "bg-emerald-600 text-white"
                : "bg-rose-600 text-white"
            }`}
          >
            {notification.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {notification.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg mb-4">
            <ShoppingBag size={28} className="text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Diamond Store</h1>
          <p className="mt-2 text-slate-500 text-lg">Spend your 💎 Diamonds on exclusive content & power-ups</p>
        </div>

        {/* Balance Banner */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-3 bg-white border border-indigo-200 shadow-md rounded-2xl px-8 py-4">
            <Gem className="text-indigo-500" size={28} />
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Your Balance</p>
              <p className="text-3xl font-extrabold text-indigo-600">{balance.toLocaleString()} 💎</p>
            </div>
            <button
              onClick={fetchBalance}
              className="ml-4 p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
              title="Refresh balance"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Section tabs */}
        <div className="flex gap-2 justify-center mb-8">
          {(["shop", "my-items"] as const).map(s => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeSection === s
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-indigo-50"
              }`}
            >
              {s === "shop" ? "🛒 Shop" : "🎒 My Items"}
            </button>
          ))}
        </div>

        {/* ── SHOP SECTION ── */}
        {activeSection === "shop" && (
          <>
            {/* Category filters */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${
                    category === cat
                      ? "bg-indigo-600 text-white shadow"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"
                  }`}
                >
                  {cat === "all" ? "All Items" : TYPE_LABELS[cat]}
                </button>
              ))}
            </div>

            {/* Items Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
                    <div className="w-12 h-12 bg-slate-200 rounded-xl mb-3" />
                    <div className="h-4 bg-slate-200 rounded mb-2 w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-full mb-1" />
                    <div className="h-3 bg-slate-100 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <Package size={48} className="mx-auto mb-3 opacity-40" />
                <p className="font-semibold text-lg">No items found</p>
                <p className="text-sm mt-1">Check back later for new items!</p>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              >
                <AnimatePresence>
                  {filteredItems.map(item => {
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
                        whileHover={{ y: -4 }}
                        className={`relative bg-white rounded-2xl border shadow-sm overflow-hidden transition-all flex flex-col ${
                          owned ? "border-emerald-200" : "border-slate-200 hover:shadow-lg hover:border-indigo-200"
                        }`}
                      >
                        {owned && (
                          <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle size={10} /> Owned
                          </div>
                        )}
                        <div className="p-5 flex-1">
                          <div className="text-4xl mb-3">{item.icon}</div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${TYPE_COLORS[item.type] ?? "bg-slate-100 text-slate-600"}`}>
                            {TYPE_LABELS[item.type] ?? item.type}
                          </span>
                          <h3 className="font-bold text-slate-900 mt-2 text-base leading-snug">{item.title}</h3>
                          <p className="text-slate-500 text-xs mt-1 leading-relaxed">{item.description}</p>
                          {item.subject && (
                            <p className="text-indigo-400 text-xs mt-2 flex items-center gap-1">
                              <BookOpen size={11} /> {item.subject}
                            </p>
                          )}
                        </div>
                        <div className="px-5 pb-5 pt-2 border-t border-slate-50 flex items-center justify-between">
                          <div className="flex items-center gap-1 font-extrabold text-indigo-600 text-lg">
                            <Gem size={16} className="text-indigo-400" />
                            {item.price}
                          </div>
                          {owned ? (
                            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                              <CheckCircle size={13} /> In Library
                            </span>
                          ) : (
                            <button
                              onClick={() => handlePurchase(item)}
                              disabled={busy || !canAfford}
                              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                busy
                                  ? "bg-indigo-300 text-white cursor-wait"
                                  : canAfford
                                  ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md"
                                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
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

            {/* How to earn  */}
            <div className="mt-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Zap size={20}/> How to Earn More 💎</h2>
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-2xl mb-1">🎮</div>
                  <p className="font-semibold">Play Games</p>
                  <p className="text-indigo-100 text-xs mt-1">Earn up to 25 💎 per game based on your score</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-2xl mb-1">📝</div>
                  <p className="font-semibold">Take Quizzes</p>
                  <p className="text-indigo-100 text-xs mt-1">Score 100% to earn 25 💎. Every quiz rewards you!</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-2xl mb-1">🔥</div>
                  <p className="font-semibold">Daily Login</p>
                  <p className="text-indigo-100 text-xs mt-1">Claim 5 💎 every day and build your streak bonus</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── MY ITEMS SECTION ── */}
        {activeSection === "my-items" && (
          <div>
            {!isLoggedIn ? (
              <div className="text-center py-20">
                <Shield size={48} className="mx-auto mb-3 text-slate-300" />
                <p className="font-semibold text-slate-500">Log in to see your purchased items</p>
              </div>
            ) : purchases.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingBag size={48} className="mx-auto mb-3 text-slate-300" />
                <p className="font-semibold text-slate-500 text-lg">No purchases yet</p>
                <p className="text-sm text-slate-400 mt-1">Head to the Shop tab to spend your diamonds!</p>
                <button
                  onClick={() => setActiveSection("shop")}
                  className="mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-all"
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
                      className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-5 flex gap-4 items-start"
                    >
                      <div className="text-3xl">{item?.icon ?? "🎁"}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate">{item?.title ?? "Item"}</p>
                        <p className="text-slate-500 text-xs mt-0.5 line-clamp-2">{item?.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
                            <Gem size={11}/> {p.tokensSpent} spent
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock size={11}/> {new Date(p.createdAt).toLocaleDateString()}
                          </span>
                          {p.used ? (
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <CheckCircle size={11} className="text-slate-400"/> Used
                            </span>
                          ) : (
                            <span className="text-xs text-emerald-600 flex items-center gap-1">
                              <Star size={11}/> Active
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
