import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mockShipments, mockTrackingEvents } from '../../lib/mock-data';
import { Package, Clock, CheckCircle2, AlertCircle, MapPin, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { Shipment } from '../../types';

export const DashboardTrack = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryId = searchParams.get('id');
  const [trackingId, setTrackingId] = useState(queryId || '');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(!!queryId);

  useEffect(() => {
    if (queryId) {
      setTrackingId(queryId);
      handleSearch(queryId);
    }
  }, [queryId]);

  const handleSearch = async (idToSearch: string) => {
    const cleanId = idToSearch.trim().toUpperCase();
    if (!cleanId) return;
    setIsLoading(true);
    setError('');
    setHasSearched(true);
    setShipment(null);
    setEvents([]);

    try {
      if (import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('placeholder') && !import.meta.env.VITE_SUPABASE_URL.includes('test')) {
        const { data: supabaseShipment } = await supabase
          .from('shipments')
          .select('*')
          .ilike('tracking_id', cleanId)
          .maybeSingle();

        if (supabaseShipment) {
          setShipment(supabaseShipment);
          const { data: supabaseEvents } = await supabase
            .from('tracking_events')
            .select('*')
            .eq('shipment_id', supabaseShipment.id)
            .order('created_at', { ascending: false });
            
          if (supabaseEvents) setEvents(supabaseEvents);
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      console.log("Supabase fallback used");
    }

    setTimeout(() => {
      const saved = localStorage.getItem('mfc_shipments');
      const allShipments = saved ? JSON.parse(saved) : mockShipments;
      const found = allShipments.find((s: Shipment) => s.tracking_id.toUpperCase() === cleanId);
      if (found) {
        setShipment(found);
        setEvents(mockTrackingEvents[found.id] || []);
      } else {
        setError('Tracking number not found. Please verify the tracking ID and try again.');
      }
      setIsLoading(false);
    }, 600);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      setSearchParams({ id: trackingId.trim().toUpperCase() });
    }
  };

  const timelineSteps = ['Created', 'Dispatched', 'In Transit', 'Out for Delivery', 'Delivered'];
  const getStepIndex = (status: string) => {
    if (status === 'Manifest Created') return 0;
    return timelineSteps.indexOf(status);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Global Tracking Portal</h1>
        <p className="text-slate-500 text-sm">Query any active shipment within the Major Freight network directly from your console.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-white p-8 border border-slate-200 shadow-sm mb-12 rounded-none"
      >
        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Enter active tracking ID (e.g. TRK-1002-8492)..."
              className="w-full pl-12 pr-4 py-4 border border-slate-300 focus:outline-none focus:border-slate-900 font-mono text-sm bg-slate-50 hover:bg-white rounded-none transition-colors uppercase"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !trackingId.trim()}
            className="px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-none disabled:opacity-50 transition-colors shrink-0 shadow-sm"
          >
            {isLoading ? 'Retrieving Status...' : 'Query Console'}
          </button>
        </form>
      </motion.div>

      {isLoading && (
        <div className="py-12 flex justify-center items-center">
          <div className="animate-spin rounded-none h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      )}

      {hasSearched && !isLoading && error && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="bg-white p-12 border border-red-200 text-center rounded-none shadow-sm"
        >
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-900 mb-2">Shipment Not Located</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">{error}</p>
        </motion.div>
      )}

      {hasSearched && !isLoading && shipment && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white border border-slate-200 overflow-hidden shadow-md rounded-none"
        >
          <div className="p-8 sm:p-10 bg-slate-900 text-white flex flex-col sm:flex-row justify-between sm:items-center gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Network Manifest Tracking</p>
              <h2 className="text-3xl font-bold tracking-tight font-mono">{shipment.tracking_id}</h2>
            </div>
            <div>
              <span className={cn(
                "px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] border border-transparent inline-block",
                shipment.current_status === 'Delivered' ? "bg-white text-slate-900" : 
                shipment.current_status.includes('Transit') ? "bg-slate-700 text-white" : "bg-slate-800 text-slate-300"
              )}>
                {shipment.current_status}
              </span>
            </div>
          </div>

          <div className="p-8 sm:p-10 border-b border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-slate-400 mr-4 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Consignor (Origin)</p>
                  <p className="text-sm font-bold text-slate-900">{shipment.sender_name}</p>
                  <p className="text-xs text-slate-500 mt-2 whitespace-pre-line">{shipment.sender_address}</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-slate-400 mr-4 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Consignee (Destination)</p>
                  <p className="text-sm font-bold text-slate-900">{shipment.recipient_name}</p>
                  <p className="text-xs text-slate-500 mt-2 whitespace-pre-line">{shipment.recipient_address}</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-slate-400 mr-4 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Estimated Delivery</p>
                  <p className="text-sm font-bold text-slate-900">{shipment.estimated_delivery || 'Scheduled / Pending'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="p-8 sm:p-10 border-b border-slate-200 bg-slate-50/50">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-10">Manifest Progression</h3>
            <div className="relative pt-2 max-w-4xl mx-auto">
              <div className="overflow-hidden h-1 mb-8 text-xs flex bg-slate-200">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(getStepIndex(shipment.current_status) / (timelineSteps.length - 1)) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-slate-900"
                ></motion.div>
              </div>
              <div className="flex justify-between text-[10px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1">
                {timelineSteps.map((step, idx) => (
                  <div key={step} className={cn("text-center max-w-[85px]", idx <= getStepIndex(shipment.current_status) ? "text-slate-900 font-bold" : "")}>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10 bg-white">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8">Real-time Checkpoint History</h3>
            {events.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No checkpoint events recorded yet.</p>
            ) : (
              <div className="space-y-6">
                {events.map((event, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={event.id} 
                    className="flex items-start gap-6 p-6 border border-slate-100 hover:border-slate-200 bg-white shadow-sm rounded-none transition-colors"
                  >
                    <div className="mt-1 h-2.5 w-2.5 bg-slate-900 shrink-0" />
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <h4 className="text-sm font-bold text-slate-900 tracking-tight uppercase">{event.status}</h4>
                        <span className="text-[10px] font-mono tracking-wider text-slate-400">{new Date(event.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-slate-600 font-mono flex items-center">
                        <MapPin className="h-3 w-3 mr-2" /> {event.location}
                      </p>
                      {event.checkpoint_notes && (
                        <p className="text-xs text-slate-600 mt-3 bg-slate-50 p-4 border-l-2 border-slate-300 italic">
                          "{event.checkpoint_notes}"
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
