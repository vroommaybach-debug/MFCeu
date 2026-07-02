import React from 'react';
import { Shipment } from '../types';

interface WaybillProps {
  shipment: Shipment;
}

export const WaybillDocument: React.FC<WaybillProps> = ({ shipment }) => {
  return (
    <div className="p-8 max-w-[800px] mx-auto bg-white border border-gray-200 shadow-sm print:border-0 print:shadow-none print:p-0" id="waybill-print-area">
      <div className="flex justify-between items-start border-b border-gray-900 pb-6 mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">MAJOR FREIGHT COURIER</h1>
          <p className="text-xs uppercase tracking-widest text-gray-500 font-mono mt-1">Global Hand-to-Hand Network</p>
        </div>
        <div className="text-right">
          <span className="inline-block bg-gray-900 text-white text-xs px-2 py-1 font-mono uppercase font-bold tracking-wider rounded mb-1">
            {shipment.carrier_name} Transit Waybill
          </span>
          <p className="text-sm font-mono font-bold text-gray-900 mt-1">{shipment.tracking_id}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
        <div className="border-l-2 border-gray-900 pl-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Origin / Shipper</h3>
          <p className="font-semibold text-gray-900">{shipment.sender_name}</p>
          <p className="text-gray-600 mt-1 whitespace-pre-line leading-relaxed">{shipment.sender_address}</p>
        </div>
        <div className="border-l-2 border-gray-900 pl-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Destination / Consignee</h3>
          <p className="font-semibold text-gray-900">{shipment.recipient_name}</p>
          <p className="text-gray-600 mt-1 whitespace-pre-line leading-relaxed">{shipment.recipient_address}</p>
        </div>
      </div>

      <div className="border border-gray-200 rounded-md p-4 bg-gray-50/50 grid grid-cols-3 gap-4 text-xs font-mono mb-8">
        <div>
          <span className="block text-gray-400 uppercase">Date of Manifest</span>
          <span className="font-bold text-gray-900">{new Date(shipment.created_at).toLocaleDateString()}</span>
        </div>
        <div>
          <span className="block text-gray-400 uppercase">Declared Weight</span>
          <span className="font-bold text-gray-900">{shipment.weight_kg} KG</span>
        </div>
        <div>
          <span className="block text-gray-400 uppercase">Security Protocol</span>
          <span className="font-bold text-gray-900">Chain-of-Custody (H2H)</span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded p-6 bg-white">
        <div className="w-full h-16 bg-[repeating-linear-gradient(90deg,#000,#000_4px,transparent_4px,transparent_8px)] mb-2 opacity-80" />
        <span className="text-xs font-mono tracking-widest text-gray-500 uppercase">{shipment.tracking_id}</span>
      </div>

      <div className="mt-12 pt-4 border-t border-gray-100 flex justify-between text-[10px] text-gray-400 font-mono">
        <span>SYSTEM GENERATED DOC // MFC WEB CORE V1.0</span>
        <span>NO CASH VALUE // SECURE TRANSIT ID</span>
      </div>
    </div>
  );
};
