import React, { useState, useEffect } from 'react';
import { Package, AlertCircle, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { mockShipments, mockProfile } from '../../lib/mock-data';
import { motion } from 'motion/react';
import { Shipment } from '../../types';
import { supabase } from '../../lib/supabase';

export const Overview = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(() => {
    const saved = localStorage.getItem('mfc_metrics');
    return saved ? JSON.parse(saved) : {
      active: 1248,
      pending: 42,
      delayed: 3,
      delivered: 8902
    };
  });

  const [recentShipments, setRecentShipments] = useState<Shipment[]>([]);
  const [quickTrackId, setQuickTrackId] = useState('');

  useEffect(() => {
    const fetchRecentShipments = async () => {
      try {
        if (import.meta.env.VITE_SUPABASE_URL) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data, error } = await supabase
              .from('shipments')
              .select('*')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
              .limit(4);
            
            if (data && data.length > 0) {
              setRecentShipments(data);
              return;
            }
          }
        }
      } catch (err) {
        console.warn("Error fetching recent shipments from Supabase", err);
      }

      // Fallback
      const saved = localStorage.getItem('mfc_shipments');
      const allShipments = saved ? JSON.parse(saved) : mockShipments;
      setRecentShipments(allShipments.slice(0, 4));
    };

    fetchRecentShipments();
  }, []);

  const lastName = mockProfile.full_name.split(' ').pop() || mockProfile.full_name;

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTrackId.trim()) {
      navigate(`/dashboard/track?id=${encodeURIComponent(quickTrackId.trim())}`);
    }
  };

  const renderMetric = (key: keyof typeof metrics, label: string, icon: React.ReactNode, subtext: string) => (
    <div className={`bg-white border border-gray-200 p-6 shadow-sm rounded-sm hover:border-gray-300 transition-colors relative ${key === 'pending' ? 'border-l-4 border-l-amber-400' : key === 'delayed' ? 'border-l-4 border-l-red-500' : key === 'delivered' ? 'border-l-4 border-l-green-500' : ''}`}>
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
      className="p-8 max-w-7xl mx-auto"
    >
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-1">Hello, {lastName}</h1>
          <p className="text-gray-500 text-sm">Welcome back to your MFC Logistics Dashboard. Here is your quick shipment overview.</p>
        </div>
        <Link to="/dashboard/shipments" className="hidden sm:flex items-center text-sm font-bold tracking-widest uppercase text-blue-600 hover:underline">
          View All Shipments <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {renderMetric('active', 'Active Shipments', <Package className="h-5 w-5 text-blue-500" />, '+12% from last week')}
        {renderMetric('pending', 'Pending Actions', <Clock className="h-5 w-5 text-amber-500" />, 'Needs your attention')}
        {renderMetric('delayed', 'Delayed', <AlertCircle className="h-5 w-5 text-red-500" />, 'Requires immediate attention')}
        {renderMetric('delivered', 'Delivered', <CheckCircle2 className="h-5 w-5 text-green-500" />, 'In the last 30 days')}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Recent Updates</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {recentShipments.map((shipment) => (
                <div key={shipment.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <Link to={`/dashboard/shipments`} className="font-mono text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors">
                        {shipment.tracking_id}
                      </Link>
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-gray-100 text-gray-800 border border-gray-200 rounded-sm">
                        {shipment.current_status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      <span className="font-semibold text-gray-700">To:</span> {shipment.recipient_name} &bull; <span className="font-semibold text-gray-700">Dest:</span> {shipment.recipient_address.split('\n')[1] || shipment.recipient_address}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">Last Update</p>
                    <p className="text-sm text-gray-900">{new Date(shipment.updated_at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
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
                className="w-full px-3 py-3 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono text-sm rounded-sm transition-colors"
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
                <Link to="/dashboard/addresses" className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2 text-gray-400" /> Manage Addresses
                </Link>
              </li>
              <li>
                <Link to="/dashboard/documents" className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2 text-gray-400" /> View Invoices
                </Link>
              </li>
              <li>
                <Link to="/dashboard/support" className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center">
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
