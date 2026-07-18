'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Building2, ArrowRight, ShieldCheck, Mail, Lock, Award, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        if (user.role === 'admin') {
          router.push('/admin');
        } else if (user.role === 'rep') {
          router.push('/rep');
        } else {
          router.push('/buyer');
        }
      } catch (err) {
        console.error(err);
      }
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      if (user.role === 'admin') {
        router.push('/admin');
      } else if (user.role === 'rep') {
        router.push('/rep');
      } else {
        router.push('/buyer');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Section - Branding & Value Prop */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden flex-col justify-between p-12">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <img src="/erplogo.png" alt="Logo" className="h-8 w-auto object-contain" />
          <span className="text-2xl font-black text-white tracking-tight uppercase">B2B <span className="text-amber-400">Wholesale</span></span>
        </div>

        <div className="relative z-10 max-w-lg mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold text-white leading-tight mb-6"
          >
            Elevate Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Retail Business</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-slate-300 font-medium leading-relaxed"
          >
            Access exclusive wholesale pricing, manage your loyalty rewards, and track your progress towards premium dealer trips in one unified dashboard.
          </motion.p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-6 mt-20">
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
            <h3 className="text-3xl font-black text-amber-400 mb-1">15k+</h3>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Active Partners</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
            <h3 className="text-3xl font-black text-emerald-400 mb-1">₹50M+</h3>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Rewards Issued</p>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <img src="/erplogo.png" alt="Logo" className="h-8 w-auto object-contain" />
            <span className="text-2xl font-black text-slate-900 tracking-tight uppercase">B2B <span className="text-amber-500">Wholesale</span></span>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 font-medium mb-10">Please sign in to access your partner dashboard.</p>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
                <div className="text-rose-500 mt-0.5">⚠️</div>
                <p className="text-sm font-medium text-rose-700">{error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Business Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="name@company.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">Forgot Password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="••••••••" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-xl text-white font-bold tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg ${
                loading 
                  ? 'bg-slate-400 cursor-not-allowed shadow-none' 
                  : 'bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 hover:shadow-xl hover:-translate-y-0.5'
              }`} 
            >
              {loading ? 'Authenticating...' : 'Sign In'} 
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-10 flex items-center gap-3 justify-center p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <p className="text-xs font-semibold text-emerald-800">Secure, encrypted partner portal.</p>
          </div>

          <div className="mt-8 text-center text-xs font-semibold text-slate-400 space-y-1">
            <p>Admin Access: admin@example.com / admin123</p>
            <p>Rep Access: mr.kiranm@sales.com / rep123</p>
            <p>Buyer Access: j.j.electricalspudhur@example.com / buyer123</p>
          </div>

          <div className="mt-6 flex justify-center">
            <a 
              href="/Reward_Points_System.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-amber-600 bg-slate-100 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 rounded-lg transition-all shadow-sm cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Reward Points System Hub</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
