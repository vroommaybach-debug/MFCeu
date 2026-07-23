import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Shield, Globe, Package, ArrowRight, TrendingDown, MapPin, Truck, CheckCircle2, ChevronDown } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { motion } from 'motion/react';
import heroImage from '../assets/images/cinematic_courier_hero_1783022458114.jpg';

export const Home = () => {
  const [trackingId, setTrackingId] = useState('');
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
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-slate-200 selection:text-slate-900">
      <Navbar />
      
      <main>
        {/* 1. HERO & GLOBAL TRACKING CONSOLE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-left z-10 max-w-xl"
            >
              <motion.div variants={fadeUp} className="mb-6 flex items-center">
                <span className="w-8 h-0.5 bg-slate-900 mr-4"></span>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900">Global Logistics Infrastructure</span>
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.05]">
                Precision Routing.<br/>Absolute Scale.
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg text-slate-600 mb-12 leading-relaxed">
                Enterprise-grade logistics architecture. Secure cross-border freight consolidation and verified physical custody across key global corridors.
              </motion.p>
              
              <motion.div variants={fadeUp} className="bg-white p-6 shadow-xl shadow-slate-200/50 border border-slate-200 rounded-sm relative">
                <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-12 pr-4 py-4 border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 font-mono text-sm transition-all rounded-none"
                      placeholder="Enter Tracking ID (e.g., TRK-12345)"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white font-bold tracking-widest uppercase text-xs hover:bg-slate-800 transition-all flex items-center justify-center shrink-0 rounded-none shadow-md"
                  >
                    Track Freight <ArrowRight className="ml-3 h-4 w-4" />
                  </button>
                </form>
              </motion.div>
            </motion.div>

            {/* Right Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(5px)' }} 
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} 
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              className="relative lg:h-[700px] flex justify-end w-full"
            >
               <div className="absolute inset-0 bg-slate-900/5 z-10 hidden lg:block border border-slate-200"></div>
               <img 
                 src={heroImage} 
                 alt="Logistics operational scale" 
                 className="w-full h-full object-cover shadow-2xl border border-slate-200 rounded-sm filter contrast-125 saturate-50"
               />
               
               {/* Institutional Badge */}
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 1.5, duration: 0.6 }}
                 className="absolute bottom-8 -left-8 bg-white p-6 rounded-sm shadow-2xl border border-slate-200 flex items-center gap-5 z-20"
               >
                 <div className="h-14 w-14 rounded-none bg-slate-900 flex items-center justify-center">
                   <Shield className="h-6 w-6 text-white" />
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Chain of Custody</p>
                   <p className="text-slate-900 font-bold text-base tracking-tight">Verified Intercept Protocol</p>
                 </div>
               </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 2. INSTITUTIONAL METRICS */}
        <section className="bg-slate-50 border-y border-slate-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
            >
              {[
                { label: 'Annual Volume', value: '1.2M+' },
                { label: 'Global Nodes', value: '450' },
                { label: 'Transit Shrinkage', value: '0.00%' },
                { label: 'Enterprise Partners', value: '850+' }
              ].map((stat, i) => (
                <motion.div variants={fadeUp} key={i} className="border-l border-slate-300 pl-6">
                  <p className="text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-2">{stat.value}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 3. CORE INFRASTRUCTURE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="mb-20 max-w-3xl"
          >
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-6">Structural Advantages</h2>
            <p className="text-slate-600 text-lg leading-relaxed">Mitigating supply chain volatility through hard assets, secure provisioning, and direct physical oversight from origin to destination.</p>
          </motion.div>
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeUp} className="bg-white rounded-sm border border-slate-200 p-10 hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
              <div className="mb-8">
                <TrendingDown className="h-8 w-8 text-slate-900" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-4 uppercase">Volume Aggregation</h3>
              <p className="text-slate-600 leading-relaxed flex-1 text-sm">
                Consolidating LTL and parcel volume across strategic corridors for optimized load balancing. Institutional clients secure up to 45% off standard commercial tariffs.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="bg-white rounded-sm border border-slate-200 p-10 hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
              <div className="mb-8">
                <Shield className="h-8 w-8 text-slate-900" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-4 uppercase">Proxy Warehousing</h3>
              <p className="text-slate-600 leading-relaxed flex-1 text-sm">
                Generating localized, temporary holding facilities to protect corporate privacy, mask origin points, and establish secure forward-deployed staging areas.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="bg-white rounded-sm border border-slate-200 p-10 hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
              <div className="mb-8">
                <CheckCircle2 className="h-8 w-8 text-slate-900" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-4 uppercase">Final-Mile Intercept</h3>
              <p className="text-slate-600 leading-relaxed flex-1 text-sm">
                Direct physical agent interception at vulnerable hub transitions. Documented with photographic Proof of Delivery (POD) and required biometric sign-offs.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* 4. VISUAL TIMELINE */}
        <section className="bg-slate-900 text-white py-32 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
              className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8"
            >
              <div className="max-w-2xl">
                <motion.h2 variants={fadeUp} className="text-4xl font-bold tracking-tight mb-6">Chain of Custody</motion.h2>
                <motion.p variants={fadeUp} className="text-slate-400 text-lg">A mathematically rigorous progression from origin dispatch to verified final hand-off.</motion.p>
              </div>
              <motion.div variants={fadeUp}>
                 <Link to="/about" className="inline-flex items-center text-white font-bold uppercase tracking-widest text-xs hover:text-slate-300 transition-colors border-b border-white pb-1">
                   View Methodology <ArrowRight className="ml-2 h-4 w-4" />
                 </Link>
              </motion.div>
            </motion.div>
            
            <div className="relative">
              {/* Desktop Line */}
              <div className="hidden md:block absolute top-[40px] left-0 w-full h-px bg-slate-800"></div>
              
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-4 relative z-10"
              >
                {[
                  { step: '01', title: 'Origin Processing', icon: <Package className="w-5 h-5" /> },
                  { step: '02', title: 'Hub Consolidation', icon: <Globe className="w-5 h-5" /> },
                  { step: '03', title: 'Customs Clearance', icon: <Shield className="w-5 h-5" /> },
                  { step: '04', title: 'Agent Intercept', icon: <Truck className="w-5 h-5" /> },
                  { step: '05', title: 'Verified Delivery', icon: <CheckCircle2 className="w-5 h-5" /> }
                ].map((item, i) => (
                  <motion.div variants={fadeUp} key={i} className="flex flex-col items-start md:items-center text-left md:text-center group">
                    <div className="w-20 h-20 bg-slate-900 border border-slate-700 flex items-center justify-center mb-6 text-slate-300 transition-all duration-300 shadow-lg">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 mb-2 block tracking-[0.2em]">PHASE {item.step}</span>
                    <h4 className="font-bold text-sm tracking-tight text-white">{item.title}</h4>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* 5. INTERACTIVE FREIGHT ESTIMATOR */}
        <section className="py-32 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                <motion.h2 variants={fadeUp} className="text-4xl font-bold tracking-tight text-slate-900 mb-6">Cost Analysis Simulator</motion.h2>
                <motion.p variants={fadeUp} className="text-slate-600 leading-relaxed mb-10 text-lg">
                  Project capital efficiencies utilizing our aggregated transit corridors compared to standard commercial retail tariffs.
                </motion.p>
                <motion.div variants={staggerContainer} className="space-y-6">
                  <motion.div variants={fadeUp} className="flex items-center text-slate-900">
                    <div className="w-8 h-8 flex items-center justify-center mr-4">
                      <CheckCircle2 className="w-5 h-5 text-slate-900" />
                    </div>
                    <span className="font-bold text-sm tracking-tight">Includes Brokerage & Handling</span>
                  </motion.div>
                  <motion.div variants={fadeUp} className="flex items-center text-slate-900">
                    <div className="w-8 h-8 flex items-center justify-center mr-4">
                      <CheckCircle2 className="w-5 h-5 text-slate-900" />
                    </div>
                    <span className="font-bold text-sm tracking-tight">Dimensional Weight (DIM) Factored</span>
                  </motion.div>
                  <motion.div variants={fadeUp} className="flex items-center text-slate-900">
                    <div className="w-8 h-8 flex items-center justify-center mr-4">
                      <CheckCircle2 className="w-5 h-5 text-slate-900" />
                    </div>
                    <span className="font-bold text-sm tracking-tight">Premium Insurance Coverage</span>
                  </motion.div>
                </motion.div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-white p-10 shadow-xl border border-slate-200"
              >
                <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">Origin Gateway</label>
                      <div className="relative">
                        <select className="block w-full appearance-none bg-slate-50 border border-slate-300 text-slate-900 py-4 px-4 pr-10 text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 rounded-none transition-all">
                          <option>US - East Coast (JFK)</option>
                          <option>US - West Coast (LAX)</option>
                          <option>EU - Germany (FRA)</option>
                          <option>EU - UK (LHR)</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">Destination</label>
                      <div className="relative">
                        <select className="block w-full appearance-none bg-slate-50 border border-slate-300 text-slate-900 py-4 px-4 pr-10 text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 rounded-none transition-all">
                          <option>EU - UK (LHR)</option>
                          <option>EU - Germany (FRA)</option>
                          <option>US - East Coast (JFK)</option>
                          <option>US - West Coast (LAX)</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">Est. Weight (KG)</label>
                    <input type="number" placeholder="0.00" className="block w-full bg-slate-50 border border-slate-300 text-slate-900 py-4 px-4 text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 font-mono rounded-none transition-all" />
                  </div>
                  
                  <div className="pt-6">
                    <button className="w-full py-4 bg-slate-900 text-white font-bold tracking-[0.2em] uppercase text-xs hover:bg-slate-800 transition-colors rounded-none shadow-md">
                      Calculate Projection
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
              className="text-4xl font-bold tracking-tight text-slate-900 mb-16"
            >
              Institutional Verification
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className="p-12 border border-slate-200 bg-white relative group hover:border-slate-400 transition-colors"
              >
                <div className="mb-8">
                  <span className="text-4xl text-slate-900 font-serif leading-none">"</span>
                </div>
                <p className="text-lg text-slate-800 leading-relaxed mb-10">
                  MFC's hand-to-hand network reduced our cross-border transit shrinkage from 4.2% to an absolute zero. The photographic Proof of Delivery protocol has completely eliminated consignee disputes.
                </p>
                <div className="flex items-center border-t border-slate-100 pt-6">
                  <div>
                    <p className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-1">Sarah Thorne</p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">Dir. Global Logistics, Veloce Tech</p>
                  </div>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                className="p-12 border border-slate-200 bg-white relative group hover:border-slate-400 transition-colors"
              >
                <div className="mb-8">
                  <span className="text-4xl text-slate-900 font-serif leading-none">"</span>
                </div>
                <p className="text-lg text-slate-800 leading-relaxed mb-10">
                  The proxy warehouse provisioning allowed us to localize our returns process in Europe without establishing physical corporate entities. The consolidated freight tier saved us 38% in Q4 alone.
                </p>
                <div className="flex items-center border-t border-slate-100 pt-6">
                  <div>
                    <p className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-1">Marcus Reed</p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">VP Supply Chain, Apex Goods</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 7. GLOBAL REACH MAP */}
        <section className="bg-[#0B132B] text-white py-32 border-t border-slate-900 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="lg:w-1/3">
                <motion.div variants={fadeUp} className="mb-6 flex items-center">
                  <span className="w-8 h-px bg-slate-500 mr-4"></span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Network Topology</span>
                </motion.div>
                <motion.h2 variants={fadeUp} className="text-4xl font-bold tracking-tight mb-6">Strategic Corridors</motion.h2>
                <motion.p variants={fadeUp} className="text-slate-400 mb-10 leading-relaxed text-lg">
                  Connecting major US freight hubs to Western European handling gateways. High-frequency LTL and Air Cargo lines managed with absolute precision.
                </motion.p>
                <motion.div variants={fadeUp}>
                  <Link to="/about" className="inline-flex items-center text-white font-bold uppercase tracking-[0.2em] text-xs hover:text-slate-300 transition-colors border-b border-white pb-1">
                    Explore Infrastructure <ArrowRight className="ml-3 h-4 w-4" />
                  </Link>
                </motion.div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
                className="lg:w-2/3 w-full h-[500px] border border-slate-800 relative bg-[#070b19] shadow-2xl"
              >
                {/* Abstract Data Visualization Map */}
                <svg className="absolute inset-0 w-full h-full opacity-80" viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid background */}
                  <g className="opacity-10">
                    <line x1="0" y1="100" x2="800" y2="100" stroke="#ffffff" strokeWidth="1" />
                    <line x1="0" y1="200" x2="800" y2="200" stroke="#ffffff" strokeWidth="1" />
                    <line x1="0" y1="300" x2="800" y2="300" stroke="#ffffff" strokeWidth="1" />
                    <line x1="0" y1="400" x2="800" y2="400" stroke="#ffffff" strokeWidth="1" />
                    <line x1="200" y1="0" x2="200" y2="500" stroke="#ffffff" strokeWidth="1" />
                    <line x1="400" y1="0" x2="400" y2="500" stroke="#ffffff" strokeWidth="1" />
                    <line x1="600" y1="0" x2="600" y2="500" stroke="#ffffff" strokeWidth="1" />
                  </g>

                  {/* Flight Paths */}
                  <path d="M150 250 C 300 120, 450 120, 600 200" stroke="#ffffff" strokeWidth="1" strokeDasharray="2 4" className="opacity-40" />
                  <path d="M150 250 C 300 120, 450 120, 600 200" stroke="#ffffff" strokeWidth="2" strokeDasharray="1000" strokeDashoffset="0" className="animate-[dash_10s_linear_infinite]" />
                  
                  <path d="M150 250 C 350 320, 500 320, 650 250" stroke="#64748b" strokeWidth="1" strokeDasharray="2 4" />
                  <path d="M200 330 C 400 420, 500 320, 650 250" stroke="#64748b" strokeWidth="1" strokeDasharray="2 4" />
                  
                  {/* Nodes */}
                  <g className="text-white">
                    <circle cx="150" cy="250" r="4" fill="currentColor" />
                    <circle cx="150" cy="250" r="16" stroke="currentColor" strokeWidth="1" className="opacity-20 animate-ping" />
                    <text x="140" y="275" fill="currentColor" fontSize="10" fontFamily="monospace" className="tracking-[0.2em] font-bold">JFK</text>
                    
                    <circle cx="200" cy="330" r="3" fill="#94a3b8" />
                    <text x="190" y="350" fill="#94a3b8" fontSize="10" fontFamily="monospace" className="tracking-[0.2em]">MIA</text>

                    <circle cx="80" cy="300" r="3" fill="#94a3b8" />
                    <text x="70" y="320" fill="#94a3b8" fontSize="10" fontFamily="monospace" className="tracking-[0.2em]">LAX</text>
                    
                    <circle cx="600" cy="200" r="4" fill="currentColor" />
                    <circle cx="600" cy="200" r="16" stroke="currentColor" strokeWidth="1" className="opacity-20 animate-ping" />
                    <text x="590" y="185" fill="currentColor" fontSize="10" fontFamily="monospace" className="tracking-[0.2em] font-bold">LHR</text>
                    
                    <circle cx="650" cy="250" r="3" fill="#94a3b8" />
                    <text x="660" y="255" fill="#94a3b8" fontSize="10" fontFamily="monospace" className="tracking-[0.2em]">FRA</text>
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


