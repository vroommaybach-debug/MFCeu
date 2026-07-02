import React, { useState } from 'react';
import { mockTickets } from '../../lib/mock-data';
import { AddressTicket } from '../../types';
import { Shield, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export const Addresses = () => {
  const [region, setRegion] = useState('US-EAST');
  const [tickets, setTickets] = useState<AddressTicket[]>(mockTickets);
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRequesting(true);
    
    setTimeout(() => {
      const newTicket: AddressTicket = {
        id: `ticket_${Date.now()}`,
        user_id: 'user_123',
        requested_region: region,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      setTickets([newTicket, ...tickets]);
      setIsRequesting(false);
    }, 800);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 sm:p-8 max-w-5xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">Secure Routing Portal</h1>
        <p className="text-gray-500 text-sm">Manage your pickup and delivery locations securely.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Request Module */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 p-6 shadow-sm rounded-sm">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-6 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-blue-600" />
              New Location Request
            </h2>
            
            <form onSubmit={handleRequest} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Region
                </label>
                <select
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 bg-white focus:outline-none focus:ring-0 focus:border-blue-500 sm:text-sm transition-colors rounded-sm"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                >
                  <option value="US-EAST">US East Coast (NY/FL)</option>
                  <option value="US-WEST">US West Coast (LA/SF)</option>
                  <option value="EU-WEST">Western Europe (UK/DE)</option>
                  <option value="EU-CENTRAL">Central Europe (FR/IT)</option>
                </select>
              </div>

              <div className="bg-blue-50 p-4 border border-blue-100 text-xs text-blue-800 leading-relaxed rounded-sm">
                Addresses remain active for 14 days. Cargo arriving after expiration will be held for review.
              </div>

              <button
                type="submit"
                disabled={isRequesting}
                className="w-full py-4 px-4 border border-transparent text-xs font-bold tracking-widest uppercase text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all rounded-sm"
              >
                {isRequesting ? 'Requesting...' : 'Request Address'}
              </button>
            </form>
          </div>
        </div>

        {/* Tickets List */}
        <div className="lg:col-span-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-6">Active Locations</h2>
          
          <div className="space-y-4">
            {tickets.map((ticket, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: idx * 0.1 }}
                key={ticket.id} 
                className="bg-white border border-gray-200 p-6 shadow-sm flex flex-col sm:flex-row justify-between gap-6 rounded-sm hover:border-blue-200 transition-colors"
              >
                <div className="w-full">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-bold text-gray-900">{ticket.requested_region}</span>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-2 py-1 flex items-center border rounded-sm",
                      ticket.status === 'allocated' ? "bg-green-50 text-green-800 border-green-200" : "bg-amber-50 text-amber-800 border-amber-200"
                    )}>
                      {ticket.status === 'allocated' ? <CheckCircle2 className="w-3 h-3 mr-1"/> : <Clock className="w-3 h-3 mr-1"/>}
                      {ticket.status === 'allocated' ? 'Active' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-gray-500 mb-4 uppercase tracking-widest">Requested: {new Date(ticket.created_at).toLocaleString()}</p>
                  
                  {ticket.status === 'allocated' && ticket.allocated_address ? (
                    <div className="bg-gray-50 border border-gray-200 p-4 font-mono text-sm text-gray-900 whitespace-pre-line shadow-inner rounded-sm">
                      {ticket.allocated_address}
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 border-dashed p-4 font-mono text-xs text-gray-400 uppercase tracking-widest rounded-sm">
                      We are preparing your address...
                    </div>
                  )}
                </div>
                
                {ticket.security_token && (
                  <div className="sm:text-right shrink-0 mt-4 sm:mt-0 border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Passcode</p>
                    <p className="font-mono text-sm font-bold text-gray-900 bg-gray-100 px-2 py-1 inline-block rounded-sm">{ticket.security_token}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
