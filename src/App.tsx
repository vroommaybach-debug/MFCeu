/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { Home } from './pages/Home';
import { Pricing } from './pages/Pricing';
import { HowItWorks } from './pages/HowItWorks';
import { About } from './pages/About';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Help } from './pages/Help';
import { Track } from './pages/Track';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { Reset } from './pages/auth/Reset';
import { DashboardLayout } from './pages/dashboard/DashboardLayout';
import { Overview } from './pages/dashboard/Overview';
import { Shipments } from './pages/dashboard/Shipments';
import { Addresses } from './pages/dashboard/Addresses';
import { Support } from './pages/dashboard/Support';

import { Documents } from './pages/dashboard/Documents';
import { Billing } from './pages/dashboard/Billing';
import { FxAdmin } from './pages/admin/FxAdmin';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/track" element={<Track />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/help" element={<Help />} />
        
        {/* Auth Engine */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset" element={<Reset />} />
        
        {/* Secure User System Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="shipments" element={<Shipments />} />
          <Route path="addresses" element={<Addresses />} />
          <Route path="support" element={<Support />} />
          <Route path="documents" element={<Documents />} />
          <Route path="billing" element={<Billing />} />
        </Route>

        <Route path="/admin" element={<FxAdmin />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

