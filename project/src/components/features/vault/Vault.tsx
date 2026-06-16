import React from "react";
import { useTokens } from "../../../context/TokenContext";

const Vault: React.FC = () => {
  const { balance, transactions } = useTokens();

  return (
    <div className="p-4 bg-white rounded-lg shadow-md w-full max-w-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">Vault Balance</div>
          <div className="text-2xl font-bold">{balance} 💎</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-sm text-gray-600 font-medium">Recent</div>
        <div className="mt-2 space-y-2 max-h-40 overflow-auto">
          {transactions.length === 0 && (
            <div className="text-xs text-gray-500">No transactions yet</div>
          )}
          {transactions.slice(0, 8).map((t) => (
            <div key={t.id} className="flex items-center justify-between text-sm">
              <div className="text-gray-700">{t.reason}</div>
              <div className={`font-medium ${t.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {t.amount > 0 ? `+${t.amount}` : t.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Vault;
