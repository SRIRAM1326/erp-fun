'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Mail, Phone, MapPin, Shield, Bell, Users, Copy, CheckCircle2, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/buyer/dashboard');
        setReferralCode(res.data.referral_code || 'REF-PENDING');
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' } }
  };

  const tiers = [
    { name: 'Silver', points: 0, perks: ['Basic Rewards', 'Standard Support'], achieved: true },
    { name: 'Gold', points: 15000, perks: ['1.5x Point Multiplier', 'Priority Support', 'Early Access Deals'], achieved: false },
    { name: 'Platinum', points: 50000, perks: ['Net-45 Payment Terms', 'Free Shipping', 'Dedicated Account Manager'], achieved: false },
  ];

  return (
    <motion.div 
      className="max-w-5xl mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Business Profile</h1>
        <p className="text-slate-500 mt-1">Manage your membership and account details.</p>
      </motion.div>

      <div className="grid md:grid-cols-12 gap-8">
        
        {/* Left Column: Digital Card & Tiers */}
        <div className="md:col-span-7 space-y-8">
          
          {/* 3D Digital Membership Card */}
          <motion.div variants={itemVariants} className="relative perspective-1000 w-full aspect-[1.6/1] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <motion.div
              className="w-full h-full relative preserve-3d transition-transform duration-700 ease-in-out shadow-2xl rounded-3xl"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
            >
              {/* Front of Card */}
              <div className="absolute inset-0 backface-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 p-8 flex flex-col justify-between overflow-hidden">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/20 blur-3xl rounded-full pointer-events-none"></div>
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full pointer-events-none"></div>
                
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <h2 className="text-amber-400 font-bold tracking-widest uppercase text-xs mb-1">Wholesale Rewards</h2>
                    <h3 className="text-white text-2xl font-black">Silver Member</h3>
                  </div>
                  <div className="w-12 h-12 bg-white/10 rounded-xl backdrop-blur-md border border-white/20 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-amber-400" />
                  </div>
                </div>

                <div className="relative z-10">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Business Name</p>
                  <p className="text-white text-xl font-medium tracking-wide">Wholesale Traders Ltd</p>
                  
                  <div className="flex gap-8 mt-4">
                    <div>
                      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Member ID</p>
                      <p className="text-white font-mono">1029-3847-56</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Joined</p>
                      <p className="text-white">Jul 2026</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div 
                className="absolute inset-0 backface-hidden rounded-3xl bg-white border-2 border-slate-200 p-8 flex flex-col justify-between"
                style={{ transform: 'rotateY(180deg)' }}
              >
                <div className="w-full h-12 bg-slate-900 -mx-8 px-8 mb-4"></div>
                <div className="flex gap-6 items-center">
                  <div className="bg-slate-100 p-3 rounded-xl">
                    <QrCode className="w-20 h-20 text-slate-900" />
                  </div>
                  <div>
                    <p className="text-slate-900 font-bold text-lg mb-1">Scan for Auth</p>
                    <p className="text-slate-500 text-sm">Present this digital card to your distributor for fast in-person verification.</p>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <p className="text-xs text-slate-400">Support: 1-800-WHOLESALE</p>
                </div>
              </div>
            </motion.div>
            <p className="text-center text-xs text-slate-400 mt-4 font-medium uppercase tracking-widest animate-pulse">Click to flip card</p>
          </motion.div>

          {/* Interactive Tier Unlock Timeline */}
          <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-8">Tier Progression Roadmap</h2>
            <div className="relative">
              {/* Vertical line connecting tiers */}
              <div className="absolute left-6 top-6 bottom-6 w-1 bg-slate-100 rounded-full"></div>
              
              <div className="space-y-8">
                {tiers.map((tier, idx) => (
                  <div key={idx} className="relative flex items-start gap-6 group">
                    <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                      tier.achieved ? 'bg-amber-100 shadow-sm' : 'bg-slate-50 border-2 border-slate-100'
                    }`}>
                      {tier.achieved ? (
                        <CheckCircle2 className="w-6 h-6 text-amber-500" />
                      ) : (
                        <Shield className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                    <div className="pt-2">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className={`text-lg font-bold ${tier.achieved ? 'text-slate-900' : 'text-slate-400'}`}>{tier.name} Tier</h3>
                        {!tier.achieved && (
                          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                            Unlocks at {tier.points.toLocaleString()} pts
                          </span>
                        )}
                      </div>
                      <ul className="space-y-2 mt-3">
                        {tier.perks.map((perk, i) => (
                          <li key={i} className={`text-sm flex items-center gap-2 ${tier.achieved ? 'text-slate-600' : 'text-slate-400'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${tier.achieved ? 'bg-amber-400' : 'bg-slate-300'}`}></div>
                            {perk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Contact, Referral, Security */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Referral Program */}
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl border border-indigo-800 shadow-xl overflow-hidden text-white relative group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full"></div>
            <div className="p-6 border-b border-indigo-800/50 flex justify-between items-center relative z-10">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" /> B2B Referral Program
              </h2>
            </div>
            <div className="p-6 relative z-10">
              <p className="text-indigo-200 mb-6 text-sm">
                Invite other retailers to join our wholesale network. When they make their first purchase, <strong className="text-white">you both receive a 5,000 pts bonus!</strong>
              </p>
              
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Your Unique Referral Code</label>
              <div className="flex flex-col gap-3">
                <div className="bg-slate-900/50 border border-indigo-700/50 rounded-xl px-4 py-3 flex items-center justify-center shadow-inner">
                  <span className="font-mono text-xl font-bold tracking-wider text-amber-400">{referralCode}</span>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopy}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
                >
                  {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copied ? 'Copied to Clipboard!' : 'Copy Code'}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" /> Contact Details
              </h2>
              <button className="text-sm font-bold text-blue-600 hover:text-blue-700">Edit</button>
            </div>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-900 font-bold">buyer@example.com</p>
                  <p className="text-xs font-medium text-slate-500">Primary Email</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-900 font-bold">+91 98765 43210</p>
                  <p className="text-xs font-medium text-slate-500">Primary Phone</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-900 font-medium leading-relaxed">123 Wholesale Market, Building B<br/>Mumbai, Maharashtra 400001, India</p>
                  <p className="text-xs font-medium text-slate-500 mt-1">Shipping Address</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Security & Settings */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 text-center cursor-pointer hover:bg-slate-50 transition-colors">
              <Shield className="w-6 h-6 text-blue-600 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-900">Security</p>
              <p className="text-xs text-slate-500 mt-1">Manage 2FA</p>
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 text-center cursor-pointer hover:bg-slate-50 transition-colors">
              <Bell className="w-6 h-6 text-blue-600 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-900">Alerts</p>
              <p className="text-xs text-slate-500 mt-1">Notifications</p>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
