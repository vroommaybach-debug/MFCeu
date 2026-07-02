import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Shield, Globe, Package, ArrowRight, TrendingDown, MapPin, Truck, CheckCircle2, ChevronDown } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { motion } from 'motion/react';
import heroImage from '../assets/images/cinematic_courier_hero_1783022458114.jpg';

export const Home = () => {
  const [trackingId, setTrackingId] = useState('');
  const [estOrigin, setEstOrigin] = useState('');
  const [estDest, setEstDest] = useState('');
  const [estWeight, setEstWeight] = useState('');
  const navigate = useNavigate();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      navigate(`/track?id=${trackingId}`);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      
      <main>
        {/* 1. HERO & GLOBAL TRACKING CONSOLE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-left z-10 max-w-xl"
            >
              <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 mb-6 leading-[1.1]">
                Precision Delivery.<br/>Global Scale.
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg text-gray-500 mb-10 leading-relaxed">
                Experience unparalleled logistics. Secure cross-border freight and hand-to-hand parcel delivery across the US and Europe.
              </motion.p>
              
              <motion.div variants={fadeUp} className="bg-white p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-gray-100 rounded-2xl relative">
                <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-12 pr-4 py-4 border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono text-sm transition-all rounded-xl"
                      placeholder="Enter Tracking Number"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold tracking-widest uppercase text-xs hover:bg-blue-700 transition-all flex items-center justify-center shrink-0 rounded-xl shadow-lg shadow-blue-600/20"
                  >
                    Track <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </form>
              </motion.div>
            </motion.div>

            {/* Right Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }} 
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} 
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              className="relative lg:h-[650px] flex justify-end w-full"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent z-10 hidden lg:block w-32"></div>
               <img 
                 src={heroImage} 
                 alt="Professional courier smiling" 
                 className="w-full h-full object-cover rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-gray-100"
               />
               
               {/* Floating Badge */}
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 1.5, duration: 0.6 }}
                 className="absolute bottom-10 -left-6 bg-white p-4 rounded-xl shadow-2xl border border-gray-100 flex items-center gap-4 z-20"
               >
                 <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                   <Shield className="h-6 w-6 text-blue-600" />
                 </div>
                 <div>
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Insured Custody</p>
                   <p className="text-gray-900 font-bold text-sm">100% Protection</p>
                 </div>
               </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 2. CARRIER NETWORK & OPERATIONAL SCALE */}
        <section className="bg-gray-50 border-b border-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
              className="flex flex-col lg:flex-row items-center justify-between gap-12"
            >
              <motion.div variants={fadeUp} className="lg:max-w-md">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3 border-l-2 border-blue-600 pl-3">Operational Scale</p>
                <p className="text-gray-900 font-medium leading-relaxed text-lg">
                  Routing over 10,000+ monthly shipments for 350+ EU enterprises and 180+ US commercial partners.
                </p>
              </motion.div>
              <motion.div variants={fadeUp} className="flex flex-wrap justify-center lg:justify-end gap-12 opacity-40 grayscale items-center">
                <span className="text-3xl font-black tracking-tighter hover:opacity-100 hover:grayscale-0 transition-all cursor-default">DHL</span>
                <span className="text-3xl font-black tracking-tighter hover:opacity-100 hover:grayscale-0 transition-all cursor-default">UPS</span>
                <span className="text-3xl font-black tracking-tighter hover:opacity-100 hover:grayscale-0 transition-all cursor-default">FedEx</span>
                <span className="text-3xl font-black tracking-tighter hover:opacity-100 hover:grayscale-0 transition-all cursor-default">USPS</span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 3. CORE LOGISTICS SERVICES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="mb-20 text-center max-w-3xl mx-auto"
          >
            <motion.h2 variants={fadeUp} className="text-4xl font-black tracking-tight text-gray-900 mb-6">Enterprise Infrastructure</motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 text-lg">Bypassing standard vulnerabilities through structural consolidation and verified physical custody.</motion.p>
          </motion.div>
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 p-10 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 group flex flex-col h-full">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <TrendingDown className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-4">Freight Consolidation</h3>
              <p className="text-gray-600 leading-relaxed flex-1">
                Grouping LTL and parcel volume across strategic corridors for maximum cost efficiency. Secure up to 60% off standard commercial tariffs.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 p-10 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 group flex flex-col h-full">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-4">Secure Provisioning</h3>
              <p className="text-gray-600 leading-relaxed flex-1">
                Generating localized, temporary proxy warehouses to protect privacy, preventing theft and masking origin points seamlessly.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 p-10 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 group flex flex-col h-full">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-4">First-to-Last Mile</h3>
              <p className="text-gray-600 leading-relaxed flex-1">
                Physical agent interception at vulnerable hub transitions with verified photographic Proof of Delivery (POD) and biometric signatures.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* 4. THE CHAIN OF CUSTODY (VISUAL TIMELINE) */}
        <section className="bg-gray-900 text-white py-32 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
              className="text-center max-w-3xl mx-auto mb-24"
            >
              <motion.h2 variants={fadeUp} className="text-4xl font-black tracking-tight mb-6">The Chain of Custody</motion.h2>
              <motion.p variants={fadeUp} className="text-gray-400 text-lg">A rigorous, visually verifiable progression from origin dispatch to final hand-off.</motion.p>
            </motion.div>
            
            <div className="relative">
              {/* Desktop Line */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 -translate-y-1/2"></div>
              
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-4 relative z-10"
              >
                {[
                  { step: '01', title: 'Origin', icon: <Package className="w-6 h-6" /> },
                  { step: '02', title: 'Hub', icon: <Globe className="w-6 h-6" /> },
                  { step: '03', title: 'Customs', icon: <Shield className="w-6 h-6" /> },
                  { step: '04', title: 'Intercept', icon: <Truck className="w-6 h-6" /> },
                  { step: '05', title: 'Delivery', icon: <CheckCircle2 className="w-6 h-6" /> }
                ].map((item, i) => (
                  <motion.div variants={fadeUp} key={i} className="flex flex-col items-center text-center group">
                    <div className="w-16 h-16 bg-gray-900 rounded-2xl border border-gray-700 flex items-center justify-center mb-6 text-gray-300 group-hover:border-blue-500 group-hover:text-blue-400 transition-all shadow-xl group-hover:shadow-blue-500/20 group-hover:-translate-y-2 duration-300">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 mb-2 block tracking-widest">PHASE {item.step}</span>
                    <h4 className="font-bold text-sm uppercase tracking-widest text-white group-hover:text-blue-400 transition-colors">{item.title}</h4>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* 5. INTERACTIVE FREIGHT ESTIMATOR */}
        <section className="py-32 bg-gray-50 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                <motion.h2 variants={fadeUp} className="text-4xl font-black tracking-tight text-gray-900 mb-6">Intelligent Routing Simulator</motion.h2>
                <motion.p variants={fadeUp} className="text-gray-600 leading-relaxed mb-10 text-lg">
                  Calculate projected cost savings utilizing our volume-discounted transit corridors compared to standard retail tariffs.
                </motion.p>
                <motion.div variants={staggerContainer} className="space-y-6">
                  <motion.div variants={fadeUp} className="flex items-center text-gray-900">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-bold">Includes Brokerage & Handling</span>
                  </motion.div>
                  <motion.div variants={fadeUp} className="flex items-center text-gray-900">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-bold">Dimensional Weight (DIM) factored</span>
                  </motion.div>
                  <motion.div variants={fadeUp} className="flex items-center text-gray-900">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-bold">Premium Insurance Coverage</span>
                  </motion.div>
                </motion.div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-white p-8 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-gray-100"
              >
                <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Origin</label>
                      <div className="relative">
                        <select className="block w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 py-4 px-4 pr-10 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl transition-all">
                          <option>US - East Coast</option>
                          <option>US - West Coast</option>
                          <option>EU - Frankfurt</option>
                          <option>EU - London</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Destination</label>
                      <div className="relative">
                        <select className="block w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 py-4 px-4 pr-10 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl transition-all">
                          <option>EU - London</option>
                          <option>EU - Frankfurt</option>
                          <option>US - East Coast</option>
                          <option>US - West Coast</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Estimated Weight (KG)</label>
                    <input type="number" placeholder="0.00" className="block w-full bg-gray-50 border border-gray-200 text-gray-900 py-4 px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono rounded-xl transition-all" />
                  </div>
                  
                  <div className="pt-4">
                    <button className="w-full py-4 bg-blue-600 text-white font-bold tracking-widest uppercase text-sm hover:bg-blue-700 transition-colors rounded-xl shadow-lg shadow-blue-600/20">
                      Calculate Savings
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 6. COMMERCIAL CASE STUDIES */}
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-4xl font-black tracking-tight text-gray-900 mb-16 text-center"
            >
              Institutional Trust
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className="p-10 rounded-3xl border border-gray-100 bg-gray-50 relative hover:shadow-xl transition-shadow"
              >
                <div className="absolute top-6 left-6 text-8xl text-blue-100 font-serif leading-none">"</div>
                <p className="relative z-10 text-lg text-gray-700 leading-relaxed font-medium mb-10 pt-6">
                  MFC's hand-to-hand network reduced our cross-border transit shrinkage from 4.2% to an absolute zero. The photographic Proof of Delivery has completely eliminated consignee disputes.
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center font-bold text-white mr-4 shadow-md">ST</div>
                  <div>
                    <p className="font-bold text-gray-900 text-base">Sarah Thorne</p>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-mono mt-1">Dir. Logistics, Veloce Tech</p>
                  </div>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                className="p-10 rounded-3xl border border-gray-100 bg-gray-50 relative hover:shadow-xl transition-shadow"
              >
                <div className="absolute top-6 left-6 text-8xl text-blue-100 font-serif leading-none">"</div>
                <p className="relative z-10 text-lg text-gray-700 leading-relaxed font-medium mb-10 pt-6">
                  The proxy warehouse provisioning allowed us to localize our returns process in Europe without establishing physical corporate entities. The consolidated freight tier saved us 38% in Q4 alone.
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center font-bold text-white mr-4 shadow-md">MR</div>
                  <div>
                    <p className="font-bold text-gray-900 text-base">Marcus Reed</p>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-mono mt-1">VP Supply Chain, Apex Goods</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 7. GLOBAL REACH MAP */}
        <section className="bg-[#0a0a0a] text-white py-32 border-t border-gray-800 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="lg:w-1/3">
                <motion.h2 variants={fadeUp} className="text-4xl font-black tracking-tight mb-6">Strategic Corridors</motion.h2>
                <motion.p variants={fadeUp} className="text-gray-400 mb-10 leading-relaxed text-lg">
                  Connecting major US freight hubs to Western European handling gateways. High-frequency LTL and Air Cargo lines managed with absolute precision.
                </motion.p>
                <motion.div variants={fadeUp}>
                  <Link to="/about" className="inline-flex items-center text-white font-bold uppercase tracking-widest text-sm hover:text-blue-400 transition-colors">
                    Explore Network Infrastructure <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </motion.div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="lg:w-2/3 w-full h-[500px] border border-gray-800 relative bg-black/50 rounded-3xl overflow-hidden shadow-2xl"
              >
                {/* Abstract Data Visualization Map */}
                <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M150 250 C 300 150, 450 150, 600 200" stroke="currentColor" strokeWidth="2" strokeDasharray="4 6" className="text-blue-900 animate-pulse" />
                  <path d="M150 250 C 350 300, 500 300, 650 250" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 6" className="text-gray-700" />
                  <path d="M200 330 C 400 400, 500 300, 650 250" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 6" className="text-gray-700" />
                  
                  {/* Nodes */}
                  <g className="text-blue-400">
                    <circle cx="150" cy="250" r="5" fill="currentColor" />
                    <circle cx="150" cy="250" r="12" stroke="currentColor" strokeWidth="1" className="opacity-50 animate-ping" />
                    <text x="140" y="275" fill="currentColor" fontSize="12" fontFamily="monospace" className="tracking-widest font-bold">JFK</text>
                    
                    <circle cx="200" cy="330" r="4" fill="#6b7280" />
                    <text x="190" y="355" fill="#9ca3af" fontSize="10" fontFamily="monospace" className="tracking-widest">MIA</text>

                    <circle cx="80" cy="300" r="4" fill="#6b7280" />
                    <text x="70" y="325" fill="#9ca3af" fontSize="10" fontFamily="monospace" className="tracking-widest">LAX</text>
                    
                    <circle cx="600" cy="200" r="5" fill="currentColor" />
                    <circle cx="600" cy="200" r="12" stroke="currentColor" strokeWidth="1" className="opacity-50 animate-ping" />
                    <text x="590" y="185" fill="currentColor" fontSize="12" fontFamily="monospace" className="tracking-widest font-bold">LHR</text>
                    
                    <circle cx="650" cy="250" r="4" fill="#6b7280" />
                    <text x="660" y="255" fill="#9ca3af" fontSize="10" fontFamily="monospace" className="tracking-widest">FRA</text>
                  </g>
                </svg>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

