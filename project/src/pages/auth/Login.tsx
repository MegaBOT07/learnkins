import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, AlertCircle, User, Users, GraduationCap, UserCog } from 'lucide-react';
import Logo from '../../components/common/Logo';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) clearError();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    console.log('Attempting login with:', formData);
    const result = await login(formData);

    if (result.success && result.user) {
      if (result.user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }

    setLoading(false);
  };

  const handleDemoLogin = (email: string, password: string) => {
    setFormData({ email, password });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="flex justify-center">
          <Link to="/" className="inline-block">
            <Logo size="lg" />
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-black text-black tracking-tight">
          Welcome back!
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to continue your learning journey
        </p>
        <p className="mt-1 text-center text-sm text-gray-500">
          Or{' '}
          <Link
            to="/register"
            className="font-bold text-black hover:text-cyan-600 transition-colors underline underline-offset-2"
          >
            create a new account
          </Link>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-white border-2 border-black rounded-2xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border-2 border-red-500 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2 font-medium"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-black text-black uppercase tracking-wider mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-black text-black uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border-2 border-black rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-black transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-black transition-colors" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-black focus:ring-black border-2 border-black rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-bold text-black">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-bold text-black hover:text-cyan-600 transition-colors underline underline-offset-2"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 px-6 rounded-xl border-2 border-black font-black text-base hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[3px_3px_0px_0px_rgba(0,206,209,1)]"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-black" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-black font-black uppercase tracking-wider text-xs">
                  Try Demo Accounts
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { email: 'student@learnkins.com', password: 'student123', icon: <User className="h-6 w-6" />, label: 'Student', border: 'border-cyan-500', color: 'text-cyan-600' },
                { email: 'parent@learnkins.com', password: 'parent123', icon: <Users className="h-6 w-6" />, label: 'Parent', border: 'border-green-500', color: 'text-green-600' },
                { email: 'teacher@learnkins.com', password: 'teacher123', icon: <GraduationCap className="h-6 w-6" />, label: 'Teacher', border: 'border-purple-500', color: 'text-purple-600' },
                { email: 'admin@learnkins.com', password: 'admin123', icon: <UserCog className="h-6 w-6" />, label: 'Admin', border: 'border-orange-500', color: 'text-orange-600' },
              ].map((demo, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleDemoLogin(demo.email, demo.password)}
                  className={`p-3 text-center rounded-xl border-2 ${demo.border} bg-white hover:-translate-y-0.5 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}
                >
                  <div className={`${demo.color} mx-auto mb-1 flex justify-center`}>
                    {demo.icon}
                  </div>
                  <span className="text-sm font-black text-black">{demo.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
