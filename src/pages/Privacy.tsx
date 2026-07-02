import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { motion } from 'motion/react';

export const Privacy = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-black text-gray-900 mb-8">Privacy Policy</h1>
          <div className="prose prose-lg text-gray-600 space-y-6">
            <p>
              Your privacy and data security are our top priorities. This Privacy Policy details how Major Freight Courier ("MFC", "we", "our") collects, uses, and protects your information across our logistics network.
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
            <p>
              We collect operational data required to execute secure freight forwarding, including consignor/consignee names, addresses, contact numbers, and billing information. For specialized services, we may collect photographic proof of delivery and biometric signatures.
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Data Processing & Custody</h2>
            <p>
              All transit and logistics data is strictly compartmentalized. We only share necessary routing information with verified carriers in our network. Your address and business details are not sold to third-party advertisers.
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Security Infrastructure</h2>
            <p>
              Our databases utilize enterprise-grade encryption. Proxy warehouse locations and routing codes are dynamically generated and expire upon final delivery.
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Your Rights</h2>
            <p>
              Under global data protection laws (including GDPR and CCPA), you hold the right to request access to, or deletion of, your personal logistics records, except where regulatory compliance mandates retention of shipping manifests.
            </p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};
