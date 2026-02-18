import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, ArrowLeft, Mail, KeyRound, ShieldCheck } from 'lucide-react';

export default function ForgotPassword() {
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { loginDirectly } = useAuth();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await authAPI.forgotPassword({ email });
      setMessage('OTP sent to your email. Please check and enter the code.');
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await authAPI.verifyOTP({ email, otp });
      setMessage('OTP verified! Now enter your new password.');
      setStep('password');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await authAPI.resetPasswordOTP({ email, otp, newPassword });
      setMessage('Password reset successfully! Logging you in...');

      // Auto-login user
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
        if (loginDirectly) {
          loginDirectly(res.data.user);
        }

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const stepInfo = {
    email: { icon: <Mail className="h-8 w-8" />, title: 'Reset Password', subtitle: 'Enter your email to receive an OTP', border: 'border-cyan-500', color: 'text-cyan-600', bg: 'bg-cyan-50' },
    otp: { icon: <ShieldCheck className="h-8 w-8" />, title: 'Verify OTP', subtitle: 'Enter the OTP code sent to your email', border: 'border-yellow-500', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    password: { icon: <KeyRound className="h-8 w-8" />, title: 'New Password', subtitle: 'Create your new password', border: 'border-green-500', color: 'text-green-600', bg: 'bg-green-50' },
  };

  const current = stepInfo[step];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Step Progress */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          {(['email', 'otp', 'password'] as const).map((s, idx) => (
            <div key={s} className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-black text-sm transition-all ${step === s
                    ? 'bg-black text-white border-black'
                    : idx < ['email', 'otp', 'password'].indexOf(step)
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-white text-gray-400 border-gray-300'
                  }`}
              >
                {idx < ['email', 'otp', 'password'].indexOf(step) ? '✓' : idx + 1}
              </div>
              {idx < 2 && (
                <div
                  className={`w-8 h-0.5 ${idx < ['email', 'otp', 'password'].indexOf(step)
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                    }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className={`bg-white rounded-2xl border-2 ${current.border} p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}>
          {/* Header */}
          <div className="text-center mb-6">
            <div className={`w-16 h-16 ${current.bg} border-2 ${current.border} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              <div className={current.color}>{current.icon}</div>
            </div>
            <h1 className="text-2xl font-black text-black tracking-tight">{current.title}</h1>
            <p className="text-gray-600 text-sm mt-1">{current.subtitle}</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-2 border-red-500 text-red-700 rounded-xl font-medium text-sm">
              {error}
            </div>
          )}

          {/* Success */}
          {message && (
            <div className="mb-4 p-3 bg-green-50 border-2 border-green-500 text-green-700 rounded-xl font-medium text-sm">
              {message}
            </div>
          )}

          {/* Step 1: Email */}
          {step === 'email' && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-black text-black uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-black rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="your@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-xl border-2 border-black font-black hover:bg-white hover:text-black disabled:opacity-50 transition-all shadow-[3px_3px_0px_0px_rgba(0,206,209,1)]"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-xs font-black text-black uppercase tracking-wider mb-2">
                  OTP Code (6 digits)
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  required
                  className="w-full px-4 py-3 border-2 border-black rounded-xl font-black text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="000000"
                />
                <p className="text-xs text-gray-500 mt-1 font-medium">Check your email for the 6-digit code</p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-black text-white py-3 rounded-xl border-2 border-black font-black hover:bg-white hover:text-black disabled:opacity-50 transition-all shadow-[3px_3px_0px_0px_rgba(234,179,8,1)]"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full flex items-center justify-center space-x-2 text-black font-bold py-2 hover:text-cyan-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Email</span>
              </button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 'password' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-xs font-black text-black uppercase tracking-wider mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-12 border-2 border-black rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="At least 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-black text-black uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-black rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Repeat your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !newPassword || !confirmPassword}
                className="w-full bg-black text-white py-3 rounded-xl border-2 border-black font-black hover:bg-white hover:text-black disabled:opacity-50 transition-all shadow-[3px_3px_0px_0px_rgba(34,197,94,1)]"
              >
                {loading ? 'Resetting...' : 'Reset Password & Login'}
              </button>

              <button
                type="button"
                onClick={() => setStep('otp')}
                className="w-full flex items-center justify-center space-x-2 text-black font-bold py-2 hover:text-green-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to OTP</span>
              </button>
            </form>
          )}

          <div className="mt-6 text-center border-t-2 border-black pt-4">
            <p className="text-gray-600 font-medium">
              Remember your password?{' '}
              <Link to="/login" className="text-black font-black hover:text-cyan-600 underline underline-offset-2 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
