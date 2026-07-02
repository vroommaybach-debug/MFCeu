import React, { useState } from 'react';
import { Package, MapPin, LifeBuoy, LogOut, Menu, X, LayoutDashboard, FileText, FileSpreadsheet, ShieldAlert, Search } from 'lucide-react';
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
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-30">
        <div className="flex flex-col">
          <span className="font-black text-sm tracking-widest text-gray-900 uppercase">
            MFC Enterprise
          </span>
          <span className="text-[8px] font-mono text-gray-400 uppercase tracking-widest">Console</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 border border-gray-200 rounded-sm text-gray-600 hover:text-gray-900 bg-gray-50 transition-colors"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs z-35 lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col shadow-xl lg:shadow-none",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 mb-8">
            <div>
              <span className="font-black text-xl tracking-widest text-gray-900 uppercase block">
                MFC Enterprise
              </span>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Logistics Manager Console</span>
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
                    "group flex items-center px-3 py-3 text-sm font-medium transition-colors rounded-sm",
                    isActive 
                      ? "bg-gray-900 text-white shadow-sm" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className={cn("mr-3", isActive ? "text-white" : "text-gray-400 group-hover:text-gray-500")}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}

            {/* Separator & FX-Admin Link */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <span className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Internal Systems</span>
              <Link
                to="/admin"
                className="group flex items-center px-3 py-3 text-sm font-semibold text-amber-600 hover:bg-amber-50 hover:text-amber-700 transition-colors rounded-sm border border-dashed border-amber-300 bg-amber-50/30"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShieldAlert className="mr-3 h-5 w-5 text-amber-500" />
                FX-Admin Console
              </Link>
            </div>
          </nav>
        </div>
        
        <div className="flex-shrink-0 border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center px-3 py-2 mb-4 bg-white border border-gray-200 shadow-sm p-3">
            <div>
              <p className="text-sm font-bold text-gray-900 truncate">{mockProfile.company_name || mockProfile.full_name}</p>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-0.5">{mockProfile.tier_level} Tier</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors rounded-sm"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-400" />
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
