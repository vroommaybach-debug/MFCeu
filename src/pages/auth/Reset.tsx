import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Reset = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link to="/" className="inline-block text-xl font-black tracking-tight uppercase text-gray-900">
          MAJOR Freight Courier
        </Link>
        <h2 className="mt-6 text-3xl font-black tracking-tight text-gray-900">
          Reset Gateway
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-gray-200 sm:px-10">
          {isSubmitted ? (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-6">
                If an account exists for that address, password reset instructions have been dispatched.
              </p>
              <Link to="/login" className="text-sm font-bold tracking-widest uppercase text-gray-900 hover:underline">
                Return to Sign In
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleReset}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 font-mono focus:outline-none focus:ring-0 focus:border-gray-900 sm:text-sm transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold tracking-widest uppercase text-white bg-gray-900 hover:bg-gray-800 focus:outline-none transition-all"
                >
                  Request Reset
                </button>
              </div>
            </form>
          )}

          {!isSubmitted && (
            <div className="mt-8 text-center text-sm text-gray-500">
              <Link to="/login" className="font-bold text-gray-900 hover:underline">
                Return to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
