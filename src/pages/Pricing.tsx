import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export const Pricing = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const plans = [
    {
      name: 'Commercial Shipper',
      subtext: 'Ideal for growing B2B operations needing secure lane placement.',
      discount: '20%',
      features: [
        '20% standard tariff discount (LTL & Parcel)',
        'Basic Address Provisioning',
        'Standard Email support routing',
        'Dimensional Weight (DIM) standard caps',
        'Standard Chain-of-Custody verification'
      ],
      isPopular: false
    },
    {
      name: 'Volume Forwarder',
      subtext: 'Built for scale and continuous transit needs.',
      discount: '40%',
      features: [
        '40% discount allocation across all Freight Classes',
        'Continuous proxy address rotation access',
        'Accelerated courier prioritization',
        'Priority API integration access',
        'Favorable DIM divisors applied'
      ],
      isPopular: true
    },
    {
      name: 'Consolidated Freight',
      subtext: 'Engineered for complex inventory demands.',
      discount: '60%',
      features: [
        'Up to 60% system discount utilizing FTL/LTL container bundling',
        'Dedicated cargo allocation at origin hub',
        'Direct account manager execution',
        '24/7 dedicated customs brokerage support',
        'Custom negotiated DIM parameters'
      ],
      isPopular: false
    }
  ];

  const faqs = [
    {
      q: 'Who holds customs clearance responsibilities?',
      a: 'Customs clearance remains the responsibility of the Consignor (Sender) unless specified under the Consolidated Freight tier. We provide automated Commercial Invoice generation to expedite the brokerage process.'
    },
    {
      q: 'How frequently are tracking updates pushed?',
      a: 'Tracking events are pushed in real-time as the package crosses distinct physical nodes in our hand-to-hand network. Expect updates upon manifest creation, dispatch, hub transit, and final delivery.'
    },
    {
      q: 'What are the insurance caps per tier?',
      a: 'Commercial Shipper includes baseline coverage up to $500 USD based on Bill of Lading (BOL). Volume Forwarders receive up to $2,500 USD. Consolidated Freight limits are negotiated per custom contract.'
    },
    {
      q: 'How is Dimensional Weight (DIM) calculated?',
      a: 'Freight costs are based on either actual gross weight or dimensional weight, whichever is greater. Our Volume and Consolidated tiers apply more favorable DIM divisors (e.g., /166 vs standard /139) to reduce bulk cargo costs.'
    },
    {
      q: 'Are there any hazardous item exclusions?',
      a: 'Yes. We strictly adhere to global aviation regulations. No flammable liquids, lithium batteries (unless equipment-contained), or bio-hazards are permitted on the standard network.'
    },
    {
      q: 'How are localized agents verified for Last-Mile?',
      a: 'All MFC Node Agents undergo strict background verification and utilize encrypted, geo-locked devices to capture inbound and outbound verification images (Proof of Delivery).'
    }
  ];

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
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full overflow-hidden">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-center max-w-3xl mx-auto mb-20">
          <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
            Institutional Tariffs & Pricing.
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-slate-500 leading-relaxed">
            Volume-driven pricing structures tailored for cross-border operations. Calculated by Freight Class and Dimensional Weight (DIM).
          </motion.p>
        </motion.div>

        {/* 3-Column Pricing Grid */}
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32">
          {plans.map((plan, i) => (
            <motion.div 
              variants={fadeUp}
              key={i} 
              className={cn(
                "relative p-10 border bg-white flex flex-col transition-all",
                plan.isPopular ? "border-slate-900 shadow-xl scale-100 lg:scale-105 z-10" : "border-slate-200 hover:border-slate-300 shadow-sm"
              )}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 text-white px-6 py-2 text-[10px] font-bold tracking-[0.2em] uppercase shadow-md">
                  Most Active Volume
                </div>
              )}
              
              <div className="mb-8 mt-2">
                <h3 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed h-10">{plan.subtext}</p>
              </div>
              
              <div className="mb-8 pb-8 border-b border-slate-100">
                <div className="flex items-baseline">
                  <span className="text-6xl font-bold tracking-tighter text-slate-900">{plan.discount}</span>
                  <span className="text-[10px] font-bold text-slate-400 ml-3 uppercase tracking-[0.2em]">Off Retail Tariff</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-start">
                    <Check className="h-5 w-5 text-slate-900 mr-4 shrink-0" />
                    <span className="text-sm text-slate-600 leading-relaxed">{feat}</span>
                  </li>
                ))}
              </ul>
              
              <button className={cn(
                "w-full py-4 text-xs font-bold tracking-[0.2em] uppercase transition-colors rounded-none",
                plan.isPopular 
                  ? "bg-slate-900 text-white hover:bg-slate-800 shadow-md" 
                  : "bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-200"
              )}>
                Request Account Tier
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Accordion Panel */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-8 border-b border-slate-200 pb-4">Operational Parameters (FAQ)</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div 
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                key={i} className="border border-slate-200 bg-white overflow-hidden shadow-sm rounded-none"
              >
                <button 
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none hover:bg-slate-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-bold text-slate-900 tracking-tight text-sm pr-4">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="h-5 w-5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-2 bg-slate-50">
                    <div className="pt-4">{faq.a}</div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};
