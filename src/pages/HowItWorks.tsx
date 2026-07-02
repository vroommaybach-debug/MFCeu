import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { MapPin, Truck, CheckCircle2, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const HowItWorks = () => {
  const steps = [
    {
      icon: <MapPin className="h-6 w-6 text-white" />,
      title: "Target Allocation Request",
      desc: "Consignor specifies target state or Euro region via dashboard. System generates custom proxy warehouse address tickets."
    },
    {
      icon: <Truck className="h-6 w-6 text-white" />,
      title: "Carrier Injection & Hub Consolidation",
      desc: "Cargo routes via enterprise infrastructure partners (DHL/UPS/FedEx) utilizing volume-discounted freight consolidation."
    },
    {
      icon: <CheckCircle2 className="h-6 w-6 text-white" />,
      title: "Customs Clearance & Node Intercept",
      desc: "Localized physical agents clear customs, secure the item at transit checkpoints, and execute real-time weight checks with high-resolution photo logs."
    },
    {
      icon: <UserCheck className="h-6 w-6 text-white" />,
      title: "Final Signature POD",
      desc: "The parcel moves directly into the Consignee's hands via certified personnel, recording visual delivery signatures (POD) instantly."
    }
  ];

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
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
      
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full overflow-hidden">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="mb-20 text-center md:text-left">
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 mb-6 leading-tight">
            Operational Blueprint.
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-gray-500 leading-relaxed max-w-2xl">
            A chronological mapping of our secure, hand-to-hand network topology from First-Mile to Last-Mile.
          </motion.p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="relative border-l-2 border-gray-100 ml-6 md:ml-12 pb-12">
          {steps.map((step, i) => (
            <motion.div variants={fadeUp} key={i} className="mb-16 relative">
              <div className="absolute -left-8 top-0 bg-blue-600 h-16 w-16 flex items-center justify-center shadow-lg shadow-blue-600/20 rounded-xl">
                {step.icon}
              </div>
              <div className="pl-16 md:pl-20">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-500 mb-2 block">Node 0{i + 1}</span>
                <h3 className="text-2xl font-black tracking-tight text-gray-900 mb-4">{step.title}</h3>
                <p className="text-base text-gray-600 leading-relaxed max-w-2xl bg-gray-50 p-6 md:p-8 border border-gray-200 shadow-sm rounded-xl">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
          
          <div className="absolute bottom-0 -left-2 h-4 w-4 bg-gray-200 rounded-full border-2 border-white" />
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};
