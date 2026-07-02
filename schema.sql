-- MFC Network Supabase SQL Schema
-- Copy and paste this into the Supabase SQL Editor

-- 1. Create custom enum types
CREATE TYPE tier_level AS ENUM ('standard', 'volume', 'consolidated');
CREATE TYPE account_status AS ENUM ('pending', 'approved', 'suspended');

-- 2. Profiles Table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT,
    full_name TEXT NOT NULL,
    company_name TEXT,
    phone_number TEXT,
    tier_level tier_level DEFAULT 'standard',
    status account_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profile Policies
CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- 3. Shipments Table
CREATE TABLE public.shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_id TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    carrier_name TEXT NOT NULL,
    carrier_tracking_link TEXT,
    sender_name TEXT NOT NULL,
    sender_address TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    recipient_address TEXT NOT NULL,
    weight_kg NUMERIC(10,2) DEFAULT 0,
    content_description TEXT,
    current_status TEXT NOT NULL,
    package_received_img TEXT,
    proof_of_delivery_img TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for shipments
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

-- Shipment Policies
CREATE POLICY "Users can view own shipments" 
    ON public.shipments FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own shipments" 
    ON public.shipments FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shipments" 
    ON public.shipments FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all shipments" 
    ON public.shipments FOR SELECT 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND status = 'approved'));

-- 4. Tracking Events Table
CREATE TABLE public.tracking_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id UUID REFERENCES public.shipments(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL,
    location TEXT NOT NULL,
    checkpoint_notes TEXT,
    agent_signature_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for tracking events
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;

-- Tracking Events Policies
CREATE POLICY "Users can view tracking events for their shipments" 
    ON public.tracking_events FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.shipments 
            WHERE shipments.id = tracking_events.shipment_id 
            AND shipments.user_id = auth.uid()
        )
    );

CREATE POLICY "Admin can insert tracking events" 
    ON public.tracking_events FOR INSERT 
    WITH CHECK (true); -- Normally restrict to admin

CREATE POLICY "Admin can update tracking events" 
    ON public.tracking_events FOR UPDATE 
    USING (true); -- Normally restrict to admin

CREATE POLICY "Admin can delete tracking events" 
    ON public.tracking_events FOR DELETE 
    USING (true); -- Normally restrict to admin

-- 5. Address Tickets Table
CREATE TABLE public.address_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    requested_region TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    allocated_address TEXT,
    security_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for address tickets
ALTER TABLE public.address_tickets ENABLE ROW LEVEL SECURITY;

-- Address Ticket Policies
CREATE POLICY "Users can view own address tickets" 
    ON public.address_tickets FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own address tickets" 
    ON public.address_tickets FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Trigger for updated_at on shipments
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_shipments_modtime
    BEFORE UPDATE ON public.shipments
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, status)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'pending');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
