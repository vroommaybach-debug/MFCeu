export type TierLevel = 'standard' | 'volume' | 'consolidated';
export type CarrierName = 'MFC Direct' | 'DHL' | 'UPS' | 'FedEx' | 'USPS';
export type ShipmentStatus = 'Manifest Created' | 'Dispatched' | 'In Transit' | 'Out for Delivery' | 'Delivered';

export interface Profile {
  id: string;
  email?: string;
  full_name: string;
  company_name?: string;
  phone_number?: string;
  tier_level: TierLevel;
  created_at: string;
}

export interface Shipment {
  id: string;
  tracking_id: string;
  user_id: string;
  carrier_name: CarrierName;
  carrier_tracking_link?: string;
  sender_name: string;
  sender_address: string;
  recipient_name: string;
  recipient_address: string;
  weight_kg: number;
  content_description?: string;
  current_status: ShipmentStatus | string;
  package_received_img?: string;
  proof_of_delivery_img?: string;
  created_at: string;
  updated_at: string;
}

export interface TrackingEvent {
  id: string;
  shipment_id: string;
  status: string;
  location: string;
  checkpoint_notes?: string;
  agent_signature_name?: string;
  created_at: string;
}

export interface AddressTicket {
  id: string;
  user_id: string;
  requested_region: string;
  status: 'pending' | 'allocated' | 'expired';
  allocated_address?: string;
  security_token?: string;
  created_at: string;
}
