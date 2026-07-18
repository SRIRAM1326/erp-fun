'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, FileText, Wallet, User, LogOut, Menu, X, Award } from 'lucide-react';
import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'] });

export default function RepLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className={`flex h-screen bg-[#0c0a1f] text-[#f1f0fb] overflow-hidden ${outfit.className}`}>
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#14122d] border-r border-[#242247] flex-col shadow-xl z-20">
        <div className="p-6 border-b border-[#242247]">
          <div className="flex items-center gap-2 mb-1">
            <img src="/erplogo.png" alt="Logo" className="h-8 w-auto object-contain" />
            <h1 className="text-xl font-bold tracking-tight text-white">RewardHub<span className="text-[#8b5cf6]">™</span></h1>
          </div>
          <p className="text-xs text-[#8f8bb3] font-semibold tracking-wider uppercase mt-2">Representative Portal</p>
        </div>
        
        <div className="p-4 border-b border-[#242247] bg-[#090717]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8b5cf6] to-[#ec4899] flex items-center justify-center font-bold text-white shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <p className="text-xs text-[#ffd700] font-bold">Gold Tier Rep</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                    ? 'bg-[#8b5cf6]/20 text-[#8b5cf6] border-l-4 border-[#8b5cf6] shadow-sm shadow-[#8b5cf6]/10' 
                    : 'text-[#8f8bb3] hover:bg-[#14122d]/70 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#8b5cf6]' : 'text-[#8f8bb3]'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-[#242247]">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-[#8f8bb3] hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-[#14122d] border-b border-[#242247] h-16 flex items-center justify-between px-4 z-20">
          <div className="flex items-center gap-2">
            <img src="/erplogo.png" alt="Logo" className="h-6 w-auto object-contain" />
            <span className="font-bold text-white">RewardHub™</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 -mr-2 text-[#8f8bb3]">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Full Screen Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute inset-0 top-16 bg-[#14122d] z-30 flex flex-col">
            <div className="p-6 border-b border-[#242247] bg-[#0c0a1f]">
              <p className="text-lg font-bold text-white">{user.name}</p>
              <p className="text-sm text-[#ffd700] font-bold">Gold Tier Rep</p>
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
                    className={`flex items-center space-x-4 px-4 py-4 rounded-xl font-medium ${
                      isActive 
                        ? 'bg-[#8b5cf6]/20 text-[#8b5cf6]' 
                        : 'text-[#8f8bb3] hover:bg-[#0c0a1f]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#8b5cf6]' : 'text-[#8f8bb3]'}`} />
                    <span className="text-base">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-[#242247]">
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-4 w-full px-4 py-4 text-red-400 font-medium"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 bg-[#0c0a1f]">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#14122d] border-t border-[#242247] flex justify-around items-center h-16 z-20 pb-safe">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                  isActive ? 'text-[#8b5cf6]' : 'text-[#8f8bb3] hover:text-[#f1f0fb]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
