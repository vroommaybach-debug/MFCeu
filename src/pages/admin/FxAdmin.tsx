import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, Plus, Search, Trash2, PenTool, ArrowLeft, ArrowRight, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { mockShipments, mockTrackingEvents } from '../../lib/mock-data';
import { Shipment, TrackingEvent } from '../../types';

export const FxAdmin = () => {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [events, setEvents] = useState<Record<string, TrackingEvent[]>>({});
  
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Load from local storage or mocks
  useEffect(() => {
    const saved = localStorage.getItem('mfc_shipments');
    const allShipments = saved ? JSON.parse(saved) : mockShipments;
    setShipments(allShipments);

    const savedEvents = localStorage.getItem('mfc_tracking_events');
    const allEvents = savedEvents ? JSON.parse(savedEvents) : mockTrackingEvents;
    setEvents(allEvents);
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

  // Generate US/UK Dummy Tracking Info
  const generateDummyTracking = (type: 'US' | 'UK', shipmentId: string) => {
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

    saveEvents({ ...events, [shipmentId]: [newEvent, ...currentEvents] });
  };

  const handleUpdateShipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;
    const updated = shipments.map(s => s.id === selectedShipment.id ? selectedShipment : s);
    saveShipments(updated);
    setIsEditing(false);
  };

  const handleCreateShipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;
    
    const newEntry: Shipment = {
      ...selectedShipment,
      id: crypto.randomUUID(),
      tracking_id: `MFC-${Math.floor(Math.random() * 1000000)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    saveShipments([newEntry, ...shipments]);
    setIsAdding(false);
  };

  const deleteShipment = (id: string) => {
    if(confirm('Delete this shipment entirely?')) {
      saveShipments(shipments.filter(s => s.id !== id));
      setSelectedShipment(null);
    }
  };

  const deleteEvent = (shipmentId: string, eventId: string) => {
    const shipmentEvents = events[shipmentId] || [];
    saveEvents({
      ...events,
      [shipmentId]: shipmentEvents.filter(e => e.id !== eventId)
    });
  };

  const addEvent = (shipmentId: string) => {
    const shipmentEvents = events[shipmentId] || [];
    const newEvent: TrackingEvent = {
      id: crypto.randomUUID(),
      shipment_id: shipmentId,
      status: 'Custom Status',
      location: 'Custom Location',
      created_at: new Date().toISOString()
    };
    saveEvents({
      ...events,
      [shipmentId]: [newEvent, ...shipmentEvents]
    });
  };

  const updateEvent = (shipmentId: string, eventId: string, field: keyof TrackingEvent, value: string) => {
    const shipmentEvents = events[shipmentId] || [];
    saveEvents({
      ...events,
      [shipmentId]: shipmentEvents.map(e => e.id === eventId ? { ...e, [field]: value } : e)
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Admin Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-500" />
            <h1 className="text-xl font-black tracking-widest uppercase">FX-Admin<span className="text-blue-500">_Console</span></h1>
          </div>
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
                    weight_kg: 0, content_description: '', created_at: '', updated_at: ''
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
                  </div>
                </form>
              ) : selectedShipment ? (
                <div className="p-6">
                  <div className="flex items-start justify-between mb-8 border-b border-gray-700 pb-4">
                    <div>
                      <h2 className="text-2xl font-mono font-bold tracking-tight text-white mb-1">{selectedShipment.tracking_id}</h2>
                      <p className="text-sm text-gray-400">Master Record View</p>
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
