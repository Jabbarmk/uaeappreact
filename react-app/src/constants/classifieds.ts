// Category-specific detail fields for classified ads.
// The form and detail page both derive which fields to show from the
// selected category's name (keyword match), so it stays robust to id changes.

export const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
export const TRANSMISSIONS = ['Automatic', 'Manual'];
export const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];

export interface FieldDef {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'select';
  options?: string[];
  placeholder?: string;
}

const GENERIC: FieldDef[] = [
  { key: 'brand', label: 'Brand', placeholder: 'Apple, Samsung…' },
  { key: 'model', label: 'Model', placeholder: 'Model name' },
  { key: 'color', label: 'Color', placeholder: 'Black, White…' },
  { key: 'condition_status', label: 'Condition', type: 'select', options: CONDITIONS },
];

const MOBILE: FieldDef[] = [
  { key: 'brand', label: 'Brand', placeholder: 'Apple, Samsung…' },
  { key: 'model', label: 'Model', placeholder: 'iPhone 14 Pro…' },
  { key: 'storage', label: 'Storage', placeholder: '128GB, 256GB…' },
  { key: 'memory', label: 'RAM / Memory', placeholder: '6GB, 8GB…' },
  { key: 'color', label: 'Color', placeholder: 'Black, Purple…' },
  { key: 'battery_health', label: 'Battery Health', placeholder: '94%' },
  { key: 'carrier_lock', label: 'Carrier Lock', placeholder: 'Unlocked' },
  { key: 'condition_status', label: 'Condition', type: 'select', options: CONDITIONS },
];

const CAR: FieldDef[] = [
  { key: 'brand', label: 'Brand', placeholder: 'Toyota, Nissan…' },
  { key: 'model', label: 'Model', placeholder: 'Land Cruiser…' },
  { key: 'year', label: 'Year', type: 'number', placeholder: '2020' },
  { key: 'mileage', label: 'Mileage (km)', placeholder: '98,000 km' },
  { key: 'color', label: 'Color', placeholder: 'White, Black…' },
  { key: 'transmission', label: 'Transmission', type: 'select', options: TRANSMISSIONS },
  { key: 'fuel_type', label: 'Fuel Type', type: 'select', options: FUEL_TYPES },
  { key: 'condition_status', label: 'Condition', type: 'select', options: CONDITIONS },
];

const FURNITURE: FieldDef[] = [
  { key: 'furniture_type', label: 'Type', placeholder: 'Sofa, Bed, Table…' },
  { key: 'material', label: 'Material', placeholder: 'Wood, Fabric…' },
  { key: 'color', label: 'Color', placeholder: 'Grey, Brown…' },
  { key: 'dimensions', label: 'Dimensions', placeholder: '200 x 90 cm' },
  { key: 'condition_status', label: 'Condition', type: 'select', options: CONDITIONS },
];

// Every field key that can be sent to the API (union of all sets).
export const ALL_CLASSIFIED_FIELD_KEYS = [
  'brand', 'model', 'color', 'condition_status',
  'storage', 'memory', 'battery_health', 'carrier_lock',
  'year', 'mileage', 'transmission', 'fuel_type',
  'furniture_type', 'material', 'dimensions',
];

export function getClassifiedFields(categoryName?: string | null): FieldDef[] {
  const n = (categoryName || '').toLowerCase();
  if (n.includes('mobile') || n.includes('phone')) return MOBILE;
  if (n.includes('car') || n.includes('vehicle') || n.includes('bike')) return CAR;
  if (n.includes('furniture')) return FURNITURE;
  return GENERIC;
}
