import React, { useState } from 'react';
import { Package, MapPin, LifeBuoy, LogOut, Menu, X, LayoutDashboard, FileText, FileSpreadsheet } from 'lucide-react';
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
      {/* Mobile menu button */}
      <div className="lg:hidden absolute top-0 left-0 p-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white border border-gray-200 rounded-md text-gray-500 shadow-sm"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col shadow-lg lg:shadow-none",
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
