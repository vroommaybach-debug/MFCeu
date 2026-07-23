import React, { useState } from 'react';
import { Package, MapPin, LifeBuoy, LogOut, Menu, X, LayoutDashboard, FileText, FileSpreadsheet, Search } from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { mockProfile } from '../../lib/mock-data';

export const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard Overview', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Shipment Manager', path: '/dashboard/shipments', icon: <Package className="h-5 w-5" /> },
    { name: 'Global Tracking', path: '/dashboard/track', icon: <Search className="h-5 w-5" /> },
    { name: 'Secure Routing Portal', path: '/dashboard/addresses', icon: <MapPin className="h-5 w-5" /> },
    { name: 'Document Center', path: '/dashboard/documents', icon: <FileText className="h-5 w-5" /> },
    { name: 'Billing & Invoices', path: '/dashboard/billing', icon: <FileSpreadsheet className="h-5 w-5" /> },
    { name: 'Support Ticketing', path: '/dashboard/support', icon: <LifeBuoy className="h-5 w-5" /> },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50 font-sans">
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-30">
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-tight text-slate-900">
            MFC Enterprise
          </span>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">Console</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 border border-slate-200 rounded-none text-slate-600 hover:text-slate-900 bg-slate-50 transition-colors shadow-sm"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-35 lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col shadow-xl lg:shadow-none",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 mb-8">
            <div>
              <span className="font-bold text-xl tracking-tight text-slate-900 block">
                MFC Enterprise
              </span>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">Logistics Console</span>
            </div>
          </div>
          
          <nav className="mt-5 flex-1 px-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "group flex items-center px-4 py-3 text-sm font-medium transition-colors rounded-none",
                    isActive 
                      ? "bg-slate-900 text-white shadow-sm" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className={cn("mr-3", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-500")}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="flex-shrink-0 border-t border-slate-200 p-4 bg-slate-50">
          <div className="flex items-center px-3 py-3 mb-4 bg-white border border-slate-200 shadow-sm rounded-none">
            <div>
              <p className="text-sm font-bold text-slate-900 truncate">{mockProfile.company_name || mockProfile.full_name}</p>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] mt-1">{mockProfile.tier_level} Tier</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors rounded-none border border-transparent"
          >
            <LogOut className="mr-3 h-4 w-4 text-slate-400" />
            Sign Out Session
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-0 overflow-hidden">
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none lg:pt-0 pt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
