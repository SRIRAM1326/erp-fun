'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, FileText, Wallet, User, LogOut, Menu, X, Coins, Bell, Gift, ChevronRight } from 'lucide-react';
import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'] });

export default function RepLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [points, setPoints] = useState<number>(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'rep') {
      router.push('/login');
      return;
    }
    
    setUser(parsedUser);
  }, [router]);

  if (!user) return null;

  const navItems = [
    { name: 'Dashboard', href: '/rep', icon: LayoutDashboard },
    { name: 'Invoices', href: '/rep/invoices', icon: FileText },
    { name: 'Earnings', href: '/rep/earnings', icon: Wallet },
    { name: 'Profile', href: '/rep/profile', icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className={`flex h-screen bg-[#edf4f2] text-slate-800 overflow-hidden ${outfit.className}`}>
      
      {/* Desktop Sidebar (Teal Reward Theme matching Screenshot) */}
      <aside className="hidden md:flex w-72 bg-[#0d7a75] text-white flex-col shadow-2xl z-20 relative">
        
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-amber-300 shadow-md">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                RewardHub
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-widest text-teal-100 opacity-90">
                Sales Partner Portal
              </span>
            </div>
          </div>
        </div>
        
        {/* User Badge Card matching "My Account" screenshot */}
        <div className="p-4 mx-4 my-4 rounded-2xl bg-white/10 border border-white/20 shadow-lg text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white text-[#0d7a75] font-black text-xl flex items-center justify-center shadow-md border-2 border-amber-300 shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black truncate">{user.name}</p>
              <p className="text-xs text-teal-100 font-medium truncate">{user.email || 'rep@partner.com'}</p>
            </div>
          </div>
          
          {/* Total Points Badge matching screenshot */}
          <div className="mt-3 py-2 px-3 rounded-xl bg-[#085a56] border border-amber-300/40 flex items-center justify-between">
            <span className="text-[11px] font-bold text-teal-100 uppercase tracking-wider">Total Points</span>
            <div className="flex items-center gap-1.5 bg-[#f59e0b] text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full shadow-sm">
              <Coins className="w-3.5 h-3.5 text-slate-950" />
              <span>{(user.points || 5879).toLocaleString()} Coins</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                  isActive 
                    ? 'bg-white text-[#0d7a75] shadow-lg font-extrabold' 
                    : 'text-teal-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#0d7a75]' : 'text-teal-200'}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-[#0d7a75]" />}
              </Link>
            );
          })}
        </nav>
        
        {/* Footer Sign Out */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 bg-rose-500/20 text-rose-100 hover:bg-rose-500/30 rounded-xl transition-all font-bold text-sm border border-rose-300/30"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Mobile Header matching Screenshot header */}
        <header className="md:hidden bg-[#0d7a75] text-white h-16 flex items-center justify-between px-4 shadow-md z-20">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-lg tracking-tight">RewardHub</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Bell Icon matching Screenshot top right */}
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
            </div>

            {/* Gold Coins Pill matching Screenshot top right */}
            <div className="bg-[#f59e0b] text-slate-950 font-black text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Coins className="w-3.5 h-3.5" />
              <span>{(user.points || 5879).toLocaleString()}</span>
            </div>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="p-1.5 text-white ml-1"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {/* Mobile Full Screen Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute inset-0 top-16 bg-[#0d7a75] z-30 flex flex-col text-white">
            <div className="p-6 border-b border-white/10 bg-[#085a56]">
              <p className="text-lg font-black">{user.name}</p>
              <p className="text-xs text-teal-100">{user.email || 'rep@partner.com'}</p>
              <div className="inline-flex items-center gap-1.5 bg-[#f59e0b] text-slate-950 font-black text-xs px-3 py-1 rounded-full mt-3">
                <Coins className="w-4 h-4" /> {(user.points || 5879).toLocaleString()} Coins
              </div>
            </div>
            
            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl font-bold ${
                      isActive 
                        ? 'bg-white text-[#0d7a75]' 
                        : 'text-teal-100 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-base">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-white/10">
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center space-x-2 w-full px-4 py-3.5 bg-rose-500/20 text-rose-100 rounded-xl font-bold"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Page Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          {children}
        </main>

        {/* Mobile Bottom Navigation Bar matching Screenshot bottom bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0d7a75] text-teal-100 flex justify-around items-center h-16 z-20 shadow-2xl border-t border-white/10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full space-y-0.5 ${
                  isActive ? 'text-amber-300 font-extrabold' : 'text-teal-100 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-bold">{item.name}</span>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}


