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
};

const TOKEN_KEY = "learnkins_tokens";

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const init = async () => {
      try {
        const raw = localStorage.getItem(TOKEN_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setBalance(parsed.balance || 0);
          setTransactions(parsed.transactions || []);
        }

        // If user is authenticated, try to sync balance/transactions from server
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const resp = await tokenAPI.getBalance();
            if (resp?.data?.balance != null) setBalance(resp.data.balance);
            const txResp = await tokenAPI.getTransactions();
            if (txResp?.data?.transactions) setTransactions(txResp.data.transactions.map((t: any) => ({ id: t._id, amount: t.amount, reason: t.reason, date: t.createdAt })));
          } catch (e) {
            // ignore server sync failures and keep local state
            console.warn("Token sync failed", e);
          }
        }
      } catch (e) {
        setBalance(0);
        setTransactions([]);
      }
    };
    init();
  }, []);

  const persist = (nextBalance: number, nextTx: Transaction[]) => {
    setBalance(nextBalance);
    setTransactions(nextTx);
    try {
      localStorage.setItem(TOKEN_KEY, JSON.stringify({ balance: nextBalance, transactions: nextTx }));
    } catch (e) {
      console.error("Failed to persist tokens", e);
    }
  };

  const award = async (amount: number, reason = "award", meta: any = null) => {
    if (amount <= 0) return;
    // optimistic local update
    const tx: Transaction = { id: Date.now().toString(), amount, reason, date: new Date().toISOString() };
    const nextBalance = balance + amount;
    const nextTx = [tx, ...transactions].slice(0, 100);
    persist(nextBalance, nextTx);

    // if authenticated, persist to server
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const resp = await tokenAPI.award(amount, reason, meta);
        if (resp?.data?.balance != null) {
          // replace local state with authoritative server state
          const serverBalance = resp.data.balance;
          const serverTx = resp.data.transaction;
          const serverTxFormatted = { id: serverTx._id, amount: serverTx.amount, reason: serverTx.reason, date: serverTx.createdAt };
          persist(serverBalance, [serverTxFormatted, ...transactions].slice(0, 100));
        }
      } catch (e) {
        console.warn("Failed to persist award to server", e);
      }
    }
  };

  const canRedeem = (amount: number) => {
    return balance >= amount;
  };

  const redeem = async (amount: number, reason = "redeem", meta: any = null) => {
    if (amount <= 0) return false;
    if (!canRedeem(amount)) return false;

    // optimistic local update
    const tx: Transaction = { id: Date.now().toString(), amount: -amount, reason, date: new Date().toISOString() };
    const nextBalance = balance - amount;
    const nextTx = [tx, ...transactions].slice(0, 100);
    persist(nextBalance, nextTx);

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const resp = await tokenAPI.redeem(amount, reason, meta);
        if (resp?.data?.balance != null) {
          const serverBalance = resp.data.balance;
          const serverTx = resp.data.transaction;
          const serverTxFormatted = { id: serverTx._id, amount: serverTx.amount, reason: serverTx.reason, date: serverTx.createdAt };
          persist(serverBalance, [serverTxFormatted, ...transactions].slice(0, 100));
        }
      } catch (e) {
        console.warn("Failed to persist redeem to server", e);
        // if server redeem failed, rollback local optimistic change by re-syncing from server
        try {
          const resp2 = await tokenAPI.getBalance();
          if (resp2?.data?.balance != null) setBalance(resp2.data.balance);
          const txResp = await tokenAPI.getTransactions();
          if (txResp?.data?.transactions) setTransactions(txResp.data.transactions.map((t: any) => ({ id: t._id, amount: t.amount, reason: t.reason, date: t.createdAt })));
        } catch (e2) {
          console.warn('Failed to rollback/re-sync tokens', e2);
        }
        return false;
      }
    }

    return true;
  };

  return (
    <TokenContext.Provider value={{ balance, transactions, award, redeem, canRedeem }}>
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
