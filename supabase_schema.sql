-- Create profiles table for user approval
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    company TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, company, status)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'company_name', 'pending');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create shipments table
CREATE TABLE public.shipments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tracking_id TEXT NOT NULL UNIQUE,
    sender_name TEXT NOT NULL,
    sender_address TEXT,
    recipient_name TEXT NOT NULL,
    recipient_address TEXT NOT NULL,
    carrier_name TEXT NOT NULL DEFAULT 'MFC Network',
    current_status TEXT NOT NULL DEFAULT 'Manifest Created',
    weight_kg NUMERIC,
    content_description TEXT,
    package_received_img TEXT,
    proof_of_delivery_img TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create tracking_events table
CREATE TABLE public.tracking_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shipment_id UUID REFERENCES public.shipments(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    location TEXT NOT NULL,
    checkpoint_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create address_tickets table
CREATE TABLE public.address_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    requested_region TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    allocated_address TEXT,
    security_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.address_tickets ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Policies for shipments
CREATE POLICY "Users can view their own shipments" ON public.shipments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own shipments" ON public.shipments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shipments" ON public.shipments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shipments" ON public.shipments
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public can view shipments by tracking ID" ON public.shipments
    FOR SELECT USING (true);

-- Policies for tracking_events
CREATE POLICY "Users can view tracking events for their shipments" ON public.tracking_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.shipments
            WHERE shipments.id = tracking_events.shipment_id
            AND shipments.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert tracking events for their shipments" ON public.tracking_events
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.shipments
            WHERE shipments.id = tracking_events.shipment_id
            AND shipments.user_id = auth.uid()
        )
    );

CREATE POLICY "Public can view tracking events" ON public.tracking_events
    FOR SELECT USING (true);

-- Policies for address_tickets
CREATE POLICY "Users can view their own address tickets" ON public.address_tickets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own address tickets" ON public.address_tickets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own address tickets" ON public.address_tickets
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own address tickets" ON public.address_tickets
    FOR DELETE USING (auth.uid() = user_id);

-- Functions and Triggers for updated_at
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

-- Set up storage buckets for images (package received & proof of delivery)
INSERT INTO storage.buckets (id, name, public) VALUES ('shipment-images', 'shipment-images', true) ON CONFLICT DO NOTHING;

-- Policy to allow authenticated users to upload to shipment-images
CREATE POLICY "Authenticated users can upload images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'shipment-images' AND auth.role() = 'authenticated');
    
CREATE POLICY "Public can view images" ON storage.objects
    FOR SELECT USING (bucket_id = 'shipment-images');
