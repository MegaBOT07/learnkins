import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { tokenAPI } from "../utils/api";
import { storeNewAchievements } from "../utils/achievements";

type Transaction = {
  id: string;
  amount: number;
  reason: string;
  date: string;
};

type TokenContextType = {
  balance: number;
  transactions: Transaction[];
  award: (amount: number, reason?: string, meta?: any) => Promise<void>;
  redeem: (amount: number, reason?: string, meta?: any) => Promise<boolean>;
  canRedeem: (amount: number) => boolean;
  claimDailyReward: () => Promise<boolean>;
  canClaimDaily: boolean;
  fetchBalance: () => Promise<void>;
};

const TOKEN_KEY = "learnkins_tokens";
const DAILY_KEY = "learnkins_daily_claimed";

const TokenContext = createContext<TokenContextType | undefined>(undefined);

/** Helper: format a server transaction into our local Transaction shape */
const formatServerTx = (t: any): Transaction => ({
  id: t._id || t.id || String(Date.now()),
  amount: Number(t.amount) || 0,
  reason: t.reason || "",
  date: t.createdAt || new Date().toISOString(),
});

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [canClaimDaily, setCanClaimDaily] = useState<boolean>(false);

  const checkDailyEligibility = () => {
    const last = localStorage.getItem(DAILY_KEY);
    if (!last) { setCanClaimDaily(true); return; }
    const lastDate = new Date(last).toDateString();
    const today = new Date().toDateString();
    setCanClaimDaily(lastDate !== today);
  };

  // On mount: hydrate from localStorage, then sync from server
  useEffect(() => {
    checkDailyEligibility();
    const init = async () => {
      try {
        // Hydrate from localStorage first
        const raw = localStorage.getItem(TOKEN_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setBalance(Number(parsed.balance) || 0);
          setTransactions(Array.isArray(parsed.transactions) ? parsed.transactions : []);
        }

        // If user is authenticated, sync from server (authoritative source)
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const [balResp, txResp] = await Promise.all([
              tokenAPI.getBalance(),
              tokenAPI.getTransactions()
            ]);

            if (balResp?.data?.balance != null) {
              setBalance(Number(balResp.data.balance) || 0);
            }
            if (txResp?.data?.transactions) {
              setTransactions(txResp.data.transactions.map(formatServerTx));
            }
          } catch (e) {
            console.warn("Token sync failed", e);
          }
        }
      } catch (e) {
        console.error("Token init failed", e);
      }
    };
    init();
  }, []);

  // Persist to localStorage whenever balance/transactions change
  useEffect(() => {
    try {
      localStorage.setItem(TOKEN_KEY, JSON.stringify({ balance, transactions }));
    } catch (e) {
      console.error("Failed to persist tokens", e);
    }
  }, [balance, transactions]);

  const award = useCallback(async (amount: number, reason = "award", meta: any = null) => {
    const n = Number(amount) || 0;
    if (n <= 0) return;

    // Optimistic local update using functional setState to avoid stale closures
    const tempId = `temp-${Date.now()}`;
    const tempTx: Transaction = { id: tempId, amount: n, reason, date: new Date().toISOString() };

    setBalance(prev => Number(prev) + n);
    setTransactions(prev => [tempTx, ...prev].slice(0, 100));

    // If authenticated, persist to server
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const resp = await tokenAPI.award(n, reason, meta);
        if (resp?.data?.balance != null) {
          const serverBalance = Number(resp.data.balance) || 0;
          const serverTx = resp.data.transaction;
          const serverTxFormatted = formatServerTx(serverTx);

          // Replace the optimistic temp tx with the real server tx
          setBalance(serverBalance);
          setTransactions(prev => {
            const withoutTemp = prev.filter(t => t.id !== tempId);
            return [serverTxFormatted, ...withoutTemp].slice(0, 100);
          });
        }
      } catch (e) {
        console.warn("Server award failed", e);
      }
    }
  }, []);

  const canRedeem = useCallback((amount: number) => balance >= Number(amount), [balance]);

  const redeem = useCallback(async (amount: number, reason = "redeem", meta: any = null): Promise<boolean> => {
    const n = Number(amount) || 0;
    if (n <= 0) return false;
    if (balance < n) return false;

    // Optimistic local update using functional setState
    const tempId = `temp-${Date.now()}`;
    const tempTx: Transaction = { id: tempId, amount: -n, reason, date: new Date().toISOString() };

    setBalance(prev => Number(prev) - n);
    setTransactions(prev => [tempTx, ...prev].slice(0, 100));

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const resp = await tokenAPI.redeem(n, reason, meta);
        if (resp?.data?.balance != null) {
          const serverBalance = Number(resp.data.balance) || 0;
          const serverTx = resp.data.transaction;
          const serverTxFormatted = formatServerTx(serverTx);

          // Replace the optimistic temp tx with the real server tx
          setBalance(serverBalance);
          setTransactions(prev => {
            const withoutTemp = prev.filter(t => t.id !== tempId);
            return [serverTxFormatted, ...withoutTemp].slice(0, 100);
          });
          return true;
        }
      } catch (e) {
        console.warn("Server redeem failed", e);
        // Rollback: re-sync from server
        try {
          const [balResp, txResp] = await Promise.all([
            tokenAPI.getBalance(),
            tokenAPI.getTransactions()
          ]);
          if (balResp?.data?.balance != null) setBalance(Number(balResp.data.balance) || 0);
          if (txResp?.data?.transactions) setTransactions(txResp.data.transactions.map(formatServerTx));
        } catch (e2) {
          console.warn('Failed to rollback/re-sync tokens', e2);
        }
        return false;
      }
    }
    return true;
  }, [balance]);

  const fetchBalance = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const resp = await tokenAPI.getBalance();
      if (resp?.data?.balance != null) setBalance(Number(resp.data.balance) || 0);
    } catch { /* silent */ }
  }, []);

  const claimDailyReward = useCallback(async (): Promise<boolean> => {
    if (!canClaimDaily) return false;
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const resp = await (tokenAPI as any).claimDaily();
        if (resp?.data?.success) {
          if (resp.data.newAchievements?.length > 0) {
            storeNewAchievements(
              resp.data.newAchievements.map((a: any) => ({
                icon: a.icon || '🏆',
                name: a.name || 'Achievement Unlocked',
                points: a.points || 0,
              }))
            );
          }

          const newBalance = Number(resp.data.balance) || 0;
          const tx: Transaction = {
            id: Date.now().toString(),
            amount: resp.data.tokensEarned || 5,
            reason: "Daily login reward 🎁",
            date: new Date().toISOString()
          };
          setBalance(newBalance);
          setTransactions(prev => [tx, ...prev].slice(0, 100));
          localStorage.setItem(DAILY_KEY, new Date().toISOString());
          setCanClaimDaily(false);
          return true;
        }
        return false;
      } catch (e: any) {
        // 400 = already claimed today
        if (e?.response?.status === 400) { setCanClaimDaily(false); return false; }
        // fallback: local award
      }
    }
    // Offline/unauthenticated fallback
    const DAILY_AMOUNT = 5;
    await award(DAILY_AMOUNT, "Daily login reward 🎁");
    localStorage.setItem(DAILY_KEY, new Date().toISOString());
    setCanClaimDaily(false);
    return true;
  }, [canClaimDaily, award]);

  return (
    <TokenContext.Provider value={{ balance, transactions, award, redeem, canRedeem, claimDailyReward, canClaimDaily, fetchBalance }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useTokens = () => {
  const ctx = useContext(TokenContext);
  if (!ctx) throw new Error("useTokens must be used within TokenProvider");
  return ctx;
};

export default TokenContext;
