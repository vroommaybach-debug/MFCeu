import React, { useState } from 'react';
import { Mail, MessageSquare } from 'lucide-react';
import { mockProfile } from '../../lib/mock-data';

export const Support = () => {
  const [issueType, setIssueType] = useState('Clearance Delay');
  const [message, setMessage] = useState('');
  const [replyPreference, setReplyPreference] = useState('email');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);

    // Simulate Serverless API loop via /api/support
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setMessage('');
    }, 1200);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">Decentralized Support Router</h1>
        <p className="text-gray-500">Immediate, bi-directional triage routed securely to our enterprise handlers.</p>
      </div>

      <div className="bg-white border border-gray-200 p-8 shadow-sm">
        {success ? (
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Support Manifest Dispatched</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Your ticket has been routed to our admin node. Responses will be delivered directly via your preferred channel.
            </p>
            <button 
              onClick={() => setSuccess(false)}
              className="mt-8 text-sm font-bold tracking-widest uppercase text-gray-900 hover:underline"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Client ID
                </label>
                <input
                  type="text"
                  disabled
                  value={mockProfile.id}
                  className="appearance-none block w-full px-3 py-3 border border-gray-200 bg-gray-50 font-mono text-gray-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Issue Classification
                </label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 bg-white focus:outline-none focus:ring-0 focus:border-gray-900 sm:text-sm transition-colors"
                >
                  <option value="Clearance Delay">Customs / Clearance Delay</option>
                  <option value="Node Intercept Issue">Node Intercept Issue</option>
                  <option value="Billing Discrepancy">Billing Discrepancy</option>
                  <option value="Address Allocation">Address Allocation Request</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Detailed Message
              </label>
              <textarea
                required
                rows={6}
                className="appearance-none block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-900 sm:text-sm transition-colors resize-none"
                placeholder="Provide tracking IDs or specific references..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="border-t border-gray-100 pt-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-4">
                Routing Preference & Contact
              </label>
              <div className="flex space-x-6 mb-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="routing"
                    value="email"
                    checked={replyPreference === 'email'}
                    onChange={() => setReplyPreference('email')}
                    className="h-4 w-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                  />
                  <span className="ml-2 flex items-center text-sm text-gray-700">
                    <Mail className="h-4 w-4 mr-1 text-gray-400" /> Secure Email
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="routing"
                    value="sms"
                    checked={replyPreference === 'sms'}
                    onChange={() => setReplyPreference('sms')}
                    className="h-4 w-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                  />
                  <span className="ml-2 flex items-center text-sm text-gray-700">
                    <MessageSquare className="h-4 w-4 mr-1 text-gray-400" /> Direct SMS
                  </span>
                </label>
              </div>
              
              {replyPreference === 'email' ? (
                <input 
                  type="email"
                  placeholder="Enter contact email address..."
                  defaultValue={mockProfile.email}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 bg-white focus:outline-none focus:ring-0 focus:border-gray-900 sm:text-sm transition-colors"
                />
              ) : (
                <input 
                  type="tel"
                  placeholder="Enter contact phone number..."
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 bg-white focus:outline-none focus:ring-0 focus:border-gray-900 sm:text-sm transition-colors"
                />
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold tracking-widest uppercase text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? 'Routing to Admin Node...' : 'Dispatch Ticket'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
