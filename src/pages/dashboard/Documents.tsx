import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, FileText, ExternalLink, Calendar, CheckCircle, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { mockShipments } from '../../lib/mock-data';
import { Shipment } from '../../types';

import { Link } from 'react-router-dom';

interface DocumentRecord {
  id: string;
  type: 'WAYBILL' | 'BILL_OF_LADING' | 'CUSTOMS_FORM' | 'PROOF_OF_DELIVERY';
  title: string;
  shipmentId: string;
  date: string;
  status: 'VERIFIED' | 'PENDING' | 'ARCHIVED';
  size: string;
}

export const Documents = () => {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    let shipments: Shipment[] = [];
    try {
      if (import.meta.env.VITE_SUPABASE_URL) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase.from('shipments').select('*').eq('user_id', user.id);
          if (data && data.length > 0) {
            shipments = data;
          }
        }
      }
    } catch (e) {
      console.warn("Supabase not fully setup");
    }

    if (shipments.length === 0) {
      const saved = localStorage.getItem('mfc_shipments');
      shipments = saved ? JSON.parse(saved) : mockShipments;
    }

    const generatedDocs: DocumentRecord[] = [];
    shipments.forEach(s => {
      generatedDocs.push({
        id: `DOC-${s.tracking_id}-WB`,
        type: 'WAYBILL',
        title: `Waybill - ${s.recipient_name}`,
        shipmentId: s.tracking_id,
        date: new Date(s.created_at).toLocaleDateString(),
        status: 'VERIFIED',
        size: '1.2 MB'
      });
      if (s.proof_of_delivery_img) {
        generatedDocs.push({
          id: `DOC-${s.tracking_id}-POD`,
          type: 'PROOF_OF_DELIVERY',
          title: `Signed POD - ${s.recipient_name}`,
          shipmentId: s.tracking_id,
          date: new Date(s.updated_at).toLocaleDateString(),
          status: 'ARCHIVED',
          size: '2.1 MB'
        });
      }
    });

    setDocuments(generatedDocs);
  };

  const filteredDocs = documents.filter(d => 
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (doc: DocumentRecord) => {
    // Generate a dummy text file to simulate download
    const element = document.createElement("a");
    const file = new Blob([`Document Details:\nID: ${doc.id}\nTitle: ${doc.title}\nShipment REF: ${doc.shipmentId}\nStatus: ${doc.status}\nDate: ${doc.date}\nType: ${doc.type}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${doc.id}.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-full bg-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-8 sm:px-8 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight uppercase">Document Center</h1>
            <p className="mt-1 text-sm text-gray-400 font-mono tracking-wide">
              Compliance, Waybills, and Chain of Custody Records
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-700 bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 transition-colors rounded-sm">
              <Download className="h-4 w-4 mr-2" />
              Export Archive
            </button>
            <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent bg-white text-gray-900 text-sm font-medium hover:bg-gray-100 transition-colors rounded-sm uppercase tracking-wide">
              Upload Document
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Document ID, Shipment ID, or Type..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-sm leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 sm:text-sm transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors">
              <Filter className="h-4 w-4 mr-2 text-gray-500" />
              Document Type
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              Date Range
            </button>
          </div>
        </div>

        {/* Document List */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {filteredDocs.map((doc) => (
              <li key={doc.id} className="hover:bg-gray-50 transition-colors">
                <div className="px-4 py-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center min-w-0 gap-4">
                    <div className="h-10 w-10 flex-shrink-0 bg-gray-100 flex items-center justify-center rounded-sm border border-gray-200">
                      <FileText className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-gray-900 truncate max-w-full">
                          {doc.title}
                        </p>
                        <span className={cn(
                          "px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-sm flex-shrink-0",
                          doc.status === 'VERIFIED' ? "bg-green-100 text-green-800" :
                          doc.status === 'PENDING' ? "bg-amber-100 text-amber-800" :
                          "bg-gray-100 text-gray-800"
                        )}>
                          {doc.status}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center text-xs text-gray-500 font-mono gap-x-3 gap-y-1">
                        <span className="text-gray-900 font-medium">{doc.id}</span>
                        <span className="text-gray-300 hidden sm:inline">|</span>
                        <span>REF: {doc.shipmentId}</span>
                        <span className="text-gray-300 hidden sm:inline">|</span>
                        <span>{doc.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                    <span className="text-xs text-gray-500 font-mono sm:hidden block">Size: {doc.size}</span>
                    <span className="text-xs text-gray-500 font-mono hidden sm:block">{doc.size}</span>
                    <div className="flex items-center gap-4">
                      <button onClick={() => handleDownload(doc)} className="text-gray-400 hover:text-gray-900 transition-colors" title="Download Document">
                        <Download className="h-5 w-5" />
                      </button>
                      <Link to="/dashboard/shipments" className="text-gray-400 hover:text-gray-900 transition-colors" title="View Shipment">
                        <ExternalLink className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Pagination Details */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-500 font-mono">Showing 1 to {filteredDocs.length} of {filteredDocs.length} entries</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 text-sm text-gray-400 bg-gray-50 rounded-sm cursor-not-allowed">Prev</button>
            <button className="px-3 py-1 border border-gray-200 text-sm text-gray-400 bg-gray-50 rounded-sm cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};
