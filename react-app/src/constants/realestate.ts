// Shared constants & field config for the Real Estate module.

export const EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Fujairah', 'Ras Al Khaimah', 'Umm Al Quwain'];
export const PURPOSES = ['Rent', 'Sale'];
export const RENT_PERIODS = ['Monthly', 'Yearly'];
export const FURNISHED = ['Furnished', 'Unfurnished', 'Partly Furnished'];
export const BEDROOM_OPTS = ['Studio', 'Shared', '1', '2', '3', '4', '5', '6', '7+'];
export const BATHROOM_OPTS = ['Shared', '1', '2', '3', '4', '5', '6+'];

export interface PropFieldDef {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'select';
  options?: string[];
  placeholder?: string;
}

// The detail fields shown for a property listing (same set drives form + detail).
export const PROPERTY_FIELDS: PropFieldDef[] = [
  { key: 'bedrooms', label: 'Bedrooms', type: 'select', options: BEDROOM_OPTS },
  { key: 'bathrooms', label: 'Bathrooms', type: 'select', options: BATHROOM_OPTS },
  { key: 'area_sqft', label: 'Area (sqft)', placeholder: '1200 sqft' },
  { key: 'furnished', label: 'Furnishing', type: 'select', options: FURNISHED },
  { key: 'parking', label: 'Parking', placeholder: 'Yes / No / 2 covered' },
];

// Infer Rent/Sale from a category name (Bedspace/Rooms/…for Rent = Rent).
export function purposeFromCategory(name?: string | null): 'Rent' | 'Sale' {
  const n = (name || '').toLowerCase();
  return n.includes('sale') ? 'Sale' : 'Rent';
}

// Price suffix for cards/detail (rentals show the period).
export function priceSuffix(purpose?: string | null, rentPeriod?: string | null): string {
  if (purpose === 'Sale') return '';
  if (rentPeriod === 'Monthly') return '/month';
  if (rentPeriod === 'Yearly') return '/year';
  return purpose === 'Rent' ? '/year' : '';
}

export function fmtPrice(price: unknown, currency = 'AED'): string {
  const n = Number(price);
  if (!n) return 'Price on request';
  return `${currency} ${n.toLocaleString()}`;
}
