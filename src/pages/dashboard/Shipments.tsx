import React, { useState, useEffect } from 'react';
import { mockShipments, mockTrackingEvents } from '../../lib/mock-data';
import { Shipment } from '../../types';
import { WaybillDocument } from '../../components/WaybillDocument';
import { Download, Link as LinkIcon, Camera, PenTool, CheckCircle2, Search, Filter, FileText, ArrowLeft, Plus, Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';

export const Shipments = () => {
  const [shipments, setShipments] = useState<Shipment[]>(() => {
    const saved = localStorage.getItem('mfc_shipments');
    return saved ? JSON.parse(saved) : mockShipments;
  });
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [activeTab, setActiveTab] = useState<'All' | 'Drafts' | 'In-Transit' | 'Exceptions' | 'Delivered'>('All');

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      if (import.meta.env.VITE_SUPABASE_URL) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('shipments')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          
          if (data && data.length > 0) {
            setShipments(data);
            localStorage.setItem('mfc_shipments', JSON.stringify(data));
            return;
          }
        }
      }
    } catch (e) {
      console.warn("Supabase not fully setup, using local shipments");
    }
  };

  const timelineSteps = ['Created', 'Dispatched', 'In Transit', 'Out for Delivery', 'Delivered'];
  const getStepIndex = (status: string) => {
    if (status === 'Manifest Created') return 0;
    return timelineSteps.indexOf(status);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredShipments = shipments.filter(s => {
    if (activeTab === 'All') return true;
    if (activeTab === 'In-Transit') return ['Dispatched', 'In Transit', 'Out for Delivery'].includes(s.current_status);
    if (activeTab === 'Delivered') return s.current_status === 'Delivered';
    return false;
  });

  if (selectedShipment) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 bg-white overflow-y-auto h-full flex flex-col">
        <div className="p-4 sm:p-8 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 sticky top-0 z-10 print:hidden gap-4">
          <div>
            <button onClick={() => { setSelectedShipment(null); }} className="flex items-center text-sm font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800 mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Shipments
            </button>
            <h2 className="text-2xl font-black tracking-tight text-gray-900">{selectedShipment.tracking_id}</h2>
            <p className="text-sm text-gray-500 mt-1">Sender: {selectedShipment.sender_name} &bull; Est. Delivery: <span className="text-blue-600 font-mono font-semibold">{selectedShipment.estimated_delivery || 'Pending'}</span></p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-xs font-bold tracking-widest uppercase text-gray-700 bg-white hover:bg-gray-50 transition-colors rounded-sm">
              <FileText className="h-4 w-4 mr-2" />
              Invoice
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-xs font-bold tracking-widest uppercase text-white bg-gray-900 hover:bg-gray-800 transition-colors rounded-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Label PDF
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-8 print:hidden flex-1 overflow-y-auto max-w-5xl mx-auto w-full">
          {/* Tracking Timeline */}
          <div className="mb-16">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8 border-b border-gray-100 pb-2">Tracking Progress</h3>
            <div className="relative pt-2">
              <div className="overflow-hidden h-2 mb-6 text-xs flex bg-gray-100 rounded-full">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(getStepIndex(selectedShipment.current_status) / (timelineSteps.length - 1)) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 rounded-full"
                ></motion.div>
              </div>
              <div className="flex justify-between text-xs font-medium text-gray-400">
                {timelineSteps.map((step, idx) => (
                  <div key={step} className={cn("text-center max-w-[80px]", idx <= getStepIndex(selectedShipment.current_status) ? "text-gray-900 font-bold" : "")}>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Event Logs */}
            <div className="mt-12 space-y-0 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {(mockTrackingEvents[selectedShipment.id] || []).map((event, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={event.id} 
                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-gray-900 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 border border-gray-200 shadow-sm rounded-sm">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-bold text-gray-900 text-sm">{event.status}</p>
                      <time className="font-mono text-xs text-gray-400">{new Date(event.created_at).toLocaleString()}</time>
                    </div>
                    <p className="text-sm text-gray-600">{event.location}</p>
                    {event.checkpoint_notes && <p className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 border border-gray-100 font-mono rounded-sm">Note: {event.checkpoint_notes}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Verification Images */}
          <div className="mb-12">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 border-b border-gray-100 pb-2">Delivery Photos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border border-gray-200 bg-white p-6 shadow-sm rounded-sm hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-gray-900">Package Photo</span>
                  <Camera className="h-4 w-4 text-gray-400" />
                </div>
                <div className="bg-gray-50 flex items-center justify-center min-h-[250px] border border-gray-100 rounded-sm overflow-hidden">
                  {selectedShipment.package_received_img ? (
                    <img src={selectedShipment.package_received_img} alt="Package" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs uppercase tracking-widest font-mono text-gray-400">No Photo</span>
                  )}
                </div>
              </div>
              <div className="border border-gray-200 bg-white p-6 shadow-sm rounded-sm hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-gray-900">Signature</span>
                  <PenTool className="h-4 w-4 text-gray-400" />
                </div>
                <div className="bg-gray-50 flex items-center justify-center min-h-[250px] border border-gray-100 rounded-sm overflow-hidden">
                  {selectedShipment.proof_of_delivery_img ? (
                    <img src={selectedShipment.proof_of_delivery_img} alt="Signature" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs uppercase tracking-widest font-mono text-gray-400">No Signature</span>
                  )}
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 sm:p-8 max-w-7xl mx-auto flex flex-col h-full">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-1">Shipments</h1>
          <p className="text-gray-500 text-sm">Track and manage your deliveries.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm flex-1 flex flex-col min-h-0 rounded-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 rounded-t-sm">
          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 hide-scrollbar">
            {['All', 'Drafts', 'In-Transit', 'Exceptions', 'Delivered'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  "px-4 py-2 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors rounded-sm",
                  activeTab === tab ? "bg-gray-900 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500 font-mono text-sm rounded-sm transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Tracking ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">To</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Destination</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Carrier</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-widest">Updated</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredShipments.map((shipment) => (
                <tr 
                  key={shipment.id} 
                  onClick={() => setSelectedShipment(shipment)}
                  className="hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-sm font-bold text-gray-900">{shipment.tracking_id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {shipment.recipient_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-[200px]">
                    {shipment.recipient_address.split('\n').join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 border border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-700 rounded-sm">
                      {shipment.carrier_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "px-2 py-1 inline-flex text-[10px] leading-5 font-bold uppercase tracking-widest rounded-sm",
                      shipment.current_status === 'Delivered' ? "bg-green-100 text-green-800" : 
                      shipment.current_status.includes('Transit') ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                    )}>
                      {shipment.current_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-mono text-gray-500">
                    {new Date(shipment.updated_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredShipments.length === 0 && (
            <div className="p-12 text-center text-gray-500 font-mono text-sm uppercase tracking-widest">
              No shipments found.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
