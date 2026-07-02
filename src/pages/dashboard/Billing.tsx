import React, { useState } from 'react';
import { CreditCard, Download, Receipt, ArrowUpRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface InvoiceRecord {
  id: string;
  date: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  description: string;
}

const mockInvoices: InvoiceRecord[] = [
  {
    id: 'INV-2026-1042',
    date: 'Oct 01, 2026',
    amount: 14500.00,
    status: 'PAID',
    description: 'Monthly Freight Consolidation - EU Routes'
  },
  {
    id: 'INV-2026-1043',
    date: 'Oct 15, 2026',
    amount: 3200.50,
    status: 'PENDING',
    description: 'Expedited First-Mile Handoff Fees'
  },
  {
    id: 'INV-2026-1031',
    date: 'Sep 01, 2026',
    amount: 12840.00,
    status: 'PAID',
    description: 'Monthly Freight Consolidation - Global'
  }
];

export const Billing = () => {
  const [balance, setBalance] = useState<number>(3200.50);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(mockInvoices);

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-8 sm:px-8 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight uppercase">Billing & Invoices</h1>
            <p className="mt-1 text-sm text-gray-500 font-mono tracking-wide">
              Financial overview and payment history
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors rounded-sm uppercase tracking-wide">
              Make a Payment
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8 space-y-8">
        
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-6 relative">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest">Current Balance</h3>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tighter text-gray-900">${balance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              <span className="text-sm text-gray-500 font-mono">USD</span>
            </div>
            
            <p className="mt-2 text-sm text-amber-600 flex items-center gap-1">
              <Clock className="h-4 w-4" /> Due by {new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-6">
            <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-1">Primary Payment Method</h3>
            <div className="flex items-center gap-3 mt-2">
              <div className="h-10 w-16 bg-gray-100 border border-gray-200 rounded-sm flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Corporate Card ending in 4022</p>
                <p className="text-xs text-gray-500 font-mono">Expires 12/28</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-6 flex flex-col justify-center">
             <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-4">Enterprise Account Status</h3>
             <div className="flex items-center gap-2">
               <CheckCircle2 className="h-5 w-5 text-green-500" />
               <span className="text-sm font-bold text-gray-900">Good Standing</span>
             </div>
             <p className="mt-1 text-xs text-gray-500">Tier: Platinum Consolidated</p>
          </div>
        </div>

        {/* Invoice History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Recent Invoices</h2>
            <button className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors">
              <Download className="h-4 w-4" /> Export All
            </button>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <li key={invoice.id} className="hover:bg-gray-50 transition-colors">
                  <div className="px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-50 flex items-center justify-center rounded-sm border border-gray-200">
                        <Receipt className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 leading-tight">{invoice.description}</p>
                        <div className="mt-1 flex flex-wrap items-center text-xs text-gray-500 font-mono gap-x-3 gap-y-1">
                          <span className="text-gray-900 font-medium">{invoice.id}</span>
                          <span className="text-gray-300 hidden sm:inline">|</span>
                          <span>Billed: {invoice.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                      <span className="text-base font-bold text-gray-900">
                        ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-sm flex items-center gap-1",
                          invoice.status === 'PAID' ? "bg-green-100 text-green-800" :
                          invoice.status === 'PENDING' ? "bg-amber-100 text-amber-800" :
                          "bg-red-100 text-red-800"
                        )}>
                          {invoice.status}
                        </span>
                        <button className="text-gray-400 hover:text-gray-900 transition-colors" title="Download PDF">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};
