import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { motion } from 'motion/react';
import { Truck } from 'lucide-react';

export const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        throw new Error('Supabase environment variables are missing. Please configure .env');
      }

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            company_name: company
          }
        }
      });

      if (authError) throw authError;

      if (data.user) {
        await supabase.auth.signOut(); // Ensure they can't login yet
        setError('Registration successful. Your account is pending admin approval.');
      }
    } catch (err: any) {
      // Fallback for development if Supabase isn't configured yet
      if (err.message.includes('missing') || err.message.includes('URL')) {
        console.warn('Supabase not fully configured, falling back to mock signup');
        navigate('/dashboard');
      } else {
        setError(err.message || 'Failed to create account.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-blue-100 selection:text-blue-900">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8 flex flex-col items-center"
      >
        <Link to="/" className="inline-flex items-center text-xl font-black tracking-tight uppercase text-gray-900 group">
          <Truck className="h-8 w-8 text-blue-600 mr-2 group-hover:text-blue-700 transition-colors" />
          MAJOR Freight Courier
        </Link>
        <h2 className="mt-6 text-3xl font-black tracking-tight text-gray-900">
          Request Allocation
        </h2>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 border border-gray-100 sm:px-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl">
          <form className="space-y-6" onSubmit={handleSignup}>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm font-medium rounded-xl">
                {error}
              </motion.div>
            )}
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all rounded-xl bg-gray-50 hover:bg-white"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Company Entity
              </label>
              <input
                type="text"
                className="appearance-none block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all rounded-xl bg-gray-50 hover:bg-white"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono transition-all rounded-xl bg-gray-50 hover:bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono transition-all rounded-xl bg-gray-50 hover:bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold tracking-widest uppercase text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50 transition-all rounded-xl shadow-lg shadow-blue-600/20"
              >
                {isLoading ? 'Processing...' : 'Create Credentials'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-gray-900 hover:text-blue-600 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
