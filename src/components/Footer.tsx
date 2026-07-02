import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16 border-t border-gray-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <span className="font-black text-xl tracking-tight text-white uppercase mb-4 block">
              MAJOR Freight Courier
            </span>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Uncompromising Chain of Custody. Secure cross-border freight forwarding and hand-to-hand parcel delivery across the US and European Union.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-sm text-gray-300 hover:text-white transition-colors">About MFC</Link></li>
              <li><Link to="/about" className="text-sm text-gray-300 hover:text-white transition-colors">Global Fleet</Link></li>
              <li><Link to="/about" className="text-sm text-gray-300 hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/about" className="text-sm text-gray-300 hover:text-white transition-colors">Press & Media</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Services</h4>
            <ul className="space-y-4">
              <li><Link to="/pricing" className="text-sm text-gray-300 hover:text-white transition-colors">LTL/FTL Freight</Link></li>
              <li><Link to="/pricing" className="text-sm text-gray-300 hover:text-white transition-colors">Air Cargo</Link></li>
              <li><Link to="/how-it-works" className="text-sm text-gray-300 hover:text-white transition-colors">Secure Proxy Addresses</Link></li>
              <li><Link to="/how-it-works" className="text-sm text-gray-300 hover:text-white transition-colors">Customs Brokerage</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-sm text-gray-300 hover:text-white transition-colors">Track a Waybill</Link></li>
              <li><Link to="/help" className="text-sm text-gray-300 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/help" className="text-sm text-gray-300 hover:text-white transition-colors">File a Claim</Link></li>
              <li><Link to="/help" className="text-sm text-gray-300 hover:text-white transition-colors">Developer API</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap gap-4 md:gap-8">
            <Link to="/terms" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Terms of Carriage</Link>
            <Link to="/privacy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Bill of Lading (BOL) Conditions</Link>
            <Link to="/privacy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">GDPR Compliance</Link>
            <Link to="/terms" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Prohibited Items List</Link>
          </div>
          <p className="text-xs text-gray-600 font-mono uppercase tracking-wider">
            &copy; {new Date().getFullYear()} MFC Global. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
