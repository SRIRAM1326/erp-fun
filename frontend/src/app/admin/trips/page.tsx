'use client';

import { Plane, Plus, Search, Users, MapPin, Calendar, ExternalLink } from 'lucide-react';

export default function AdminTripsPage() {
  const places = [
    "Ooty", "Kodaikanal", "Rameswaram", "Kanyakumari", "Mahabalipuram", 
    "Munnar", "Alleppey", "Varkala", "Wayanad", "Thekkady", 
    "Coorg", "Chikmagalur", "Mysore", "Hampi", "Gokarna"
  ];

  const genericImages = [
    'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1200&auto=format&fit=crop', // Kerala backwaters
    'https://images.unsplash.com/photo-1588631168050-705bfb4260d5?q=80&w=1200&auto=format&fit=crop', // Tea gardens
    'https://images.unsplash.com/photo-1600100397608-f010f419b9ea?q=80&w=1200&auto=format&fit=crop', // Mountains
    'https://images.unsplash.com/photo-1590766940554-6389778540c4?q=80&w=1200&auto=format&fit=crop', // Hampi/temple
    'https://images.unsplash.com/photo-1623348123868-b7654ed24945?q=80&w=1200&auto=format&fit=crop', // Beach
  ];

  const campaigns = places.map((place, index) => ({
    id: index + 1,
    title: `${place} Dealer Meet`,
    location: `${place}, India`,
    date: `Q${(index % 4) + 1} 2026`,
    pointsRequired: 10000 + (index % 5) * 2000,
    qualifiedCount: Math.floor(index * 2.5),
    inProgressCount: 20 + Math.floor(index * 5.2),
    status: index % 4 === 0 ? 'Upcoming' : 'Active',
    image: genericImages[index % genericImages.length]
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Trip Campaigns</h1>
          <p className="text-sm text-slate-500 mt-1">Manage high-tier reward trips and track buyer qualifications.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Create Campaign
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {campaigns.map((trip) => (
          <div key={trip.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="relative h-48">
              <img src={trip.image} alt={trip.location} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-slate-900/40"></div>
              <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                {trip.status}
              </div>
              <div className="absolute bottom-4 left-4 text-white">
                <h2 className="text-2xl font-bold drop-shadow-md">{trip.title}</h2>
                <div className="flex gap-4 mt-2 text-sm font-medium">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {trip.location}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {trip.date}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Target Points</p>
                  <p className="text-xl font-bold text-slate-900">{trip.pointsRequired.toLocaleString()} pts</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 font-medium">Total Qualified</p>
                  <p className="text-xl font-bold text-emerald-600 flex items-center justify-end gap-1">
                    <Users className="w-5 h-5" /> {trip.qualifiedCount}
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-medium text-slate-700">Pipeline (In Progress)</span>
                  <span className="text-sm font-bold text-slate-900">{trip.inProgressCount} Buyers</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full w-3/4"></div>
                </div>
              </div>
              
              <div className="mt-auto flex gap-3">
                <button className="flex-1 bg-white border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                  Edit Campaign
                </button>
                <button className="flex-1 bg-slate-900 text-white font-semibold py-2.5 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                  View Qualifiers <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
