import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { motion } from 'motion/react';
import { Search, Mail, Phone, MessageSquare } from 'lucide-react';

export const Help = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-black text-gray-900 mb-6">How can we help you?</h1>
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 shadow-sm transition-colors text-lg rounded-sm"
              placeholder="Search for articles, tracking help, or FAQs..."
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 border border-gray-200 shadow-sm text-center rounded-sm">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="h-6 w-6 text-gray-700" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-500 mb-4 text-sm">Open a ticket for complex logistics issues or claims.</p>
            <a href="#" className="text-blue-600 font-medium text-sm hover:underline">support@mfcglobal.com</a>
          </div>
          
          <div className="bg-white p-8 border border-gray-200 shadow-sm text-center rounded-sm">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Phone className="h-6 w-6 text-gray-700" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Enterprise Desk</h3>
            <p className="text-gray-500 mb-4 text-sm">24/7 dedicated line for Platinum and Gold accounts.</p>
            <a href="#" className="text-blue-600 font-medium text-sm hover:underline">+1 (800) 555-0199</a>
          </div>

          <div className="bg-white p-8 border border-gray-200 shadow-sm text-center rounded-sm">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="h-6 w-6 text-gray-700" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-500 mb-4 text-sm">Available Monday-Friday, 9am - 6pm EST.</p>
            <button className="text-blue-600 font-medium text-sm hover:underline">Start a Conversation</button>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};
