import React, { useState } from 'react';
import { mockShipments, mockTrackingEvents } from '../../lib/mock-data';
import { Shipment } from '../../types';
import { WaybillDocument } from '../../components/WaybillDocument';
import { Download, Link as LinkIcon, Camera, PenTool, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Dashboard = () => {
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(mockShipments[0]);

  const timelineSteps = ['Manifest Created', 'Dispatched', 'In Transit', 'Out for Delivery', 'Delivered'];

  const getStepIndex = (status: string) => timelineSteps.indexOf(status);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (selectedShipment) {
      navigator.clipboard.writeText(`https://majorfreightcourier.online/track/${selectedShipment.tracking_id}`);
      alert('Tracking link copied to clipboard.');
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row bg-slate-50 font-sans">
      {/* Shipments List Panel */}
      <div className="w-full lg:w-1/3 border-r border-slate-200 bg-white flex flex-col h-full overflow-y-auto print:hidden">
        <div className="p-8 border-b border-slate-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Active Allocations</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1">My Shipments</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {mockShipments.map((shipment) => (
            <div
              key={shipment.id}
              onClick={() => setSelectedShipment(shipment)}
              className={cn(
                "p-6 sm:p-8 border-b border-slate-100 cursor-pointer transition-colors relative",
                selectedShipment?.id === shipment.id 
                  ? "bg-slate-50" 
                  : "hover:bg-slate-50"
              )}
            >
              {selectedShipment?.id === shipment.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-900"></div>
              )}
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-sm font-bold text-slate-900">{shipment.tracking_id}</span>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1",
                  shipment.current_status === 'Delivered' ? "bg-white border border-slate-200 text-slate-900" : "bg-slate-100 text-slate-700"
                )}>
                  {shipment.current_status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-400 uppercase tracking-[0.2em] text-[10px] mb-1">Carrier</p>
                  <p className="font-bold text-slate-900">{shipment.carrier_name}</p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase tracking-[0.2em] text-[10px] mb-1">Dest</p>
                  <p className="font-bold text-slate-900 truncate">{shipment.recipient_name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed View Component */}
      <div className="flex-1 bg-slate-50 overflow-y-auto">
        {selectedShipment ? (
          <div className="print:p-0">
            {/* Action Bar (Hidden when printing) */}
            <div className="p-8 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white sticky top-0 z-10 print:hidden">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">{selectedShipment.tracking_id}</h2>
                <p className="text-xs text-slate-500 mt-2 font-mono">Created: {new Date(selectedShipment.created_at).toLocaleString()}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center px-4 py-3 border border-slate-200 shadow-sm text-xs font-bold uppercase tracking-[0.2em] text-slate-700 bg-white hover:bg-slate-50 transition-colors rounded-none"
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Share
                </button>
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-xs font-bold tracking-[0.2em] uppercase text-white bg-slate-900 hover:bg-slate-800 transition-colors rounded-none shadow-sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Waybill
                </button>
              </div>
            </div>

            <div className="p-8 sm:p-12 print:hidden max-w-4xl mx-auto">
              {/* Standardized tracking timeline */}
              <div className="mb-16 bg-white p-8 border border-slate-200 shadow-sm">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8">Custody Timeline</h3>
                <div className="relative">
                  <div className="overflow-hidden h-1 mb-6 text-xs flex bg-slate-100">
                    <div style={{ width: `${(getStepIndex(selectedShipment.current_status) / (timelineSteps.length - 1)) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-slate-900 transition-all duration-500"></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">
                    {timelineSteps.map((step, idx) => (
                      <div key={step} className={cn("text-center max-w-[80px]", idx <= getStepIndex(selectedShipment.current_status) ? "text-slate-900" : "")}>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Event Logs */}
                <div className="mt-12 space-y-0 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-px before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  {(mockTrackingEvents[selectedShipment.id] || []).map((event) => (
                    <div key={event.id} className="relative flex items-start py-6 pl-12 group">
                      <div className="absolute left-0 top-6 flex items-center justify-center w-8 h-8 border border-white bg-slate-900 text-white shadow-sm z-10">
                        <div className="w-2 h-2 bg-white rounded-none"></div>
                      </div>
                      <div className="flex-1 bg-white border border-slate-100 p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">{event.status}</p>
                          <div className="text-right text-[10px] text-slate-500 font-mono tracking-wider">
                            {new Date(event.created_at).toLocaleDateString()}<br/>
                            {new Date(event.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 mb-2 font-mono">{event.location}</p>
                        {event.checkpoint_notes && <p className="text-xs text-slate-500 italic border-t border-slate-50 pt-2">{event.checkpoint_notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Verification Nodes */}
              <div className="mb-12">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">Verification Logs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="border border-slate-200 bg-white p-8 flex flex-col items-center justify-center min-h-[250px] shadow-sm">
                    {selectedShipment.package_received_img ? (
                      <img src={selectedShipment.package_received_img} alt="Package Intercept" className="max-h-48 object-contain" />
                    ) : (
                      <div className="text-center text-slate-400">
                        <Camera className="h-8 w-8 mx-auto mb-4 opacity-50" />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Intercept Image Pending</span>
                      </div>
                    )}
                  </div>
                  <div className="border border-slate-200 bg-white p-8 flex flex-col items-center justify-center min-h-[250px] shadow-sm">
                    {selectedShipment.proof_of_delivery_img ? (
                      <img src={selectedShipment.proof_of_delivery_img} alt="Proof of Delivery" className="max-h-48 object-contain" />
                    ) : (
                      <div className="text-center text-slate-400">
                        <PenTool className="h-8 w-8 mx-auto mb-4 opacity-50" />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold">POD Signature Pending</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Print Area - Waybill */}
            <div className="hidden print:block print:w-full">
              <WaybillDocument shipment={selectedShipment} />
            </div>

          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 print:hidden text-xs uppercase tracking-[0.2em] font-bold bg-slate-50">
            Select an allocation to view details
          </div>
        )}
      </div>
    </div>
  );
};
