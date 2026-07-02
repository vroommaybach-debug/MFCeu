import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { mockShipments, mockTrackingEvents } from '../lib/mock-data';
import { Package, Clock, CheckCircle2, AlertCircle, ArrowLeft, Truck, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { Shipment } from '../types';

export const Track = () => {
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get('id');
  const [trackingId, setTrackingId] = useState(queryId || '');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(!!queryId);

  useEffect(() => {
    if (queryId) {
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
      // Check Supabase first if configured
      if (import.meta.env.VITE_SUPABASE_URL) {
        const { data: supabaseShipment, error: fetchError } = await supabase
          .from('shipments')
          .select('*')
          .ilike('tracking_id', cleanId)
          .maybeSingle();

        if (supabaseShipment) {
          setShipment(supabaseShipment);
          // fetch events
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
      console.warn("Supabase fetch failed, falling back to mock data");
    }

    // Fallback to local storage or mock data
    setTimeout(() => {
      const saved = localStorage.getItem('mfc_shipments');
      const allShipments = saved ? JSON.parse(saved) : mockShipments;
      const found = allShipments.find((s: Shipment) => s.tracking_id.toUpperCase() === cleanId);
      if (found) {
        setShipment(found);
        setEvents(mockTrackingEvents[found.id] || []);
      } else {
        setError('Tracking number not found. Please check and try again.');
      }
      setIsLoading(false);
    }, 800);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId) {
      // update URL
      window.history.replaceState(null, '', `?id=${trackingId}`);
      handleSearch(trackingId);
    }
  };

  const timelineSteps = ['Created', 'Dispatched', 'In Transit', 'Out for Delivery', 'Delivered'];
  const getStepIndex = (status: string) => {
    if (status === 'Manifest Created') return 0;
    return timelineSteps.indexOf(status);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 sm:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-8">
          <h1 className="text-2xl font-black tracking-tight text-gray-900 mb-2">Track Shipment</h1>
          <p className="text-gray-500 text-sm mb-6">Enter your tracking number to see real-time updates.</p>
          
          <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="e.g. MFC-1002-8492"
              className="flex-grow px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm bg-gray-50 hover:bg-white transition-all"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
            />
            <button
              type="submit"
              disabled={isLoading || !trackingId.trim()}
              className="px-6 py-3 bg-blue-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-600/20 transition-all"
            >
              {isLoading ? 'Tracking...' : 'Track'}
            </button>
          </form>
        </motion.div>

        {hasSearched && !isLoading && error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-8 rounded-2xl border border-red-100 shadow-sm text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-900 mb-2">Shipment Not Found</h2>
            <p className="text-gray-500 text-sm">{error}</p>
          </motion.div>
        )}

        {hasSearched && !isLoading && shipment && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8 bg-gray-900 text-white flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Tracking ID</p>
                <h2 className="text-2xl font-black tracking-tight font-mono">{shipment.tracking_id}</h2>
              </div>
              <div className="text-right">
                <span className={cn(
                  "px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full",
                  shipment.current_status === 'Delivered' ? "bg-green-500/20 text-green-400" : 
                  shipment.current_status.includes('Transit') ? "bg-blue-500/20 text-blue-400" : "bg-gray-700 text-gray-300"
                )}>
                  {shipment.current_status}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 border-b border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">From</p>
                    <p className="text-sm font-bold text-gray-900">{shipment.sender_name}</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">To</p>
                    <p className="text-sm font-bold text-gray-900">{shipment.recipient_name}</p>
                    <p className="text-sm text-gray-500 mt-1 whitespace-pre-line">{shipment.recipient_address}</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Est. Delivery</p>
                    <p className="text-sm font-bold text-blue-600">{shipment.estimated_delivery || 'Scheduled / Pending'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 border-b border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">Tracking Progress</h3>
              <div className="relative pt-2 max-w-2xl mx-auto">
                <div className="overflow-hidden h-2 mb-6 text-xs flex bg-gray-100 rounded-full">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(getStepIndex(shipment.current_status) / (timelineSteps.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 rounded-full"
                  ></motion.div>
                </div>
                <div className="flex justify-between text-xs font-medium text-gray-400 px-1">
                  {timelineSteps.map((step, idx) => (
                    <div key={step} className={cn("text-center max-w-[80px]", idx <= getStepIndex(shipment.current_status) ? "text-gray-900 font-bold" : "")}>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Tracking History</h3>
              <div className="space-y-0 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                {events.map((event, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={event.id} 
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-gray-900 text-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 border border-gray-100 shadow-sm rounded-xl">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                        <p className="font-bold text-gray-900 text-sm">{event.status}</p>
                        <time className="font-mono text-xs text-gray-500 mt-1 sm:mt-0">{new Date(event.created_at).toLocaleString()}</time>
                      </div>
                      <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="w-3 h-3 mr-1 inline" /> {event.location}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
};
