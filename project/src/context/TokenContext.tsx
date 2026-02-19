import React, { createContext, useContext, useEffect, useState } from "react";
import { tokenAPI } from "../utils/api";

type Transaction = {
  id: string;
  amount: number;
  reason: string;
  date: string;
};

type TokenContextType = {
  balance: number;
  transactions: Transaction[];
  award: (amount: number, reason?: string, meta?: any) => Promise<void> | void;
  redeem: (amount: number, reason?: string, meta?: any) => Promise<boolean> | boolean;
  canRedeem: (amount: number) => boolean;
  claimDailyReward: () => Promise<boolean>;
  canClaimDaily: boolean;
  fetchBalance: () => Promise<void>;
};

const TOKEN_KEY = "learnkins_tokens";
const DAILY_KEY = "learnkins_daily_claimed";

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [lastRewardDay, setLastRewardDay] = useState<string>("");
  const [canClaimDaily, setCanClaimDaily] = useState<boolean>(false);

  const checkDailyEligibility = () => {
    const last = localStorage.getItem(DAILY_KEY);
    if (!last) { setCanClaimDaily(true); return; }
    const lastDate = new Date(last).toDateString();
    const today = new Date().toDateString();
    setCanClaimDaily(lastDate !== today);
  };

  useEffect(() => {
    checkDailyEligibility();
    const init = async () => {
      try {
        const raw = localStorage.getItem(TOKEN_KEY);
        let localBalance = 0;
        let localTx: Transaction[] = [];
        let localLastReward = "";

        if (raw) {
          const parsed = JSON.parse(raw);
          localBalance = parsed.balance || 0;
          localTx = parsed.transactions || [];
          localLastReward = parsed.lastRewardDay || "";
          setBalance(localBalance);
          setTransactions(localTx);
          setLastRewardDay(localLastReward);
        }

        // Check for daily reward immediately
        const today = new Date().toISOString().split('T')[0];
        if (localLastReward !== today) {
          // award() will handle state and server update
          await award(20, "Daily Login Reward 🎁");
          setLastRewardDay(today);
        }

        // If user is authenticated, sync from server to get authoritative state
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const [balResp, txResp] = await Promise.all([
              tokenAPI.getBalance(),
              tokenAPI.getTransactions()
            ]);

            if (balResp?.data?.balance != null) {
              setBalance(balResp.data.balance);
            }
            if (txResp?.data?.transactions) {
              const formatted = txResp.data.transactions.map((t: any) => ({
                id: t._id,
                amount: t.amount,
                reason: t.reason,
                date: t.createdAt
              }));
              setTransactions(formatted);
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

  // Update localStorage whenever state changes
  useEffect(() => {
    if (lastRewardDay) {
      localStorage.setItem(TOKEN_KEY, JSON.stringify({
        balance,
        transactions,
        lastRewardDay
      }));
    }
  }, [balance, transactions, lastRewardDay]);

  const award = async (amount: number, reason = "award", meta: any = null) => {
    if (amount <= 0) return;

    // Create unique ID for optimistic update
    const tempId = "temp-" + Date.now();
    const optimisticTx: Transaction = {
      id: tempId,
      amount,
      reason,
      date: new Date().toISOString()
    };

    // Optimistic Update
    setBalance(prev => prev + amount);
    setTransactions(prev => [optimisticTx, ...prev].slice(0, 100));

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const resp = await tokenAPI.award(amount, reason, meta);
        if (resp?.data?.balance != null) {
          const serverBalance = resp.data.balance;
          const serverTx = resp.data.transaction;
          const serverTxFormatted = {
            id: serverTx._id,
            amount: serverTx.amount,
            reason: serverTx.reason,
            date: serverTx.createdAt
          };

          setBalance(serverBalance);
          setTransactions(prev => {
            // Replace matching temp transaction or just prepend if not found
            const filtered = prev.filter(t => t.id !== tempId);
            return [serverTxFormatted, ...filtered].slice(0, 100);
          });
        }
      } catch (e) {
        console.warn("Server award failed", e);
      }
    }
  };

  const canRedeem = (amount: number) => balance >= amount;

  const redeem = async (amount: number, reason = "redeem", meta: any = null) => {
    if (amount <= 0) return false;
    if (!canRedeem(amount)) return false;

    const tempId = "temp-" + Date.now();
    const optimisticTx: Transaction = {
      id: tempId,
      amount: -amount,
      reason,
      date: new Date().toISOString()
    };

    // Optimistic Update
    setBalance(prev => prev - amount);
    setTransactions(prev => [optimisticTx, ...prev].slice(0, 100));

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const resp = await tokenAPI.redeem(amount, reason, meta);
        if (resp?.data?.balance != null) {
          const serverBalance = resp.data.balance;
          const serverTx = resp.data.transaction;
          const serverTxFormatted = {
            id: serverTx._id,
            amount: serverTx.amount,
            reason: serverTx.reason,
            date: serverTx.createdAt
          };

          setBalance(serverBalance);
          setTransactions(prev => {
            const filtered = prev.filter(t => t.id !== tempId);
            return [serverTxFormatted, ...filtered].slice(0, 100);
          });
          return true;
        }
      } catch (e) {
        console.warn("Server redeem failed", e);
        // Rollback on error
        const [balResp, txResp] = await Promise.all([
          tokenAPI.getBalance(),
          tokenAPI.getTransactions()
        ]);
        if (balResp?.data?.balance != null) setBalance(balResp.data.balance);
        if (txResp?.data?.transactions) {
          setTransactions(txResp.data.transactions.map((t: any) => ({
            id: t._id,
            amount: t.amount,
            reason: t.reason,
            date: t.createdAt
          })));
        }
        return false;
      }
    }
    return true;
  };

  const fetchBalance = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const resp = await tokenAPI.getBalance();
      if (resp?.data?.balance != null) setBalance(resp.data.balance);
    } catch { /* silent */ }
  };

  const claimDailyReward = async (): Promise<boolean> => {
    if (!canClaimDaily) return false;
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const resp = await tokenAPI.claimDaily();
        if (resp?.data?.success) {
          const newBalance = resp.data.balance;
          const tx: Transaction = { id: Date.now().toString(), amount: resp.data.tokensEarned || 5, reason: "Daily login reward 🎁", date: new Date().toISOString() };
          persist(newBalance, [tx, ...transactions].slice(0, 100));
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
  };

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
