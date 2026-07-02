import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ShieldCheck, Users, Lock, Globe2 } from 'lucide-react';
import { motion } from 'motion/react';

export const About = () => {
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 overflow-hidden">
        {/* Header */}
        <motion.section initial="hidden" animate="visible" variants={staggerContainer} className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center border-b border-gray-100">
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 mb-6">
            Eliminating Hub Shrinkage.
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-gray-500 leading-relaxed max-w-3xl mx-auto">
            Our operational thesis is simple: automated sorting hubs create blind spots. We secure high-value commercial freight by deploying a verified network of human agents for true hand-to-hand chain of custody.
          </motion.p>
        </motion.section>

        {/* Core Values */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.div variants={fadeUp}><ShieldCheck className="h-10 w-10 text-blue-600 mb-6" /></motion.div>
              <motion.h2 variants={fadeUp} className="text-2xl font-black tracking-tight text-gray-900 mb-4">Security Compliance & Fleet Verification</motion.h2>
              <motion.p variants={fadeUp} className="text-gray-600 leading-relaxed mb-6">
                Every MFC Node Agent undergoes rigorous multi-jurisdictional background checks, financial audits, and operational training before handling commercial Waybills. Our fleet is fully bonded and insured to institutional standards.
              </motion.p>
              <motion.p variants={fadeUp} className="text-gray-600 leading-relaxed">
                Physical interception points are geofenced. Proof of Delivery (POD) requires not just a signature, but biometric device verification and high-resolution imaging of the hand-off environment.
              </motion.p>
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.div variants={fadeUp}><Lock className="h-10 w-10 text-blue-600 mb-6" /></motion.div>
              <motion.h2 variants={fadeUp} className="text-2xl font-black tracking-tight text-gray-900 mb-4">Zero-Trust Logistics</motion.h2>
              <motion.p variants={fadeUp} className="text-gray-600 leading-relaxed mb-6">
                Standard carriers rely on implicit trust between automated hubs. We operate on a Zero-Trust logistics model. Consignments must be visually and physically verified at every node transfer.
              </motion.p>
              <ul className="space-y-4">
                <motion.li variants={fadeUp} className="flex items-start">
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 mr-3 mt-0.5 rounded shadow-sm shadow-blue-600/20">01</span>
                  <span className="text-sm font-medium text-gray-800">Tamper-evident sealing protocols applied at origin.</span>
                </motion.li>
                <motion.li variants={fadeUp} className="flex items-start">
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 mr-3 mt-0.5 rounded shadow-sm shadow-blue-600/20">02</span>
                  <span className="text-sm font-medium text-gray-800">Continuous GPS monitoring of LTL/FTL consolidated runs.</span>
                </motion.li>
                <motion.li variants={fadeUp} className="flex items-start">
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 mr-3 mt-0.5 rounded shadow-sm shadow-blue-600/20">03</span>
                  <span className="text-sm font-medium text-gray-800">Strict segregation of high-value freight from general cargo.</span>
                </motion.li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Global Stats */}
        <section className="bg-gray-900 text-white py-24 border-t border-gray-800">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-800">
              <motion.div variants={fadeUp}>
                <span className="block text-4xl font-black tracking-tighter mb-2 text-blue-400">99.98%</span>
                <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">Successful PODs</span>
              </motion.div>
              <motion.div variants={fadeUp}>
                <span className="block text-4xl font-black tracking-tighter mb-2 text-blue-400">42</span>
                <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">Strategic Hubs</span>
              </motion.div>
              <motion.div variants={fadeUp}>
                <span className="block text-4xl font-black tracking-tighter mb-2 text-blue-400">850+</span>
                <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">Verified Agents</span>
              </motion.div>
              <motion.div variants={fadeUp}>
                <span className="block text-4xl font-black tracking-tighter mb-2 text-blue-400">24/7</span>
                <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">Customs Brokerage</span>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
