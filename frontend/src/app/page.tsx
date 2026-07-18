// Trigger Vercel rebuild with correct root directory settings
import Link from 'next/link';
import { QrCode, Wallet, Gift, Plane, CheckCircle, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/erplogo.png" alt="Logo" className="h-8 w-auto object-contain" />
            <span className="text-xl font-bold text-slate-900 tracking-tight">WholesaleRewards</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Login
            </Link>
            <Link href="/login" className="text-sm font-medium bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
              Join as Buyer
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-20 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Buy More. <span className="text-amber-400">Earn More.</span><br />
                Unlock Rewards & Trips.
              </h1>
              <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
                The exclusive loyalty program for our wholesale partners. Scan QR codes on your purchases to earn points, redeem premium rewards, and qualify for all-expenses-paid dealer trips.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/login" className="bg-amber-500 text-slate-900 font-semibold px-8 py-4 rounded-xl hover:bg-amber-400 transition-all shadow-lg hover:shadow-amber-500/25 flex items-center gap-2">
                  Join the Program <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="#how-it-works" className="bg-white/10 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm">
                  See Rewards
                </Link>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              {/* Mockup Composition */}
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute top-10 right-10 w-64 bg-white rounded-2xl p-6 shadow-2xl transform rotate-6 border border-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-emerald-100 p-3 rounded-full">
                      <CheckCircle className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Points Added</p>
                      <p className="text-xl font-bold text-slate-900">+500 pts</p>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full w-full mb-2">
                    <div className="h-full bg-emerald-500 rounded-full w-3/4"></div>
                  </div>
                  <p className="text-xs text-slate-500 text-right">2,500 to Gold Tier</p>
                </div>
                
                <div className="absolute bottom-10 left-0 w-72 bg-slate-800 rounded-2xl p-6 shadow-2xl transform -rotate-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150">
                  <div className="flex items-center gap-4">
                    <div className="bg-amber-500/20 p-4 rounded-xl">
                      <Plane className="w-10 h-10 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white">Dubai Trip 2026</p>
                      <p className="text-sm text-slate-400">72% Completed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">How It Works</h2>
              <p className="text-slate-500 mt-4 max-w-2xl mx-auto">Four simple steps to start earning rewards on every wholesale order.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Buy Wholesale Products', desc: 'Place your regular wholesale orders with us as you always do.' },
                { step: '02', title: 'Get QR Code', desc: 'Receive a unique reward QR code linked to your invoice.' },
                { step: '03', title: 'Scan & Earn', desc: 'Scan the QR code using our buyer portal to instantly earn points.' },
                { step: '04', title: 'Redeem Rewards', desc: 'Use points for cashback, discounts, or qualify for international trips.' },
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-shadow relative overflow-hidden group">
                  <div className="text-6xl font-black text-slate-100 absolute -top-4 -right-4 transition-transform group-hover:scale-110">{item.step}</div>
                  <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3 relative z-10">{item.title}</h3>
                  <p className="text-slate-600 relative z-10">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Rewards Highlights */}
        <section className="py-24 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Exclusive Rewards</h2>
              <p className="text-slate-500 mt-4 max-w-2xl mx-auto">We value your partnership. Exchange your points for premium benefits.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <Wallet className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Cashback & Wallet</h3>
                <p className="text-slate-600">Convert your points directly into wallet balance for your next wholesale purchase.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                <div className="bg-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <Gift className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Premium Discounts</h3>
                <p className="text-slate-600">Unlock high-value discount coupons and free product vouchers for top-selling items.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center hover:-translate-y-1 transition-transform ring-2 ring-amber-400">
                <div className="absolute top-0 right-0 bg-amber-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">TOP TIER</div>
                <div className="bg-amber-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <Plane className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Dealer Trips</h3>
                <p className="text-slate-600">Reach the Platinum milestone and join us on an all-expenses-paid international dealer trip.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-900 rounded-3xl p-12 text-center shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-amber-500 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">Already buying from us?</h2>
              <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto relative z-10">
                Don&apos;t leave points on the table. Join the loyalty program today and start earning rewards on your very next order.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                <Link href="/login" className="bg-amber-500 text-slate-900 font-semibold px-8 py-4 rounded-xl hover:bg-amber-400 transition-all shadow-lg hover:shadow-amber-500/25">
                  Buyer Signup
                </Link>
                <Link href="#" className="bg-white/10 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-all border border-white/20">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} WholesaleRewards Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
