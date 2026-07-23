import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockShipments, mockTrackingEvents } from '../../lib/mock-data';
import { Shipment, TrackingEvent } from '../../types';
import { WaybillDocument } from '../../components/WaybillDocument';
import { Download, Camera, PenTool, CheckCircle2, Search, FileText, ArrowLeft, Plus, Trash2, ShieldAlert, RefreshCw, X, Edit3 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../lib/supabase';

export const Shipments = () => {
  const [editMode, setEditMode] = useState(() => localStorage.getItem('mfc_admin_mode') === 'true');
  const navigate = useNavigate();

  const handleToggleEditMode = () => {
    const nextMode = !editMode;
    setEditMode(nextMode);
    localStorage.setItem('mfc_admin_mode', String(nextMode));
  };

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<TrackingEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'All' | 'Drafts' | 'In-Transit' | 'Exceptions' | 'Delivered'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Shipment Creation Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTrackingId, setNewTrackingId] = useState('');
  const [newSenderName, setNewSenderName] = useState('');
  const [newSenderAddress, setNewSenderAddress] = useState('');
  const [newRecipientName, setNewRecipientName] = useState('');
  const [newRecipientAddress, setNewRecipientAddress] = useState('');
  const [newCarrierName, setNewCarrierName] = useState('MFC Express');
  const [newStatus, setNewStatus] = useState('Manifest Created');
  const [newWeight, setNewWeight] = useState('1.5');
  const [newEstDelivery, setNewEstDelivery] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Add Event State
  const [newEventStatus, setNewEventStatus] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventNotes, setNewEventNotes] = useState('');

  useEffect(() => {
    fetchShipments();
  }, []);

  useEffect(() => {
    if (selectedShipment) {
      fetchTrackingEvents(selectedShipment.id);
    }
  }, [selectedShipment]);

  const fetchShipments = async () => {
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
            setShipments(data);
            localStorage.setItem('mfc_shipments', JSON.stringify(data));
            setIsLoading(false);
            return;
          }
        } else {
          // If no logged in user but we have Supabase, we can fetch all public/sandbox shipments
          const { data, error } = await supabase
            .from('shipments')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (data) {
            setShipments(data);
            localStorage.setItem('mfc_shipments', JSON.stringify(data));
            setIsLoading(false);
            return;
          }
        }
      }
    } catch (e) {
      console.log("Supabase fallback used");
    }

    const saved = localStorage.getItem('mfc_shipments');
    setShipments(saved ? JSON.parse(saved) : []);
    setIsLoading(false);
  };

  const fetchTrackingEvents = async (shipmentId: string) => {
    try {
      if (import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('placeholder') && !import.meta.env.VITE_SUPABASE_URL.includes('test')) {
        const { data, error } = await supabase
          .from('tracking_events')
          .select('*')
          .eq('shipment_id', shipmentId)
          .order('created_at', { ascending: false });
        if (data) {
          setSelectedEvents(data);
          return;
        }
      }
    } catch (e) {
      console.log("Supabase fallback used");
    }

    const savedEvents = localStorage.getItem('mfc_tracking_events');
    const grouped = savedEvents ? JSON.parse(savedEvents) : mockTrackingEvents;
    setSelectedEvents(grouped[shipmentId] || []);
  };

  // Seed Mock Data Manually
  const handleSeedDemoData = async () => {
    setIsLoading(true);
    try {
      let userId: string | null = null;
      if (import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('placeholder') && !import.meta.env.VITE_SUPABASE_URL.includes('test')) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) userId = user.id;
      }

      const seededShipments = mockShipments.map(s => ({
        id: crypto.randomUUID(),
        user_id: userId || null,
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

      if (import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('placeholder') && !import.meta.env.VITE_SUPABASE_URL.includes('test')) {
        // Upsert shipments to Supabase to handle existing tracking ID constraints cleanly
        const { data: insertedShipments, error: insertErr } = await supabase
          .from('shipments')
          .upsert(seededShipments, { onConflict: 'tracking_id' })
          .select();

        if (insertedShipments && insertedShipments.length > 0) {
          const eventsToInsert: any[] = [];
          insertedShipments.forEach((newShip: any) => {
            const originalMock = mockShipments.find(s => s.tracking_id === newShip.tracking_id);
            if (originalMock) {
              const mockEvs = mockTrackingEvents[originalMock.id] || [];
              mockEvs.forEach(ev => {
                eventsToInsert.push({
                  id: crypto.randomUUID(),
                  shipment_id: newShip.id,
                  status: ev.status,
                  location: ev.location,
                  checkpoint_notes: ev.checkpoint_notes || null,
                  created_at: ev.created_at
                });
              });
            }
          });

          if (eventsToInsert.length > 0) {
            // Delete old events for these exact shipments to prevent duplications
            const shipmentIds = insertedShipments.map((s: any) => s.id);
            await supabase.from('tracking_events').delete().in('shipment_id', shipmentIds);
            await supabase.from('tracking_events').insert(eventsToInsert);
          }

          setShipments(insertedShipments);
          localStorage.setItem('mfc_shipments', JSON.stringify(insertedShipments));
          alert("Demo manifests successfully seeded to your database!");
          setIsLoading(false);
          return;
        } else if (insertErr) {
          console.log("Supabase error handled");
        }
      }
    } catch (err) {
      console.log("Supabase error handled");
    }

    // Local Fallback
    setShipments(mockShipments);
    localStorage.setItem('mfc_shipments', JSON.stringify(mockShipments));
    localStorage.setItem('mfc_tracking_events', JSON.stringify(mockTrackingEvents));
    alert("Demo manifests successfully imported to local storage (Sandbox Mode)!");
    setIsLoading(false);
  };

  // Clear All Shipments
  const handleClearAllShipments = async () => {
    if (!confirm("Are you sure you want to delete ALL shipments from your database/session? This cannot be undone.")) {
      return;
    }
    setIsLoading(true);
    try {
      if (import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('placeholder') && !import.meta.env.VITE_SUPABASE_URL.includes('test')) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from('shipments')
            .delete()
            .eq('user_id', user.id);
          
          if (error) {
            console.log("Supabase error handled");
          }
        } else {
          // If in guest/sandbox mode, clear all shipments where user_id is null
          const { error } = await supabase
            .from('shipments')
            .delete()
            .is('user_id', null);
          if (error) {
            console.log("Supabase error handled");
          }
        }
      }
    } catch (e) {
      console.log("Supabase fallback used");
    }

    setShipments([]);
    setSelectedShipment(null);
    setSelectedEvents([]);
    localStorage.setItem('mfc_shipments', '[]');
    localStorage.setItem('mfc_tracking_events', '{}');
    alert("Database cleared successfully. Starting with 0 records.");
    setIsLoading(false);
  };

  // Create Shipment Form Submit
  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSenderName || !newRecipientName || !newRecipientAddress) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    const generatedId = newTrackingId.trim() || `MFC-${Math.floor(100000 + Math.random() * 900000)}`;
    const newId = crypto.randomUUID();

    let userId: string | null = null;
    try {
      if (import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('placeholder') && !import.meta.env.VITE_SUPABASE_URL.includes('test')) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) userId = user.id;
      }
    } catch (err) {
      console.log("Supabase fallback used");
    }

    const newShipment: Shipment = {
      id: newId,
      user_id: userId || null,
      tracking_id: generatedId,
      sender_name: newSenderName,
      sender_address: newSenderAddress || 'MFC Dispatch Hub',
      recipient_name: newRecipientName,
      recipient_address: newRecipientAddress,
      carrier_name: newCarrierName,
      current_status: newStatus,
      weight_kg: parseFloat(newWeight) || 1.5,
      estimated_delivery: newEstDelivery || '3-5 Business Days',
      content_description: newDescription || 'Standard Logistics Cargo',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const initialEvent: TrackingEvent = {
      id: crypto.randomUUID(),
      shipment_id: newId,
      status: newStatus,
      location: newSenderAddress || 'MFC Dispatch Hub',
      checkpoint_notes: 'Electronic shipping info received. Logistics manifest created.',
      created_at: new Date().toISOString()
    };

    try {
      if (import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('placeholder') && !import.meta.env.VITE_SUPABASE_URL.includes('test')) {
        // Insert to Supabase (supported for both guest and authenticated users)
        const { error: sErr } = await supabase.from('shipments').insert(newShipment);
        if (!sErr) {
          const { error: eErr } = await supabase.from('tracking_events').insert(initialEvent);
          if (eErr) {
            console.log("Supabase error handled");
          }
        } else {
          console.log("Supabase error handled");
        }
      }
    } catch (err) {
      console.log("Supabase fallback used");
    }

    // Save locally
    const updatedShipments = [newShipment, ...shipments];
    setShipments(updatedShipments);
    localStorage.setItem('mfc_shipments', JSON.stringify(updatedShipments));

    const savedEvents = localStorage.getItem('mfc_tracking_events');
    const groupedEvents = savedEvents ? JSON.parse(savedEvents) : {};
    groupedEvents[newId] = [initialEvent];
    localStorage.setItem('mfc_tracking_events', JSON.stringify(groupedEvents));

    // Reset Form & Close
    setIsCreateModalOpen(false);
    setNewTrackingId('');
    setNewSenderName('');
    setNewSenderAddress('');
    setNewRecipientName('');
    setNewRecipientAddress('');
    setNewCarrierName('MFC Express');
    setNewStatus('Manifest Created');
    setNewWeight('1.5');
    setNewEstDelivery('');
    setNewDescription('');

    alert(`Logistics Manifest ${generatedId} created successfully!`);
    setIsLoading(false);
  };

  // Add Checkpoint Event
  const handleAddCheckpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment || !newEventStatus || !newEventLocation) {
      alert("Please provide Status and Location for the new checkpoint.");
      return;
    }

    const eventId = crypto.randomUUID();
    const newEv: TrackingEvent = {
      id: eventId,
      shipment_id: selectedShipment.id,
      status: newEventStatus,
      location: newEventLocation,
      checkpoint_notes: newEventNotes || null,
      created_at: new Date().toISOString()
    };

    try {
      if (import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('placeholder') && !import.meta.env.VITE_SUPABASE_URL.includes('test')) {
        const { error } = await supabase.from('tracking_events').insert(newEv);
        if (error) console.log("Supabase error handled");
      }
    } catch (e) {
      console.log("Supabase fallback used");
    }

    // Update locally
    const updatedEvents = [newEv, ...selectedEvents];
    setSelectedEvents(updatedEvents);

    const savedEvents = localStorage.getItem('mfc_tracking_events');
    const grouped = savedEvents ? JSON.parse(savedEvents) : {};
    grouped[selectedShipment.id] = updatedEvents;
    localStorage.setItem('mfc_tracking_events', JSON.stringify(grouped));

    // Update shipment last status & timestamp
    const updatedShipment = {
      ...selectedShipment,
      current_status: newEventStatus,
      updated_at: new Date().toISOString()
    };
    setSelectedShipment(updatedShipment);

    try {
      if (import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('placeholder') && !import.meta.env.VITE_SUPABASE_URL.includes('test')) {
        await supabase
          .from('shipments')
          .update({ current_status: newEventStatus, updated_at: new Date().toISOString() })
          .eq('id', selectedShipment.id);
      }
    } catch (err) {
      console.log("Supabase fallback used");
    }

    const updatedShipments = shipments.map(s => s.id === selectedShipment.id ? updatedShipment : s);
    setShipments(updatedShipments);
    localStorage.setItem('mfc_shipments', JSON.stringify(updatedShipments));

    // Reset Inputs
    setNewEventStatus('');
    setNewEventLocation('');
    setNewEventNotes('');
  };

  // Update Shipment Status directly
  const handleUpdateStatus = async (status: string) => {
    if (!selectedShipment) return;

    const updatedShipment = {
      ...selectedShipment,
      current_status: status,
      updated_at: new Date().toISOString()
    };
    setSelectedShipment(updatedShipment);

    // Auto-create tracking event for this transition
    const newEv: TrackingEvent = {
      id: crypto.randomUUID(),
      shipment_id: selectedShipment.id,
      status: status,
      location: selectedShipment.sender_address || 'Logistics Routing Point',
      checkpoint_notes: `Manifest status changed manually to [${status}].`,
      created_at: new Date().toISOString()
    };

    try {
      if (import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('placeholder') && !import.meta.env.VITE_SUPABASE_URL.includes('test')) {
        await supabase
          .from('shipments')
          .update({ current_status: status, updated_at: new Date().toISOString() })
          .eq('id', selectedShipment.id);

        await supabase.from('tracking_events').insert(newEv);
      }
    } catch (err) {
      console.log("Supabase fallback used");
    }

    const updatedEvents = [newEv, ...selectedEvents];
    setSelectedEvents(updatedEvents);

    const savedEvents = localStorage.getItem('mfc_tracking_events');
    const grouped = savedEvents ? JSON.parse(savedEvents) : {};
    grouped[selectedShipment.id] = updatedEvents;
    localStorage.setItem('mfc_tracking_events', JSON.stringify(grouped));

    const updatedShipments = shipments.map(s => s.id === selectedShipment.id ? updatedShipment : s);
    setShipments(updatedShipments);
    localStorage.setItem('mfc_shipments', JSON.stringify(updatedShipments));
  };

  // Delete Shipment
  const handleDeleteShipment = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this shipment?")) {
      return;
    }

    try {
      if (import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('placeholder') && !import.meta.env.VITE_SUPABASE_URL.includes('test')) {
        const { error } = await supabase.from('shipments').delete().eq('id', id);
        if (error) console.log("Supabase error handled");
      }
    } catch (e) {
      console.log("Supabase fallback used");
    }

    const filtered = shipments.filter(s => s.id !== id);
    setShipments(filtered);
    localStorage.setItem('mfc_shipments', JSON.stringify(filtered));

    const savedEvents = localStorage.getItem('mfc_tracking_events');
    if (savedEvents) {
      const grouped = JSON.parse(savedEvents);
      delete grouped[id];
      localStorage.setItem('mfc_tracking_events', JSON.stringify(grouped));
    }

    setSelectedShipment(null);
    setSelectedEvents([]);
    alert("Shipment deleted successfully.");
  };

  const timelineSteps = ['Created', 'Dispatched', 'In Transit', 'Out for Delivery', 'Delivered'];
  const getStepIndex = (status: string) => {
    if (status === 'Manifest Created') return 0;
    if (status === 'Delayed' || status === 'Exceptions') return 2;
    return timelineSteps.indexOf(status);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredShipments = shipments.filter(s => {
    const matchesSearch = s.tracking_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.recipient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.sender_name.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'All') return true;
    if (activeTab === 'Drafts') return ['Manifest Created', 'Created'].includes(s.current_status);
    if (activeTab === 'In-Transit') return ['Dispatched', 'In Transit', 'Out for Delivery'].includes(s.current_status);
    if (activeTab === 'Exceptions') return ['Delayed', 'Exception', 'Exceptions'].includes(s.current_status) || s.current_status.toLowerCase().includes('delay');
    if (activeTab === 'Delivered') return s.current_status === 'Delivered';
    return false;
  });

  if (selectedShipment) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 bg-white overflow-y-auto h-full flex flex-col">
        {/* Detail Header */}
        <div className="p-4 sm:p-8 border-b border-slate-200 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-slate-50 sticky top-0 z-10 print:hidden gap-4">
          <div>
            <button onClick={() => { setSelectedShipment(null); setSelectedEvents([]); }} className="flex items-center text-sm font-bold uppercase tracking-widest text-slate-900 hover:text-slate-800 mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Shipments
            </button>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black tracking-tight text-slate-900">{selectedShipment.tracking_id}</h2>
              <span className={cn(
                "px-2.5 py-1 text-[10px] leading-5 font-bold uppercase tracking-widest rounded-none border",
                selectedShipment.current_status === 'Delivered' ? "bg-green-100 text-green-800 border-green-200" : 
                selectedShipment.current_status.includes('Transit') || selectedShipment.current_status === 'Dispatched' ? "bg-slate-200 text-slate-800 border-slate-300" : 
                selectedShipment.current_status === 'Delayed' ? "bg-red-100 text-red-800 border-red-200" : "bg-slate-100 text-slate-800 border-slate-200"
              )}>
                {selectedShipment.current_status}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">Sender: <span className="font-semibold text-slate-800">{selectedShipment.sender_name}</span> &bull; Est. Delivery: <span className="text-slate-900 font-mono font-semibold">{selectedShipment.estimated_delivery || 'Pending'}</span></p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 shadow-sm text-xs font-bold tracking-widest uppercase text-slate-700 bg-white hover:bg-slate-50 transition-colors rounded-none">
              <FileText className="h-4 w-4 mr-2" />
              Invoice
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-xs font-bold tracking-widest uppercase text-white bg-slate-900 hover:bg-slate-800 transition-colors rounded-none"
            >
              <Download className="h-4 w-4 mr-2" />
              Label PDF
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-8 print:hidden flex-1 overflow-y-auto max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main timeline and content */}
          <div className="lg:col-span-2">
            {/* Tracking Timeline */}
            <div className="mb-12 bg-slate-50 border border-slate-100 p-6 rounded-none">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-200/50 pb-2">Tracking Progress</h3>
              <div className="relative pt-2">
                <div className="overflow-hidden h-2 mb-6 text-xs flex bg-slate-200 rounded-full">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(0, Math.min(100, (getStepIndex(selectedShipment.current_status) / (timelineSteps.length - 1)) * 100))}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-slate-900 rounded-full"
                  ></motion.div>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {timelineSteps.map((step, idx) => (
                    <div key={step} className={cn("text-center max-w-[80px]", idx <= getStepIndex(selectedShipment.current_status) ? "text-slate-900 font-black" : "")}>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Event Logs */}
            <div className="mb-12">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2">Checkpoint Log</h3>
              <div className="space-y-0 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {selectedEvents.length === 0 ? (
                  <div className="p-4 text-center text-sm font-mono text-slate-400 uppercase tracking-wider">
                    No checkpoints recorded yet.
                  </div>
                ) : (
                  selectedEvents.map((event, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={event.id} 
                      className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-slate-900 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 border border-slate-200 shadow-xs rounded-none">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-bold text-slate-900 text-sm">{event.status}</p>
                          <time className="font-mono text-[10px] text-slate-400 font-bold">{new Date(event.created_at).toLocaleString()}</time>
                        </div>
                        <p className="text-sm text-slate-600">{event.location}</p>
                        {event.checkpoint_notes && (
                          <p className="text-xs text-slate-500 mt-2 p-2 bg-slate-50 border border-slate-100 font-mono rounded-none">
                            Note: {event.checkpoint_notes}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Details Table */}
            <div className="mb-12 border border-slate-200 rounded-none overflow-hidden bg-white">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900">Manifest Specifications</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-1">Consignor (Sender)</p>
                  <p className="font-bold text-slate-900">{selectedShipment.sender_name}</p>
                  <p className="text-slate-600 whitespace-pre-line mt-1">{selectedShipment.sender_address}</p>
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-1">Consignee (Recipient)</p>
                  <p className="font-bold text-slate-900">{selectedShipment.recipient_name}</p>
                  <p className="text-slate-600 whitespace-pre-line mt-1">{selectedShipment.recipient_address}</p>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-1">Carrier / Provider</p>
                  <p className="font-semibold text-slate-900">{selectedShipment.carrier_name}</p>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-1">Weight Specifications</p>
                  <p className="font-semibold text-slate-900 font-mono">{selectedShipment.weight_kg} kg</p>
                </div>
                {selectedShipment.content_description && (
                  <div className="border-t border-slate-100 pt-4 md:col-span-2">
                    <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-1">Declared Contents</p>
                    <p className="text-slate-700">{selectedShipment.content_description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Admin Sidebar Controls & Verification Media */}
          <div className="space-y-8">
            {/* Admin Console Box */}
            {editMode && (
              <div className="border border-slate-300 bg-white p-6 rounded-none shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
                  <ShieldAlert className="h-5 w-5 text-slate-800" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900">Shipment Controls</h3>
                </div>

                {/* Quick Status Update */}
                <div className="mb-6">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Change Current Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Manifest Created', 'Dispatched', 'In Transit', 'Delayed', 'Out for Delivery', 'Delivered'].map(st => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(st)}
                        className={cn(
                          "px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-none border text-left transition-colors",
                          selectedShipment.current_status === st 
                            ? "bg-slate-900 text-white border-slate-900 shadow-sm" 
                            : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                        )}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add Custom Checkpoint Event */}
                <form onSubmit={handleAddCheckpoint} className="mb-6 border-t border-slate-200 pt-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-3">Append Tracking Checkpoint</h4>
                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Checkpoint Status (e.g. Arrived at Sort Hub)"
                        value={newEventStatus}
                        onChange={e => setNewEventStatus(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:border-slate-500 font-mono text-xs rounded-none"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Location (e.g. London, UK)"
                        value={newEventLocation}
                        onChange={e => setNewEventLocation(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:border-slate-500 font-mono text-xs rounded-none"
                        required
                      />
                    </div>
                    <div>
                      <textarea
                        placeholder="Notes / Checkpoint description (Optional)"
                        value={newEventNotes}
                        onChange={e => setNewEventNotes(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:border-slate-500 font-mono text-xs rounded-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest py-2 rounded-none transition-colors shadow-sm"
                    >
                      Add Checkpoint
                    </button>
                  </div>
                </form>

                {/* Dangerous actions */}
                <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Danger Zone</span>
                  <button
                    onClick={() => handleDeleteShipment(selectedShipment.id)}
                    className="inline-flex items-center justify-center px-3 py-1.5 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-none transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Delete Manifest
                  </button>
                </div>
              </div>
            )}

            {/* Verification Images */}
            <div className="border border-slate-200 bg-white p-6 shadow-sm rounded-none">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2">Delivery Verification</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">Package Photo</span>
                    <Camera className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="bg-slate-50 flex items-center justify-center min-h-[160px] border border-slate-200 rounded-none overflow-hidden">
                    {selectedShipment.package_received_img ? (
                      <img src={selectedShipment.package_received_img} alt="Package" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs uppercase tracking-widest font-mono text-slate-400">No Photo Available</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">Proof of Delivery Signature</span>
                    <PenTool className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="bg-slate-50 flex items-center justify-center min-h-[160px] border border-slate-200 rounded-none overflow-hidden">
                    {selectedShipment.proof_of_delivery_img ? (
                      <img src={selectedShipment.proof_of_delivery_img} alt="Signature" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs uppercase tracking-widest font-mono text-slate-400">No Signature Recorded</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Print Area */}
        <div className="hidden print:block print:w-full">
          <WaybillDocument shipment={selectedShipment} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 sm:p-8 max-w-7xl mx-auto flex flex-col h-full font-sans">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">Shipment Manager</h1>
          <p className="text-slate-500 text-sm">Create, monitor and administer all logistics manifests.</p>
        </div>
        
        {/* Action Controls based on Edit Mode */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleToggleEditMode}
            className={cn(
              "inline-flex items-center px-4 py-2 border text-xs font-bold uppercase tracking-widest rounded-none transition-all shadow-sm",
              editMode
                ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-600"
                : "bg-white hover:bg-slate-50 text-slate-700 border-slate-300"
            )}
          >
            <Edit3 className="h-4 w-4 mr-2" />
            {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
          </button>

          {editMode && (
            <>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-widest rounded-none transition-all shadow-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Manifest
              </button>
              
              <button
                onClick={handleClearAllShipments}
                className="inline-flex items-center px-4 py-2 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold uppercase tracking-widest rounded-none transition-all"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </button>
            </>
          )}

          {shipments.length === 0 && (
            <button
              onClick={handleSeedDemoData}
              className="inline-flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-widest rounded-none transition-all"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Load Demo Manifests
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm flex-1 flex flex-col min-h-[400px] rounded-none">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col lg:flex-row justify-between items-center gap-4 bg-slate-50 rounded-t-sm">
          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 hide-scrollbar">
            {['All', 'Drafts', 'In-Transit', 'Exceptions', 'Delivered'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  "px-4 py-2 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all rounded-none",
                  activeTab === tab 
                    ? "bg-slate-900 text-white shadow-xs" 
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-3 w-full lg:w-auto">
            <div className="relative w-full lg:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search Consignor / Consignee / ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 focus:outline-none focus:border-slate-1000 font-mono text-sm rounded-none transition-all bg-white"
              />
            </div>
            
            <button 
              onClick={fetchShipments}
              className="p-2 border border-slate-200 hover:bg-slate-100 rounded-none bg-white transition-colors"
              title="Refresh database"
            >
              <RefreshCw className="h-4 w-4 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Data Table / Empty view */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-16 space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
              <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Loading Logistics Database...</p>
            </div>
          ) : filteredShipments.length === 0 ? (
            <div className="p-16 text-center max-w-lg mx-auto flex flex-col items-center justify-center">
              <ShieldAlert className="h-10 w-10 text-slate-300 mb-4" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-1">No Shipments Found</h3>
              <p className="text-slate-500 text-xs mb-6">
                {shipments.length === 0 
                  ? "This account has 0 logistics manifests recorded. Click below to load demo records or toggle Edit Mode to create your first tracking manifest."
                  : "No manifests match your current search queries or navigation filters."}
              </p>
              {shipments.length === 0 && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleSeedDemoData}
                    className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-none transition-all"
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-2" />
                    Load Demo Manifests
                  </button>
                  {editMode && (
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="inline-flex items-center justify-center px-4 py-2 bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-900 text-[10px] font-bold uppercase tracking-widest rounded-none transition-all"
                    >
                      <Plus className="h-3.5 w-3.5 mr-2" />
                      Create New Shipment
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Tracking ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Consignee</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Destination Point</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Carrier</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Last Update</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredShipments.map((shipment) => (
                  <tr 
                    key={shipment.id} 
                    onClick={() => setSelectedShipment(shipment)}
                    className="hover:bg-slate-100/50 cursor-pointer transition-all"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm font-black text-slate-900 block">{shipment.tracking_id}</span>
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Weight: {shipment.weight_kg}kg</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-bold">
                      {shipment.recipient_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 truncate max-w-[240px]">
                      {shipment.recipient_address.split('\n').join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <span className="px-2 py-1 bg-slate-100 border border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-700 rounded-none">
                        {shipment.carrier_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "px-2 py-0.5 inline-flex text-[9px] font-black uppercase tracking-widest rounded-none border",
                        shipment.current_status === 'Delivered' ? "bg-green-100 text-green-800 border-green-200" : 
                        shipment.current_status.includes('Transit') || shipment.current_status === 'Dispatched' ? "bg-slate-200 text-slate-800 border-slate-300" : 
                        shipment.current_status === 'Delayed' ? "bg-red-100 text-red-800 border-red-200" : "bg-slate-100 text-slate-800 border-slate-200"
                      )}>
                        {shipment.current_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-mono text-slate-400">
                      {new Date(shipment.updated_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Shipment Creation Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 shadow-xl max-w-2xl w-full rounded-none overflow-hidden"
            >
              <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-amber-500 animate-pulse" />
                  <h3 className="text-xs font-black uppercase tracking-widest">Create Logistics Manifest</h3>
                </div>
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateShipment} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Custom Tracking ID (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. MFC-1920-8392"
                      value={newTrackingId}
                      onChange={e => setNewTrackingId(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-slate-1000 font-mono text-sm rounded-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Carrier Provider</label>
                    <input
                      type="text"
                      value={newCarrierName}
                      onChange={e => setNewCarrierName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-slate-1000 font-mono text-sm rounded-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Consignor (Sender) Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. MFC London Facility Hub"
                      value={newSenderName}
                      onChange={e => setNewSenderName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-slate-1000 text-sm rounded-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Consignor (Sender) Address</label>
                    <input
                      type="text"
                      placeholder="e.g. Heathrow Airport Depot, London, UK"
                      value={newSenderAddress}
                      onChange={e => setNewSenderAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-slate-1000 text-sm rounded-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Consignee (Recipient) Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Global Tech Distribution"
                      value={newRecipientName}
                      onChange={e => setNewRecipientName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-slate-1000 text-sm rounded-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Consignee (Recipient) Address *</label>
                    <input
                      type="text"
                      placeholder="e.g. 84 King Street, New York, NY 10001"
                      value={newRecipientAddress}
                      onChange={e => setNewRecipientAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-slate-1000 text-sm rounded-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Weight Specs (kg)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newWeight}
                      onChange={e => setNewWeight(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-slate-1000 font-mono text-sm rounded-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Est. Delivery (e.g. Next-Day, In 2 Days)</label>
                    <input
                      type="text"
                      placeholder="e.g. Tomorrow by 12:00 PM"
                      value={newEstDelivery}
                      onChange={e => setNewEstDelivery(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-slate-1000 text-sm rounded-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Initial Manifest Status</label>
                    <select
                      value={newStatus}
                      onChange={e => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-slate-1000 text-sm rounded-none bg-white"
                    >
                      <option value="Manifest Created">Manifest Created (Draft / Registered)</option>
                      <option value="Dispatched">Dispatched (Out of Facility)</option>
                      <option value="In Transit">In Transit (Moving)</option>
                      <option value="Delayed">Delayed / Exception</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Cargo Content Description</label>
                    <input
                      type="text"
                      placeholder="e.g. High-density server microprocessors"
                      value={newDescription}
                      onChange={e => setNewDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-slate-1000 text-sm rounded-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 rounded-none transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-slate-900 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-widest rounded-none transition-colors shadow-xs"
                  >
                    Save Manifest Record
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
