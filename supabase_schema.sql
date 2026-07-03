-- ====================================================================
-- SUPABASE FULL SYSTEM REBUILD SQL
-- Run this in your Supabase SQL Editor to wipe and completely rebuild 
-- the tables, triggers, and Row Level Security (RLS) policies.
-- ====================================================================

-- 1. DROP EXISTING TRIGGERS AND FUNCTIONS (TO PREVENT LOCKED REFERENCES)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_updated_at_profiles ON public.profiles;
DROP TRIGGER IF EXISTS handle_updated_at_shipments ON public.shipments;
DROP TRIGGER IF EXISTS handle_updated_at_address_tickets ON public.address_tickets;

DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;

-- 2. DROP TABLES WITH CASCADE
DROP TABLE IF EXISTS public.tracking_events CASCADE;
DROP TABLE IF EXISTS public.shipments CASCADE;
DROP TABLE IF EXISTS public.address_tickets CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 3. RECREATE PROFILES TABLE (Fully matching the frontend Profile interface)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    company_name TEXT,
    phone_number TEXT,
    tier_level TEXT NOT NULL DEFAULT 'standard',
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger to automatically populate the profile on user sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, company_name, phone_number, tier_level, status)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', ''), 
    new.raw_user_meta_data->>'company_name', 
    new.raw_user_meta_data->>'phone_number', 
    COALESCE(new.raw_user_meta_data->>'tier_level', 'standard'), 
    'pending'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. RECREATE SHIPMENTS TABLE (With estimated_delivery & carrier_tracking_link)
CREATE TABLE public.shipments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tracking_id TEXT NOT NULL UNIQUE,
    sender_name TEXT NOT NULL,
    sender_address TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    recipient_address TEXT NOT NULL,
    carrier_name TEXT NOT NULL DEFAULT 'MFC Network',
    carrier_tracking_link TEXT,
    current_status TEXT NOT NULL DEFAULT 'Manifest Created',
    weight_kg NUMERIC NOT NULL DEFAULT 1.5,
    content_description TEXT,
    package_received_img TEXT,
    proof_of_delivery_img TEXT,
    estimated_delivery TEXT DEFAULT '3-5 Business Days',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. RECREATE TRACKING EVENTS TABLE (With agent_signature_name)
CREATE TABLE public.tracking_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shipment_id UUID REFERENCES public.shipments(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    location TEXT NOT NULL,
    checkpoint_notes TEXT,
    agent_signature_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. RECREATE ADDRESS TICKETS TABLE
CREATE TABLE public.address_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    requested_region TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'allocated', 'expired'
    allocated_address TEXT,
    security_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.address_tickets ENABLE ROW LEVEL SECURITY;

-- 8. DEFINE SECURITY POLICIES

-- Policies for Profiles: Users can view and update their own profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Policies for Shipments: Open read, insert, update, delete for complete sandbox/visitor tracking fluidity
CREATE POLICY "Anyone can view shipments" ON public.shipments
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert shipments" ON public.shipments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update shipments" ON public.shipments
    FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete shipments" ON public.shipments
    FOR DELETE USING (true);

-- Policies for Tracking Events: Anyone can view or add checkpoints for any shipment
CREATE POLICY "Anyone can view tracking events" ON public.tracking_events
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert tracking events" ON public.tracking_events
    FOR INSERT WITH CHECK (true);

-- Policies for Address Tickets: Open access for requesting/routing users in sandbox or guest modes
CREATE POLICY "Anyone can view address tickets" ON public.address_tickets
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert address tickets" ON public.address_tickets
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update address tickets" ON public.address_tickets
    FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete address tickets" ON public.address_tickets
    FOR DELETE USING (true);

-- 9. DEFINE AUTOMATIC TIMESTAMP UPDATERS
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_shipments
    BEFORE UPDATE ON public.shipments
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_address_tickets
    BEFORE UPDATE ON public.address_tickets
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 10. SETUP SECURE STORAGE BUCKETS AND STORAGE POLICIES
INSERT INTO storage.buckets (id, name, public) 
VALUES ('shipment-images', 'shipment-images', true) 
ON CONFLICT (id) DO NOTHING;

-- Storage object policies
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
CREATE POLICY "Authenticated users can upload images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'shipment-images' AND auth.role() = 'authenticated');
    
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
CREATE POLICY "Public can view images" ON storage.objects
    FOR SELECT USING (bucket_id = 'shipment-images');
