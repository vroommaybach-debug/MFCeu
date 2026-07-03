import React, { useState, useEffect } from 'react';
import { Package, AlertCircle, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { mockProfile } from '../../lib/mock-data';
import { motion } from 'motion/react';
import { Shipment } from '../../types';
import { supabase } from '../../lib/supabase';

export const Overview = () => {
  const navigate = useNavigate();
  const [allShipments, setAllShipments] = useState<Shipment[]>([]);
  const [recentShipments, setRecentShipments] = useState<Shipment[]>([]);
  const [quickTrackId, setQuickTrackId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      if (import.meta.env.VITE_SUPABASE_URL) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('shipments')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          
          if (data) {
            setAllShipments(data);
            setRecentShipments(data.slice(0, 4));
            localStorage.setItem('mfc_shipments', JSON.stringify(data));
            setIsLoading(false);
            return;
          }
        } else {
          // Fetch all public/guest shipments if in sandbox/guest mode
          const { data, error } = await supabase
            .from('shipments')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (data) {
            setAllShipments(data);
            setRecentShipments(data.slice(0, 4));
            localStorage.setItem('mfc_shipments', JSON.stringify(data));
            setIsLoading(false);
            return;
          }
        }
      }
    } catch (err) {
      console.warn("Error fetching dashboard data from Supabase", err);
    }

    // Fallback
    const saved = localStorage.getItem('mfc_shipments');
    const local = saved ? JSON.parse(saved) : [];
    setAllShipments(local);
    setRecentShipments(local.slice(0, 4));
    setIsLoading(false);
  };

  // Compute metrics dynamically
  const activeCount = allShipments.filter(s => ['Dispatched', 'In Transit', 'Out for Delivery'].includes(s.current_status)).length;
  const pendingCount = allShipments.filter(s => ['Drafts', 'Manifest Created', 'Created', 'Scheduled', 'Pending'].includes(s.current_status)).length;
  const delayedCount = allShipments.filter(s => ['Delayed', 'Exception', 'Exceptions'].includes(s.current_status) || s.current_status.toLowerCase().includes('delay')).length;
  const deliveredCount = allShipments.filter(s => s.current_status === 'Delivered').length;

  const metrics = {
    active: activeCount,
    pending: pendingCount,
    delayed: delayedCount,
    delivered: deliveredCount
  };

  const lastName = mockProfile.full_name.split(' ').pop() || mockProfile.full_name;

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTrackId.trim()) {
      navigate(`/dashboard/track?id=${encodeURIComponent(quickTrackId.trim().toUpperCase())}`);
    }
  };

  const renderMetric = (key: keyof typeof metrics, label: string, icon: React.ReactNode, subtext: string) => (
    <div className={`bg-white border border-gray-200 p-6 shadow-sm rounded-sm hover:border-gray-300 transition-colors relative ${key === 'pending' ? 'border-l-4 border-l-amber-400' : key === 'delayed' ? 'border-l-4 border-l-red-500' : key === 'delivered' ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-blue-500'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">{label}</h3>
        {icon}
      </div>
      <div className="flex items-center space-x-2">
        <p className="text-3xl font-black tracking-tighter text-gray-900">{metrics[key].toLocaleString()}</p>
      </div>
      <p className="text-xs text-gray-500 mt-2 font-medium">{subtext}</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-8 max-w-7xl mx-auto"
    >
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-1">Hello, {lastName}</h1>
          <p className="text-gray-500 text-sm">Welcome back to your MFC Logistics Dashboard. Here is your real-time shipment overview.</p>
        </div>
        <Link to="/dashboard/shipments" className="flex items-center text-xs font-black tracking-widest uppercase text-blue-600 hover:underline">
          View All Shipments <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>

      {/* Empty State Startup Banner */}
      {allShipments.length === 0 && !isLoading && (
        <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-900 mb-1">Logistics Account Active</h3>
            <p className="text-xs text-blue-700">This account has 0 recorded shipments. Go to the Shipment Manager to create a new manifest or populate demo data.</p>
          </div>
          <Link 
            to="/dashboard/shipments" 
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest rounded-sm transition-colors shadow-xs"
          >
            Open Shipment Manager
          </Link>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {renderMetric('active', 'Active Shipments', <Package className="h-5 w-5 text-blue-500" />, 'In transit / Dispatched')}
        {renderMetric('pending', 'Pending Manifests', <Clock className="h-5 w-5 text-amber-500" />, 'Registered / Created')}
        {renderMetric('delayed', 'Delayed exceptions', <AlertCircle className="h-5 w-5 text-red-500" />, 'Requiring intervention')}
        {renderMetric('delivered', 'Delivered Cargo', <CheckCircle2 className="h-5 w-5 text-green-500" />, 'Delivered successfully')}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Recent Updates</h3>
              <button 
                onClick={fetchDashboardData} 
                className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest"
              >
                Refresh
              </button>
            </div>
            <div className="divide-y divide-gray-100 min-h-[160px] flex flex-col">
              {isLoading ? (
                <div className="flex-grow flex items-center justify-center p-12">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                </div>
              ) : recentShipments.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center p-12 text-center">
                  <Package className="h-8 w-8 text-gray-300 mb-2" />
                  <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">No Recent Activity Records</p>
                </div>
              ) : (
                recentShipments.map((shipment) => (
                  <div key={shipment.id} className="p-6 hover:bg-gray-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <Link to={`/dashboard/shipments`} className="font-mono text-sm font-black text-gray-900 hover:text-blue-600 transition-colors">
                          {shipment.tracking_id}
                        </Link>
                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-gray-100 text-gray-800 border border-gray-200 rounded-sm">
                          {shipment.current_status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        <span className="font-bold text-gray-700">To:</span> {shipment.recipient_name} &bull; <span className="font-bold text-gray-700">Dest:</span> {shipment.recipient_address}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest font-black">Last Update</p>
                      <p className="text-xs font-mono text-gray-600 mt-0.5">{new Date(shipment.updated_at).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions & Mini-Track */}
        <div>
          <div className="bg-gray-900 text-white border border-gray-800 shadow-sm p-6 mb-6 rounded-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Quick Track</h3>
            <form className="flex flex-col gap-3" onSubmit={handleQuickTrack}>
              <input 
                type="text" 
                value={quickTrackId}
                onChange={(e) => setQuickTrackId(e.target.value)}
                placeholder="Enter tracking number..." 
                className="w-full px-3 py-3 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono text-sm rounded-sm transition-colors uppercase"
              />
              <button type="submit" className="w-full bg-blue-600 text-white font-bold uppercase tracking-widest text-xs py-3 hover:bg-blue-700 transition-colors rounded-sm">
                Track Shipment
              </button>
            </form>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/dashboard/addresses" className="text-xs font-bold text-gray-600 hover:text-blue-600 transition-colors flex items-center uppercase tracking-widest">
                  <ArrowRight className="h-4 w-4 mr-2 text-gray-400" /> Manage Addresses
                </Link>
              </li>
              <li>
                <Link to="/dashboard/documents" className="text-xs font-bold text-gray-600 hover:text-blue-600 transition-colors flex items-center uppercase tracking-widest">
                  <ArrowRight className="h-4 w-4 mr-2 text-gray-400" /> View Invoices
                </Link>
              </li>
              <li>
                <Link to="/dashboard/support" className="text-xs font-bold text-gray-600 hover:text-blue-600 transition-colors flex items-center uppercase tracking-widest">
                  <ArrowRight className="h-4 w-4 mr-2 text-gray-400" /> Get Help
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
