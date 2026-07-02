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
    <div className="h-full flex flex-col lg:flex-row">
      {/* Shipments List Panel */}
      <div className="w-full lg:w-1/3 border-r border-gray-200 bg-white flex flex-col h-full overflow-y-auto print:hidden">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-black tracking-tight text-gray-900">Active Allocations</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-mono">My Shipments</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {mockShipments.map((shipment) => (
            <div
              key={shipment.id}
              onClick={() => setSelectedShipment(shipment)}
              className={cn(
                "p-6 border-b border-gray-100 cursor-pointer transition-colors",
                selectedShipment?.id === shipment.id 
                  ? "bg-gray-50 border-l-4 border-l-gray-900" 
                  : "hover:bg-gray-50 border-l-4 border-l-transparent"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-sm font-bold text-gray-900">{shipment.tracking_id}</span>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest px-2 py-1",
                  shipment.current_status === 'Delivered' ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-800"
                )}>
                  {shipment.current_status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-gray-400 uppercase tracking-wider mb-1">Carrier</p>
                  <p className="font-medium text-gray-900">{shipment.carrier_name}</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase tracking-wider mb-1">Dest</p>
                  <p className="font-medium text-gray-900 truncate">{shipment.recipient_name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed View Component */}
      <div className="flex-1 bg-white overflow-y-auto">
        {selectedShipment ? (
          <div className="print:p-0">
            {/* Action Bar (Hidden when printing) */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-10 print:hidden">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-gray-900">{selectedShipment.tracking_id}</h2>
                <p className="text-sm text-gray-500 mt-1">Created: {new Date(selectedShipment.created_at).toLocaleString()}</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Share Link
                </button>
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold tracking-widest uppercase text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Waybill
                </button>
              </div>
            </div>

            <div className="p-8 print:hidden">
              {/* Standardized tracking timeline */}
              <div className="mb-12">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Custody Timeline</h3>
                <div className="relative">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
                    <div style={{ width: `${(getStepIndex(selectedShipment.current_status) / (timelineSteps.length - 1)) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gray-900 transition-all duration-500"></div>
                  </div>
                  <div className="flex justify-between text-xs font-mono text-gray-500">
                    {timelineSteps.map((step, idx) => (
                      <div key={step} className={cn("text-center", idx <= getStepIndex(selectedShipment.current_status) ? "text-gray-900 font-bold" : "")}>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Event Logs */}
                <div className="mt-8 space-y-4">
                  {(mockTrackingEvents[selectedShipment.id] || []).map((event) => (
                    <div key={event.id} className="flex border-l-2 border-gray-200 pl-4 py-2">
                      <div className="w-32 flex-shrink-0 text-xs text-gray-500 font-mono">
                        {new Date(event.created_at).toLocaleDateString()}<br/>
                        {new Date(event.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{event.status}</p>
                        <p className="text-sm text-gray-600">{event.location}</p>
                        {event.checkpoint_notes && <p className="text-xs text-gray-500 mt-1 italic">{event.checkpoint_notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Verification Nodes */}
              <div className="mb-12">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Verification Logs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="border border-gray-200 bg-gray-50 p-6 flex flex-col items-center justify-center min-h-[200px]">
                    {selectedShipment.package_received_img ? (
                      <img src={selectedShipment.package_received_img} alt="Package Intercept" className="max-h-48 object-contain" />
                    ) : (
                      <div className="text-center text-gray-400">
                        <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <span className="text-xs uppercase tracking-widest font-mono">Intercept Image Pending</span>
                      </div>
                    )}
                  </div>
                  <div className="border border-gray-200 bg-gray-50 p-6 flex flex-col items-center justify-center min-h-[200px]">
                    {selectedShipment.proof_of_delivery_img ? (
                      <img src={selectedShipment.proof_of_delivery_img} alt="Proof of Delivery" className="max-h-48 object-contain" />
                    ) : (
                      <div className="text-center text-gray-400">
                        <PenTool className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <span className="text-xs uppercase tracking-widest font-mono">POD Signature Pending</span>
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
          <div className="h-full flex items-center justify-center text-gray-400 print:hidden text-sm uppercase tracking-widest font-mono">
            Select an allocation to view details
          </div>
        )}
      </div>
    </div>
  );
};
