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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 overflow-hidden">
        {/* Header */}
        <motion.section initial="hidden" animate="visible" variants={staggerContainer} className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center border-b border-slate-200">
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
            Eliminating Hub Shrinkage.
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-slate-500 leading-relaxed max-w-3xl mx-auto">
            Our operational thesis is simple: automated sorting hubs create blind spots. We secure high-value commercial freight by deploying a verified network of human agents for true hand-to-hand chain of custody.
          </motion.p>
        </motion.section>

        {/* Core Values */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="bg-white p-12 border border-slate-200 shadow-sm">
              <motion.div variants={fadeUp}><ShieldCheck className="h-10 w-10 text-slate-900 mb-8" /></motion.div>
              <motion.h2 variants={fadeUp} className="text-2xl font-bold tracking-tight text-slate-900 mb-6">Security Compliance & Fleet Verification</motion.h2>
              <motion.p variants={fadeUp} className="text-slate-600 leading-relaxed mb-6 text-sm">
                Every MFC Node Agent undergoes rigorous multi-jurisdictional background checks, financial audits, and operational training before handling commercial Waybills. Our fleet is fully bonded and insured to institutional standards.
              </motion.p>
              <motion.p variants={fadeUp} className="text-slate-600 leading-relaxed text-sm">
                Physical interception points are geofenced. Proof of Delivery (POD) requires not just a signature, but biometric device verification and high-resolution imaging of the hand-off environment.
              </motion.p>
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="bg-white p-12 border border-slate-200 shadow-sm">
              <motion.div variants={fadeUp}><Lock className="h-10 w-10 text-slate-900 mb-8" /></motion.div>
              <motion.h2 variants={fadeUp} className="text-2xl font-bold tracking-tight text-slate-900 mb-6">Zero-Trust Logistics</motion.h2>
              <motion.p variants={fadeUp} className="text-slate-600 leading-relaxed mb-8 text-sm">
                Standard carriers rely on implicit trust between automated hubs. We operate on a Zero-Trust logistics model. Consignments must be visually and physically verified at every node transfer.
              </motion.p>
              <ul className="space-y-6">
                <motion.li variants={fadeUp} className="flex items-start">
                  <span className="bg-slate-900 text-white text-[10px] font-mono px-2 py-1 mr-4 mt-0.5 rounded-none">01</span>
                  <span className="text-sm font-medium text-slate-800 leading-relaxed">Tamper-evident sealing protocols applied at origin.</span>
                </motion.li>
                <motion.li variants={fadeUp} className="flex items-start">
                  <span className="bg-slate-900 text-white text-[10px] font-mono px-2 py-1 mr-4 mt-0.5 rounded-none">02</span>
                  <span className="text-sm font-medium text-slate-800 leading-relaxed">Continuous GPS monitoring of LTL/FTL consolidated runs.</span>
                </motion.li>
                <motion.li variants={fadeUp} className="flex items-start">
                  <span className="bg-slate-900 text-white text-[10px] font-mono px-2 py-1 mr-4 mt-0.5 rounded-none">03</span>
                  <span className="text-sm font-medium text-slate-800 leading-relaxed">Strict segregation of high-value freight from general cargo.</span>
                </motion.li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Global Stats */}
        <section className="bg-slate-900 text-white py-24 border-t border-slate-800">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-800">
              <motion.div variants={fadeUp}>
                <span className="block text-5xl font-bold tracking-tighter mb-4 text-white">99.98%</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Successful PODs</span>
              </motion.div>
              <motion.div variants={fadeUp}>
                <span className="block text-5xl font-bold tracking-tighter mb-4 text-white">42</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Strategic Hubs</span>
              </motion.div>
              <motion.div variants={fadeUp}>
                <span className="block text-5xl font-bold tracking-tighter mb-4 text-white">850+</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Verified Agents</span>
              </motion.div>
              <motion.div variants={fadeUp}>
                <span className="block text-5xl font-bold tracking-tighter mb-4 text-white">24/7</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Customs Brokerage</span>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
