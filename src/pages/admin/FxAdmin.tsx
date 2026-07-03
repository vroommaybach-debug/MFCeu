import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, Plus, Search, Trash2, PenTool, ArrowLeft, ArrowRight, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { mockShipments, mockTrackingEvents } from '../../lib/mock-data';
import { Shipment, TrackingEvent } from '../../types';
import { supabase } from '../../lib/supabase';

export const FxAdmin = () => {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [events, setEvents] = useState<Record<string, TrackingEvent[]>>({});
  
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [isDbLoading, setIsDbLoading] = useState(false);

  // Load from local storage or mocks
  useEffect(() => {
    const loadData = async () => {
      setIsDbLoading(true);
      try {
        if (import.meta.env.VITE_SUPABASE_URL) {
          // Fetch shipments
          const { data: supabaseShipments, error: shErr } = await supabase
            .from('shipments')
            .select('*')
            .order('created_at', { ascending: false });

          // Fetch tracking events
          const { data: supabaseEvents, error: evErr } = await supabase
            .from('tracking_events')
            .select('*')
            .order('created_at', { ascending: true });

          if (supabaseShipments && supabaseShipments.length > 0) {
            setShipments(supabaseShipments);
            setIsCloudConnected(true);
            localStorage.setItem('mfc_shipments', JSON.stringify(supabaseShipments));

            // Group tracking events by shipment_id
            const groupedEvents: Record<string, TrackingEvent[]> = {};
            if (supabaseEvents) {
              supabaseEvents.forEach(ev => {
                if (!groupedEvents[ev.shipment_id]) {
                  groupedEvents[ev.shipment_id] = [];
                }
                groupedEvents[ev.shipment_id].unshift(ev);
              });
            }
            setEvents(groupedEvents);
            localStorage.setItem('mfc_tracking_events', JSON.stringify(groupedEvents));
            setIsDbLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Supabase load failed in admin console, falling back to local state", err);
      }

      // Local fallback
      const saved = localStorage.getItem('mfc_shipments');
      const allShipments = saved ? JSON.parse(saved) : mockShipments;
      setShipments(allShipments);

      const savedEvents = localStorage.getItem('mfc_tracking_events');
      const allEvents = savedEvents ? JSON.parse(savedEvents) : mockTrackingEvents;
      setEvents(allEvents);
      setIsDbLoading(false);
    };

    loadData();
  }, []);

  const [activeTab, setActiveTab] = useState<'shipments' | 'metrics'>('shipments');
  const [metrics, setMetrics] = useState(() => {
    const saved = localStorage.getItem('mfc_metrics');
    return saved ? JSON.parse(saved) : { active: 1248, pending: 42, delayed: 3, delivered: 8902 };
  });

  const saveShipments = (newShipments: Shipment[]) => {
    setShipments(newShipments);
    localStorage.setItem('mfc_shipments', JSON.stringify(newShipments));
  };

  const saveEvents = (newEvents: Record<string, TrackingEvent[]>) => {
    setEvents(newEvents);
    localStorage.setItem('mfc_tracking_events', JSON.stringify(newEvents));
  };

  const handleMetricChange = (key: string, value: string) => {
    const num = parseInt(value, 10);
    if (isNaN(num)) return;
    const newMetrics = { ...metrics, [key]: num };
    setMetrics(newMetrics);
    localStorage.setItem('mfc_metrics', JSON.stringify(newMetrics));
  };

  // Push all local shipments/mocks to Supabase
  const handlePushToCloud = async () => {
    setIsDbLoading(true);
    try {
      if (import.meta.env.VITE_SUPABASE_URL) {
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user ? user.id : null;

        // Fetch existing shipments
        const { data: existing } = await supabase.from('shipments').select('tracking_id');
        const existingTrackIds = new Set(existing?.map(s => s.tracking_id) || []);

        const shipmentsToInsert = shipments
          .filter(s => !existingTrackIds.has(s.tracking_id))
          .map(s => ({
            id: crypto.randomUUID(),
            user_id: userId,
            tracking_id: s.tracking_id,
            sender_name: s.sender_name,
            sender_address: s.sender_address,
            recipient_name: s.recipient_name,
            recipient_address: s.recipient_address,
            carrier_name: s.carrier_name,
            current_status: s.current_status,
            weight_kg: s.weight_kg,
            estimated_delivery: s.estimated_delivery || 'Scheduled / Pending',
            created_at: s.created_at || new Date().toISOString(),
            updated_at: s.updated_at || new Date().toISOString()
          }));

        if (shipmentsToInsert.length > 0) {
          const { data: inserted, error: insertErr } = await supabase
            .from('shipments')
            .insert(shipmentsToInsert)
            .select();

          if (inserted) {
            const eventsToInsert: any[] = [];
            inserted.forEach(newShip => {
              // Find matching original events
              const originalShip = shipments.find(s => s.tracking_id === newShip.tracking_id);
              if (originalShip) {
                const evs = events[originalShip.id] || [];
                evs.forEach(ev => {
                  eventsToInsert.push({
                    id: crypto.randomUUID(),
                    shipment_id: newShip.id,
                    status: ev.status,
                    location: ev.location,
                    checkpoint_notes: ev.checkpoint_notes || null,
                    created_at: ev.created_at || new Date().toISOString()
                  });
                });
              }
            });

            if (eventsToInsert.length > 0) {
              await supabase.from('tracking_events').insert(eventsToInsert);
            }
            alert(`Successfully pushed ${shipmentsToInsert.length} shipments and their tracking events to Supabase!`);
          }
        } else {
          alert("All current shipments are already synced to Supabase!");
        }

        // Reload from cloud
        const { data: supabaseShipments } = await supabase
          .from('shipments')
          .select('*')
          .order('created_at', { ascending: false });

        const { data: supabaseEvents } = await supabase
          .from('tracking_events')
          .select('*')
          .order('created_at', { ascending: true });

        if (supabaseShipments) {
          setShipments(supabaseShipments);
          const groupedEvents: Record<string, TrackingEvent[]> = {};
          if (supabaseEvents) {
            supabaseEvents.forEach(ev => {
              if (!groupedEvents[ev.shipment_id]) {
                groupedEvents[ev.shipment_id] = [];
              }
              groupedEvents[ev.shipment_id].unshift(ev);
            });
          }
          setEvents(groupedEvents);
          localStorage.setItem('mfc_shipments', JSON.stringify(supabaseShipments));
          localStorage.setItem('mfc_tracking_events', JSON.stringify(groupedEvents));
          setIsCloudConnected(true);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Failed to sync to Supabase. Check console logs.");
    } finally {
      setIsDbLoading(false);
    }
  };

  // Generate US/UK Dummy Tracking Info
  const generateDummyTracking = async (type: 'US' | 'UK', shipmentId: string) => {
    const currentEvents = events[shipmentId] || [];
    let location = '';
    
    if (type === 'US') {
      const cities = ['Los Angeles, CA', 'New York, NY', 'Chicago, IL', 'Miami, FL'];
      location = cities[Math.floor(Math.random() * cities.length)];
    } else {
      const cities = ['London, UK', 'Manchester, UK', 'Birmingham, UK', 'Glasgow, UK'];
      location = cities[Math.floor(Math.random() * cities.length)];
    }

    const newEvent: TrackingEvent = {
      id: crypto.randomUUID(),
      shipment_id: shipmentId,
      status: 'In Transit',
      location: `${location} - Sorting Facility`,
      created_at: new Date().toISOString()
    };

    try {
      if (import.meta.env.VITE_SUPABASE_URL) {
        const { error } = await supabase.from('tracking_events').insert(newEvent);
        if (error) console.error("Error saving event to Supabase:", error);
      }
    } catch (err) {
      console.warn("Supabase event saving failed, writing locally", err);
    }

    saveEvents({ ...events, [shipmentId]: [newEvent, ...currentEvents] });
  };

  const handleUpdateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;

    try {
      if (import.meta.env.VITE_SUPABASE_URL) {
        const { error } = await supabase
          .from('shipments')
          .update({
            tracking_id: selectedShipment.tracking_id,
            current_status: selectedShipment.current_status,
            sender_name: selectedShipment.sender_name,
            sender_address: selectedShipment.sender_address,
            recipient_name: selectedShipment.recipient_name,
            recipient_address: selectedShipment.recipient_address,
            carrier_name: selectedShipment.carrier_name,
            estimated_delivery: selectedShipment.estimated_delivery,
            weight_kg: selectedShipment.weight_kg,
            content_description: selectedShipment.content_description,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedShipment.id);
        if (error) console.error("Error updating shipment on Supabase:", error);
      }
    } catch (err) {
      console.warn("Supabase shipment update failed, writing locally", err);
    }

    const updated = shipments.map(s => s.id === selectedShipment.id ? selectedShipment : s);
    saveShipments(updated);
    setIsEditing(false);
  };

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;
    
    const newId = crypto.randomUUID();
    let loggedInUserId: string | null = null;
    try {
      if (import.meta.env.VITE_SUPABASE_URL) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) loggedInUserId = user.id;
      }
    } catch (err) {
      console.warn(err);
    }

    const newEntry: Shipment = {
      ...selectedShipment,
      id: newId,
      user_id: loggedInUserId || 'local',
      tracking_id: selectedShipment.tracking_id || `MFC-${Math.floor(Math.random() * 1000000)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    try {
      if (import.meta.env.VITE_SUPABASE_URL) {
        const { error } = await supabase.from('shipments').insert(newEntry);
        if (error) console.error("Error inserting shipment on Supabase:", error);
      }
    } catch (err) {
      console.warn("Supabase shipment insertion failed, writing locally", err);
    }

    saveShipments([newEntry, ...shipments]);
    setIsAdding(false);
  };

  const deleteShipment = async (id: string) => {
    if(confirm('Delete this shipment entirely?')) {
      try {
        if (import.meta.env.VITE_SUPABASE_URL) {
          const { error } = await supabase.from('shipments').delete().eq('id', id);
          if (error) console.error("Error deleting shipment on Supabase:", error);
        }
      } catch (err) {
        console.warn("Supabase shipment deletion failed, writing locally", err);
      }
      saveShipments(shipments.filter(s => s.id !== id));
      setSelectedShipment(null);
    }
  };

  const deleteEvent = async (shipmentId: string, eventId: string) => {
    try {
      if (import.meta.env.VITE_SUPABASE_URL) {
        const { error } = await supabase.from('tracking_events').delete().eq('id', eventId);
        if (error) console.error("Error deleting event from Supabase:", error);
      }
    } catch (err) {
      console.warn("Supabase event deletion failed", err);
    }

    const shipmentEvents = events[shipmentId] || [];
    saveEvents({
      ...events,
      [shipmentId]: shipmentEvents.filter(e => e.id !== eventId)
    });
  };

  const addEvent = async (shipmentId: string) => {
    const shipmentEvents = events[shipmentId] || [];
    const newEvent: TrackingEvent = {
      id: crypto.randomUUID(),
      shipment_id: shipmentId,
      status: 'Custom Status',
      location: 'Custom Location',
      created_at: new Date().toISOString()
    };

    try {
      if (import.meta.env.VITE_SUPABASE_URL) {
        const { error } = await supabase.from('tracking_events').insert(newEvent);
        if (error) console.error("Error inserting event on Supabase:", error);
      }
    } catch (err) {
      console.warn("Supabase event insertion failed", err);
    }

    saveEvents({
      ...events,
      [shipmentId]: [newEvent, ...shipmentEvents]
    });
  };

  const updateEvent = async (shipmentId: string, eventId: string, field: keyof TrackingEvent, value: string) => {
    try {
      if (import.meta.env.VITE_SUPABASE_URL) {
        const { error } = await supabase
          .from('tracking_events')
          .update({ [field]: value })
          .eq('id', eventId);
        if (error) console.error("Error updating event field:", error);
      }
    } catch (err) {
      console.warn("Supabase event update failed", err);
    }

    const shipmentEvents = events[shipmentId] || [];
    saveEvents({
      ...events,
      [shipmentId]: shipmentEvents.map(e => e.id === eventId ? { ...e, [field]: value } : e)
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Admin Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-50">
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-500" />
              <h1 className="text-xl font-black tracking-widest uppercase">FX-Admin<span className="text-blue-500">_Console</span></h1>
            </div>
          </div>
          {/* Mobile Badge */}
          <div className="sm:hidden">
            {isCloudConnected ? (
              <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">● Cloud Active</span>
            ) : (
              <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">● Local Sandbox</span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          {/* Desktop Badge & Sync Button */}
          <div className="hidden sm:flex items-center gap-3">
            {isCloudConnected ? (
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">● Cloud Active</span>
                <button 
                  onClick={handlePushToCloud}
                  disabled={isDbLoading}
                  className="px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:border-blue-500/50 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all"
                >
                  {isDbLoading ? 'Syncing...' : 'Sync to Cloud'}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">● Local Sandbox</span>
                {import.meta.env.VITE_SUPABASE_URL && (
                  <button 
                    onClick={handlePushToCloud}
                    disabled={isDbLoading}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-sm transition-all"
                  >
                    Connect & Push to Cloud
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <button 
              onClick={() => setActiveTab('shipments')} 
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors ${activeTab === 'shipments' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              Data Control
            </button>
            <button 
              onClick={() => setActiveTab('metrics')} 
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors ${activeTab === 'metrics' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              Metrics & Balance
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto flex gap-6 h-[calc(100vh-80px)]">
        {activeTab === 'metrics' ? (
          <div className="w-full max-w-2xl mx-auto space-y-6 overflow-y-auto pr-2">
            <div className="bg-gray-800 p-6 rounded-sm border border-gray-700">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Dashboard KPI Overrides</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(metrics).map(key => (
                  <div key={key}>
                    <label className="block text-xs uppercase text-gray-500 mb-1">{key} Count</label>
                    <input 
                      type="number" 
                      value={metrics[key]} 
                      onChange={(e) => handleMetricChange(key, e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 px-3 py-2 text-white focus:border-blue-500 outline-none rounded-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Left Sidebar - List */}
            <div className="w-1/3 flex flex-col bg-gray-800 border border-gray-700 rounded-sm overflow-hidden">
              <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800">
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">KnowledgeBase</h2>
                <button onClick={() => {
                  setSelectedShipment({
                    id: '', user_id: 'local', tracking_id: '', recipient_name: '', recipient_address: '', 
                    sender_name: '', sender_address: '', carrier_name: 'MFC Direct', current_status: 'Manifest Created', 
                    weight_kg: 0, content_description: '', estimated_delivery: '', created_at: '', updated_at: ''
                  });
                  setIsAdding(true);
                  setIsEditing(false);
                }} className="p-1 hover:bg-gray-700 rounded-sm text-blue-500 transition-colors">
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {shipments.map(s => (
                  <div 
                    key={s.id} 
                    onClick={() => { setSelectedShipment(s); setIsEditing(false); setIsAdding(false); }}
                    className={`p-4 border-b border-gray-700 cursor-pointer transition-colors ${selectedShipment?.id === s.id ? 'bg-blue-900/30 border-l-2 border-l-blue-500' : 'hover:bg-gray-700'}`}
                  >
                    <div className="font-mono text-sm font-bold">{s.tracking_id}</div>
                    <div className="text-xs text-gray-400 mt-1">{s.recipient_name} &bull; {s.current_status}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Editor */}
            <div className="w-2/3 flex flex-col bg-gray-800 border border-gray-700 rounded-sm overflow-y-auto">
              {selectedShipment && (isAdding || isEditing) ? (
                <form onSubmit={isAdding ? handleCreateShipment : handleUpdateShipment} className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold uppercase tracking-widest text-white">{isAdding ? 'Create Ghost Shipment' : 'Edit Shipment Record'}</h2>
                    <div className="space-x-3">
                      <button type="button" onClick={() => { setIsEditing(false); setIsAdding(false); }} className="text-sm text-gray-400 hover:text-white uppercase tracking-widest font-bold">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-colors">Save</button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase text-gray-500 mb-1">Tracking ID</label>
                      <input type="text" value={selectedShipment.tracking_id} onChange={(e) => setSelectedShipment({...selectedShipment, tracking_id: e.target.value})} className="w-full bg-gray-900 border border-gray-700 px-3 py-2 text-white focus:border-blue-500 outline-none rounded-sm font-mono" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-500 mb-1">Status Override</label>
                      <input type="text" value={selectedShipment.current_status} onChange={(e) => setSelectedShipment({...selectedShipment, current_status: e.target.value})} className="w-full bg-gray-900 border border-gray-700 px-3 py-2 text-white focus:border-blue-500 outline-none rounded-sm" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-500 mb-1">Sender</label>
                      <input type="text" value={selectedShipment.sender_name} onChange={(e) => setSelectedShipment({...selectedShipment, sender_name: e.target.value})} className="w-full bg-gray-900 border border-gray-700 px-3 py-2 text-white focus:border-blue-500 outline-none rounded-sm" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-500 mb-1">Carrier</label>
                      <input type="text" value={selectedShipment.carrier_name} onChange={(e) => setSelectedShipment({...selectedShipment, carrier_name: e.target.value as any})} className="w-full bg-gray-900 border border-gray-700 px-3 py-2 text-white focus:border-blue-500 outline-none rounded-sm" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-500 mb-1">Consignee Name</label>
                      <input type="text" value={selectedShipment.recipient_name} onChange={(e) => setSelectedShipment({...selectedShipment, recipient_name: e.target.value})} className="w-full bg-gray-900 border border-gray-700 px-3 py-2 text-white focus:border-blue-500 outline-none rounded-sm" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-500 mb-1">Consignee Address</label>
                      <input type="text" value={selectedShipment.recipient_address} onChange={(e) => setSelectedShipment({...selectedShipment, recipient_address: e.target.value})} className="w-full bg-gray-900 border border-gray-700 px-3 py-2 text-white focus:border-blue-500 outline-none rounded-sm" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-500 mb-1">Estimated Delivery Date</label>
                      <input type="text" placeholder="e.g. July 15, 2026 or Pending" value={selectedShipment.estimated_delivery || ''} onChange={(e) => setSelectedShipment({...selectedShipment, estimated_delivery: e.target.value})} className="w-full bg-gray-900 border border-gray-700 px-3 py-2 text-white focus:border-blue-500 outline-none rounded-sm" />
                    </div>
                  </div>
                </form>
              ) : selectedShipment ? (
                <div className="p-6">
                  <div className="flex items-start justify-between mb-8 border-b border-gray-700 pb-4">
                    <div>
                      <h2 className="text-2xl font-mono font-bold tracking-tight text-white mb-1">{selectedShipment.tracking_id}</h2>
                      <p className="text-sm text-gray-400">Master Record View &bull; Est. Delivery: <span className="text-blue-400 font-mono font-semibold">{selectedShipment.estimated_delivery || 'Not Set'}</span></p>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => setIsEditing(true)} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-sm transition-colors text-white" title="Edit Master Record"><PenTool className="h-4 w-4" /></button>
                      <button onClick={() => deleteShipment(selectedShipment.id)} className="p-2 bg-red-900/30 hover:bg-red-900/50 text-red-500 rounded-sm transition-colors" title="Delete Entire Record"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>

                  <div className="mb-6 flex justify-between items-center">
                     <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Tracking Event Matrix</h3>
                     <div className="space-x-2">
                       <button onClick={() => generateDummyTracking('US', selectedShipment.id)} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-xs font-bold uppercase tracking-widest rounded-sm text-gray-300">+ US Node</button>
                       <button onClick={() => generateDummyTracking('UK', selectedShipment.id)} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-xs font-bold uppercase tracking-widest rounded-sm text-gray-300">+ UK Node</button>
                       <button onClick={() => addEvent(selectedShipment.id)} className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-xs font-bold uppercase tracking-widest rounded-sm text-white">+ Manual Node</button>
                     </div>
                  </div>

                  <div className="space-y-4">
                    {(events[selectedShipment.id] || []).map(event => (
                      <div key={event.id} className="bg-gray-900 border border-gray-700 p-4 rounded-sm flex gap-4 items-start relative group">
                        <button onClick={() => deleteEvent(selectedShipment.id, event.id)} className="absolute top-2 right-2 p-1 text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="h-4 w-4" /></button>
                        <div className="grid grid-cols-2 gap-4 flex-1 pr-6">
                          <div>
                            <label className="block text-[10px] uppercase text-gray-500 mb-1">Timestamp</label>
                            <input type="text" value={event.created_at} onChange={(e) => updateEvent(selectedShipment.id, event.id, 'created_at', e.target.value)} className="w-full bg-gray-800 border border-gray-700 px-2 py-1 text-xs text-white focus:border-blue-500 outline-none rounded-sm font-mono" />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase text-gray-500 mb-1">Status Name</label>
                            <input type="text" value={event.status} onChange={(e) => updateEvent(selectedShipment.id, event.id, 'status', e.target.value)} className="w-full bg-gray-800 border border-gray-700 px-2 py-1 text-xs text-white focus:border-blue-500 outline-none rounded-sm" />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[10px] uppercase text-gray-500 mb-1">Location / Coordinates</label>
                            <input type="text" value={event.location} onChange={(e) => updateEvent(selectedShipment.id, event.id, 'location', e.target.value)} className="w-full bg-gray-800 border border-gray-700 px-2 py-1 text-xs text-white focus:border-blue-500 outline-none rounded-sm" />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[10px] uppercase text-gray-500 mb-1">Agent Notes (Optional)</label>
                            <input type="text" value={event.checkpoint_notes || ''} onChange={(e) => updateEvent(selectedShipment.id, event.id, 'checkpoint_notes', e.target.value)} className="w-full bg-gray-800 border border-gray-700 px-2 py-1 text-xs text-white focus:border-blue-500 outline-none rounded-sm" placeholder="Add custom agent notes" />
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!events[selectedShipment.id] || events[selectedShipment.id].length === 0) && (
                      <div className="p-8 text-center border border-dashed border-gray-700 rounded-sm">
                        <p className="text-gray-500 text-sm font-mono">No tracking matrix data available. Inject nodes above.</p>
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Search className="h-8 w-8 mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-mono uppercase tracking-widest">Select record to inject data</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
