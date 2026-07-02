import { Shipment, TrackingEvent, AddressTicket, Profile } from '../types';

export const mockProfile: Profile = {
  id: 'user_123',
  full_name: 'Jane Doe',
  company_name: 'Acme Logistics',
  phone_number: '+1 555 019 8273',
  tier_level: 'volume',
  created_at: new Date().toISOString()
};

export const mockShipments: Shipment[] = [
  {
    id: 'ship_1',
    tracking_id: 'MFC-4829-9182-US',
    user_id: 'user_123',
    carrier_name: 'MFC Direct',
    sender_name: 'Acme Logistics HQ',
    sender_address: '1280 Lexington Ave\nNew York, NY 10028',
    recipient_name: 'TechFlow Inc',
    recipient_address: '4920 Innovation Blvd\nAustin, TX 78701',
    weight_kg: 12.5,
    current_status: 'In Transit',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'ship_2',
    tracking_id: 'MFC-7102-5521-EU',
    user_id: 'user_123',
    carrier_name: 'DHL',
    sender_name: 'Acme Logistics UK',
    sender_address: '221B Baker St\nLondon, UK NW1 6XE',
    recipient_name: 'Bavarian Imports',
    recipient_address: 'Munich Tower 3\nMunich, Germany 80331',
    weight_kg: 8.0,
    current_status: 'Out for Delivery',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'ship_3',
    tracking_id: 'MFC-9921-3012-US',
    user_id: 'user_123',
    carrier_name: 'UPS',
    sender_name: 'Acme Logistics HQ',
    sender_address: '1280 Lexington Ave\nNew York, NY 10028',
    recipient_name: 'Secure Storage LLC',
    recipient_address: '100 Vault Way\nMiami, FL 33101',
    weight_kg: 45.0,
    current_status: 'Delivered',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 8).toISOString()
  }
];

export const mockTrackingEvents: Record<string, TrackingEvent[]> = {
  'ship_1': [
    {
      id: 'ev_1',
      shipment_id: 'ship_1',
      status: 'Manifest Created',
      location: 'New York, NY',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'ev_2',
      shipment_id: 'ship_1',
      status: 'Dispatched',
      location: 'New York City Transit Hub',
      checkpoint_notes: 'Verified weight and dimensions',
      created_at: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    {
      id: 'ev_3',
      shipment_id: 'ship_1',
      status: 'In Transit',
      location: 'Memphis, TN Hub',
      checkpoint_notes: 'Routed to Southern Corridor',
      created_at: new Date(Date.now() - 3600000 * 5).toISOString()
    }
  ]
};

export const mockTickets: AddressTicket[] = [
  {
    id: 'ticket_1',
    user_id: 'user_123',
    requested_region: 'US-EAST',
    status: 'allocated',
    allocated_address: '1092 Proxy Way, Suite 400\nAtlanta, GA 30301\nC/O MFC Node 12',
    security_token: 'SEC-A91B-8X2',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'ticket_2',
    user_id: 'user_123',
    requested_region: 'EU-WEST',
    status: 'pending',
    created_at: new Date().toISOString()
  }
];
