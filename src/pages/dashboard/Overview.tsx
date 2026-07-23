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
      if (import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('placeholder') && !import.meta.env.VITE_SUPABASE_URL.includes('test')) {
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
      console.log("Supabase fallback used");
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
    <div className={`bg-white border border-slate-200 p-8 shadow-sm hover:border-slate-300 transition-colors relative ${key === 'pending' ? 'border-t-4 border-t-amber-400' : key === 'delayed' ? 'border-t-4 border-t-red-500' : key === 'delivered' ? 'border-t-4 border-t-green-500' : 'border-t-4 border-t-slate-900'}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{label}</h3>
        {icon}
      </div>
      <div className="flex items-center space-x-2">
        <p className="text-4xl font-bold tracking-tighter text-slate-900">{metrics[key].toLocaleString()}</p>
      </div>
      <p className="text-xs text-slate-500 mt-4 font-medium">{subtext}</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-8 max-w-7xl mx-auto font-sans"
    >
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Hello, {lastName}</h1>
          <p className="text-slate-500 text-sm">Welcome back to your MFC Logistics Dashboard. Here is your real-time shipment overview.</p>
        </div>
        <Link to="/dashboard/shipments" className="flex items-center text-[10px] font-bold tracking-[0.2em] uppercase text-slate-900 hover:text-slate-700 transition-colors">
          View All Shipments <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>

      {/* Empty State Startup Banner */}
      {allShipments.length === 0 && !isLoading && (
        <div className="mb-10 p-8 bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 mb-2">Logistics Account Active</h3>
            <p className="text-sm text-slate-600">This account has 0 recorded shipments. Go to the Shipment Manager to create a new manifest or populate demo data.</p>
          </div>
          <Link 
            to="/dashboard/shipments" 
            className="inline-flex items-center justify-center px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-colors shadow-sm shrink-0"
          >
            Open Shipment Manager
          </Link>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {renderMetric('active', 'Active Shipments', <Package className="h-5 w-5 text-slate-900" />, 'In transit / Dispatched')}
        {renderMetric('pending', 'Pending Manifests', <Clock className="h-5 w-5 text-amber-500" />, 'Registered / Created')}
        {renderMetric('delayed', 'Delayed exceptions', <AlertCircle className="h-5 w-5 text-red-500" />, 'Requiring intervention')}
        {renderMetric('delivered', 'Delivered Cargo', <CheckCircle2 className="h-5 w-5 text-green-500" />, 'Delivered successfully')}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">Recent Updates</h3>
              <button 
                onClick={fetchDashboardData} 
                className="text-[10px] font-bold text-slate-600 hover:text-slate-900 transition-colors uppercase tracking-[0.2em]"
              >
                Refresh
              </button>
            </div>
            <div className="divide-y divide-slate-100 min-h-[160px] flex flex-col">
              {isLoading ? (
                <div className="flex-grow flex items-center justify-center p-12">
                  <div className="animate-spin h-6 w-6 border-b-2 border-slate-900"></div>
                </div>
              ) : recentShipments.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center p-12 text-center">
                  <Package className="h-8 w-8 text-slate-300 mb-4" />
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.2em]">No Recent Activity Records</p>
                </div>
              ) : (
                recentShipments.map((shipment) => (
                  <div key={shipment.id} className="p-8 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <Link to={`/dashboard/shipments`} className="font-mono text-sm font-bold text-slate-900 hover:underline transition-all">
                          {shipment.tracking_id}
                        </Link>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 bg-white border border-slate-200 text-slate-700">
                          {shipment.current_status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono">
                        <span className="font-bold text-slate-700">TO:</span> {shipment.recipient_name} &bull; <span className="font-bold text-slate-700">DEST:</span> {shipment.recipient_address}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.2em] font-bold">Last Update</p>
                      <p className="text-xs font-mono text-slate-600 mt-1">{new Date(shipment.updated_at).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions & Mini-Track */}
        <div>
          <div className="bg-slate-900 text-white border border-slate-800 shadow-sm p-8 mb-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6 text-slate-300">Quick Track</h3>
            <form className="flex flex-col gap-4" onSubmit={handleQuickTrack}>
              <input 
                type="text" 
                value={quickTrackId}
                onChange={(e) => setQuickTrackId(e.target.value)}
                placeholder="Enter tracking number..." 
                className="w-full px-4 py-4 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-white font-mono text-sm transition-colors uppercase"
              />
              <button type="submit" className="w-full bg-white text-slate-900 font-bold uppercase tracking-[0.2em] text-[10px] py-4 hover:bg-slate-100 transition-colors shadow-sm">
                Trace Origin
              </button>
            </form>
          </div>

          <div className="bg-white border border-slate-200 shadow-sm p-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/dashboard/addresses" className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors flex items-center uppercase tracking-[0.2em]">
                  <ArrowRight className="h-4 w-4 mr-3 text-slate-400" /> Manage Addresses
                </Link>
              </li>
              <li>
                <Link to="/dashboard/documents" className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors flex items-center uppercase tracking-[0.2em]">
                  <ArrowRight className="h-4 w-4 mr-3 text-slate-400" /> View Invoices
                </Link>
              </li>
              <li>
                <Link to="/dashboard/support" className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors flex items-center uppercase tracking-[0.2em]">
                  <ArrowRight className="h-4 w-4 mr-3 text-slate-400" /> Get Help
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
