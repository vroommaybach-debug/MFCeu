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
      if (import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('placeholder') && !import.meta.env.VITE_SUPABASE_URL.includes('test')) {
        const { data: supabaseShipment, error: fetchError } = await supabase
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
        setError('Tracking number not found. Please check and try again.');
      }
      setIsLoading(false);
    }, 800);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId) {
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
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 sm:p-10 border border-slate-200 shadow-sm mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Track Consignment</h1>
          <p className="text-slate-500 text-sm mb-8">Enter tracking reference to access operational status.</p>
          
          <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="e.g. TRK-1002-8492"
              className="flex-grow px-4 py-4 border border-slate-300 rounded-none focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 font-mono text-sm bg-slate-50 hover:bg-white transition-all uppercase"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
            />
            <button
              type="submit"
              disabled={isLoading || !trackingId.trim()}
              className="px-10 py-4 bg-slate-900 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-none hover:bg-slate-800 disabled:opacity-50 transition-all shadow-md shrink-0"
            >
              {isLoading ? 'Querying...' : 'Trace'}
            </button>
          </form>
        </motion.div>

        {hasSearched && !isLoading && error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-10 border border-red-200 shadow-sm text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-slate-900 mb-2">Consignment Not Found</h2>
            <p className="text-slate-500 text-sm">{error}</p>
          </motion.div>
        )}

        {hasSearched && !isLoading && shipment && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white shadow-xl border border-slate-200">
            <div className="p-8 sm:p-10 bg-slate-900 text-white flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Tracking Reference</p>
                <h2 className="text-3xl font-bold tracking-tight font-mono text-white">{shipment.tracking_id}</h2>
              </div>
              <div className="sm:text-right">
                <span className={cn(
                  "px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] inline-block",
                  shipment.current_status === 'Delivered' ? "bg-white text-slate-900" : 
                  shipment.current_status.includes('Transit') ? "bg-slate-700 text-white" : "bg-slate-800 text-slate-300"
                )}>
                  {shipment.current_status}
                </span>
              </div>
            </div>

            <div className="p-8 sm:p-10 border-b border-slate-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <div>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-slate-400 mr-4 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Origin</p>
                    <p className="text-sm font-bold text-slate-900">{shipment.sender_name}</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-slate-400 mr-4 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Destination</p>
                    <p className="text-sm font-bold text-slate-900">{shipment.recipient_name}</p>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed whitespace-pre-line">{shipment.recipient_address}</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-slate-400 mr-4 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Est. Fulfillment</p>
                    <p className="text-sm font-bold text-slate-900">{shipment.estimated_delivery || 'Pending Schedule'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 sm:p-10 border-b border-slate-200">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-10">Transit Progression</h3>
              <div className="relative pt-2 max-w-3xl mx-auto">
                <div className="overflow-hidden h-1 mb-8 text-xs flex bg-slate-100">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(getStepIndex(shipment.current_status) / (timelineSteps.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-slate-900"
                  ></motion.div>
                </div>
                <div className="flex justify-between text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 px-1">
                  {timelineSteps.map((step, idx) => (
                    <div key={step} className={cn("text-center max-w-[80px]", idx <= getStepIndex(shipment.current_status) ? "text-slate-900" : "")}>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 sm:p-10 bg-slate-50">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8">Operational Logs</h3>
              <div className="space-y-0 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {events.map((event, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={event.id} 
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-6"
                  >
                    <div className="flex items-center justify-center w-8 h-8 border border-white bg-slate-900 text-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <div className="w-2 h-2 bg-white rounded-none"></div>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 border border-slate-200 shadow-sm rounded-none hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                        <p className="font-bold text-slate-900 text-sm tracking-tight uppercase">{event.status}</p>
                        <time className="font-mono text-[10px] text-slate-500 tracking-wider mt-1 sm:mt-0">{new Date(event.created_at).toLocaleString()}</time>
                      </div>
                      <p className="text-xs text-slate-600 flex items-center font-mono">
                        <MapPin className="w-3 h-3 mr-2 inline" /> {event.location}
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
