'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, BarChart3, Settings, LogOut, Bell, Search, Menu, X, FileText, Wallet, Award, Database, History, Tag, Sliders, Layers } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
    if (parsedUser.role !== 'admin') {
      router.push('/login');
      return;
    }
    
    setUser(parsedUser);
  }, [router]);

  if (!user) return null;

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, color: 'text-blue-400' },
    { name: 'Customers', href: '/admin/buyers', icon: Users, color: 'text-emerald-400' },
    { name: 'Sales Partners', href: '/admin/reps', icon: Award, color: 'text-violet-400' },
    { name: 'Invoices', href: '/admin/invoices', icon: FileText, color: 'text-amber-400' },
    { name: 'Product Tagging', href: '/admin/products', icon: Tag, color: 'text-rose-400' },
    { name: 'Redemptions', href: '/admin/redemptions', icon: Wallet, color: 'text-cyan-400' },
    { name: 'Imports', href: '/admin/imports', icon: Database, color: 'text-indigo-400' },
    { name: 'Reports', href: '/admin/reports', icon: BarChart3, color: 'text-teal-400' },
    { name: 'Reward Rules', href: '/admin/config', icon: Sliders, color: 'text-orange-400' },
    { name: 'Configuration Versioning', href: '/admin/versions', icon: Layers, color: 'text-pink-400' },
    { name: 'Audit Log', href: '/admin/audit', icon: History, color: 'text-yellow-400' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden relative">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white flex-col z-20 border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <img src="/erplogo.png" alt="Logo" className="h-8 w-auto object-contain" />
          </div>
          <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mt-2 leading-none">Admin Portal</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`group flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${
                  isActive 
                    ? 'bg-slate-800/80 text-white border-l-4 border-blue-500 shadow-inner' 
                    : 'text-slate-300 hover:bg-slate-800/40 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white scale-110' : item.color}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-800 bg-slate-950/20">
          <button 
            onClick={handleLogout}
            className="group flex items-center space-x-3 w-full px-4 py-2.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-colors font-medium text-sm"
          >
            <LogOut className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-red-400 group-hover:scale-110 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Header (Desktop & Mobile) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-20 shrink-0">
          
          {/* Mobile Header Branding & Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <img src="/erplogo.png" alt="Logo" className="h-6 w-auto object-contain" />
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 -mr-2 text-slate-600">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Search (Desktop Only) */}
          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search customers, invoices, or redemptions..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            />
          </div>
          
          {/* Right Actions (Hidden on tiny screens) */}
          <div className="hidden sm:flex items-center gap-4 md:gap-6 ml-auto">

            
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4 md:pl-6">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-slate-900 leading-none">Admin User</p>
                <p className="text-xs text-slate-500 mt-1">Superadmin</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Full Screen Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute inset-0 top-16 bg-slate-950 z-30 flex flex-col border-t border-slate-800">
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-4 px-4 py-3.5 rounded-xl font-medium ${
                      isActive 
                        ? 'bg-slate-850 text-white border-l-4 border-blue-500' 
                        : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : item.color}`} />
                    <span className="text-base">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-slate-900">
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-4 w-full px-4 py-4 text-red-400 font-medium"
              >
                <LogOut className="w-5 h-5 text-red-400" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
