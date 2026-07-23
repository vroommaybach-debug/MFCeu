import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Truck } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Track', path: '/' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About', path: '/about' },
    { name: 'How It Works', path: '/how-it-works' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b border-slate-200 bg-white sticky top-0 z-50 font-sans shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <Truck className="h-6 w-6 text-slate-900 mr-2 group-hover:text-slate-700 transition-colors" />
              <span className="font-bold text-lg tracking-tight text-slate-900 uppercase">
                MAJOR Freight
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-[10px] uppercase font-bold transition-colors tracking-[0.2em] relative py-2",
                  isActive(link.path) ? "text-slate-900" : "text-slate-500 hover:text-slate-900"
                )}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div layoutId="navbar-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
                )}
              </Link>
            ))}
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-3 border border-slate-900 text-[10px] font-bold tracking-[0.2em] uppercase rounded-none text-white bg-slate-900 hover:bg-white hover:text-slate-900 transition-colors shadow-sm"
            >
              Sign In
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-slate-900 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 bg-slate-50 absolute w-full z-40 shadow-xl overflow-hidden"
          >
            <div className="pt-2 pb-6 space-y-1 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "block py-4 text-xs font-bold uppercase tracking-[0.2em] border-b border-slate-200 transition-colors",
                    isActive(link.path)
                      ? "text-slate-900 border-slate-900"
                      : "text-slate-500 hover:text-slate-900"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/login"
                className="block mt-6 text-center w-full py-4 text-xs font-bold uppercase tracking-[0.2em] bg-slate-900 text-white border border-slate-900 rounded-none shadow-sm hover:bg-white hover:text-slate-900 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
