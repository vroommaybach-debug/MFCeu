import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { motion } from 'motion/react';

export const Terms = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-black text-gray-900 mb-8">Terms of Carriage</h1>
          <div className="prose prose-lg text-gray-600 space-y-6">
            <p>
              These Terms of Carriage govern the transportation of goods and freight by Major Freight Courier ("MFC"). By tendering a shipment to MFC, the shipper agrees to these terms.
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Freight Acceptance</h2>
            <p>
              We reserve the right to refuse any shipment that does not comply with our safety standards or regulatory requirements. Hazardous materials must be explicitly declared and pre-approved.
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Liability and Claims</h2>
            <p>
              MFC's liability for loss or damage is strictly limited to the declared value of the shipment or standard industry weight-based calculations, unless premium insurance is purchased at the time of booking.
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Prohibited Items</h2>
            <p>
              Items including but not limited to illegal narcotics, unauthorized firearms, unsanctioned biological materials, and unregulated currency are strictly prohibited. Attempting to ship these items will result in immediate confiscation and reporting to authorities.
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Route Deviations</h2>
            <p>
              MFC retains the right to reroute shipments, utilize proxy warehouses, or change carriers as deemed necessary for security, efficiency, or in response to force majeure events.
            </p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};
