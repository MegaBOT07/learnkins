import { Link } from "react-router-dom";
import { ShieldOff } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 border border-rose-100 rounded-2xl mb-6">
        <ShieldOff className="h-8 w-8 text-rose-500" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Access Denied</h1>
      <p className="text-slate-500 font-medium mb-8 max-w-md">
        You don't have permission to access this page. This area is restricted to administrators only.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default Unauthorized;
