export const DISTRICTS = [
  'Abdoun', 'Sweifieh', 'Khalda', 'Deir Ghbar', 'Dabouq', 'Jabal Amman', 'Marj Al Hamam',
  'Shmeisani', 'Lweibdeh', 'Um Uthaina', "Tla' Al Ali", 'Jubeiha', 'Al Rabieh', 'Sweileh',
  'Wadi Seer', 'Al Wehdat', 'Mecca Street', 'Jabal Hussein', 'Jabal Nuzha', 'Gardens',
  '1st Circle', '2nd Circle', '3rd Circle', '4th Circle', '5th Circle', '6th Circle',
  '7th Circle', '8th Circle', 'Zahran', 'Sports City', 'Abu Nsair', 'Al Yadoudeh',
  'Bayader Wadi Seer', 'Marka', 'Tabarbour', 'Hai Nazzal', 'Arjan', 'Um Summaq',
  'Al Jandaweel', 'Daheit Al Rasheed', 'Ras Al Ain', 'Al Qweismeh', 'Fuhais',
  'Raghadan', 'Basman', 'Al Hashmi Al Shamali', 'Sahab', 'Naour', 'Jiza',
  'Ain Al Basha', 'Ruseifa', 'Zarqa Road', 'Muwaqar', 'Khreibet Al Souq',
  'Um Al Summaq', 'Shafa Badran', 'Al Jubeih', 'Wadi Al Sir North', 'Tlaa Al Ali North',
];

export const AGE_GROUPS = [
  { id: 'infant', label: 'infant', sub: 'infantSub' },
  { id: 'toddler', label: 'toddler', sub: 'toddlerSub' },
  { id: 'preschool', label: 'preschool', sub: 'preschoolSub' },
];

const U = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=640&q=70`;

export type Nursery = {
  id: string; name: string; district: string; rating: number; reviews: number;
  priceFrom: number; unit: string; ages: string[]; avail: 'available' | 'limited' | 'full';
  verified: boolean; sponsored: boolean; tag: string; img: string;
  lat: number; lng: number;
};

export const NURSERIES: Nursery[] = [
  { id: 'n1',  name: 'Little Sprouts Nursery',   district: 'Abdoun',       rating: 4.9, reviews: 128, priceFrom: 180, unit: 'mo', ages: ['infant', 'toddler'],             avail: 'available', verified: true,  sponsored: true,  tag: 'Montessori · Meals included',   img: U('1587654780291-39c9404d746b'), lat: 31.9638, lng: 35.9058 },
  { id: 'n2',  name: 'Olive Tree Kids',           district: 'Sweifieh',     rating: 4.8, reviews: 94,  priceFrom: 160, unit: 'mo', ages: ['toddler', 'preschool'],          avail: 'limited',   verified: true,  sponsored: true,  tag: 'Outdoor garden · Transport',    img: U('1503676260728-1c00da094a0b'), lat: 31.9741, lng: 35.8783 },
  { id: 'n3',  name: 'Sunflower Daycare',         district: 'Khalda',       rating: 4.7, reviews: 76,  priceFrom: 6,   unit: 'hr', ages: ['infant', 'toddler', 'preschool'], avail: 'available', verified: true,  sponsored: false, tag: 'Hourly care · Bilingual',       img: U('1503454537195-1dcabb73ffb9'), lat: 31.9783, lng: 35.8544 },
  { id: 'n4',  name: 'Tiny Steps Academy',        district: 'Deir Ghbar',   rating: 4.9, reviews: 210, priceFrom: 220, unit: 'mo', ages: ['preschool'],                    avail: 'limited',   verified: true,  sponsored: false, tag: 'STEM play · Special needs',     img: U('1597393353415-b3730f3719fe'), lat: 31.9869, lng: 35.8683 },
  { id: 'n5',  name: 'Green Garden Nursery',      district: 'Dabouq',       rating: 4.6, reviews: 51,  priceFrom: 150, unit: 'mo', ages: ['infant', 'toddler'],             avail: 'full',      verified: true,  sponsored: false, tag: 'Organic meals · CCTV',          img: U('1503919545889-aef636e10ad4'), lat: 31.9956, lng: 35.8350 },
  { id: 'n6',  name: 'Tiny Hearts Nursery',       district: 'Um Uthaina',   rating: 4.7, reviews: 88,  priceFrom: 190, unit: 'mo', ages: ['infant', 'toddler'],             avail: 'available', verified: true,  sponsored: false, tag: 'Montessori · Infant-focused',   img: U('1555116233-38f2d6f6a01f'), lat: 31.9694, lng: 35.8622 },
  { id: 'n7',  name: 'Rainbow Kids Academy',      district: 'Shmeisani',    rating: 4.8, reviews: 112, priceFrom: 7,   unit: 'hr', ages: ['toddler', 'preschool'],          avail: 'limited',   verified: true,  sponsored: true,  tag: 'Music & Arts · Hourly',         img: U('1516627145551-4ff4f05b70a3'), lat: 31.9758, lng: 35.8983 },
  { id: 'n8',  name: 'Blossom Early Learning',    district: 'Lweibdeh',     rating: 4.6, reviews: 63,  priceFrom: 140, unit: 'mo', ages: ['toddler', 'preschool'],          avail: 'available', verified: true,  sponsored: false, tag: 'Reggio Emilia · French',        img: U('1559181567-c3190789f7ac'), lat: 31.9539, lng: 35.9142 },
  { id: 'n9',  name: "Tender Roots Kids",         district: "Tla' Al Ali",  rating: 4.5, reviews: 44,  priceFrom: 130, unit: 'mo', ages: ['infant', 'toddler', 'preschool'], avail: 'available', verified: false, sponsored: false, tag: 'Budget-friendly · Transport',   img: U('1547623542-de3ff5941fd3'), lat: 31.9833, lng: 35.8778 },
  { id: 'n10', name: 'Sprout & Grow Nursery',     district: 'Jubeiha',      rating: 4.8, reviews: 79,  priceFrom: 170, unit: 'mo', ages: ['infant', 'toddler'],             avail: 'limited',   verified: true,  sponsored: false, tag: 'Nature-based · Outdoor play',   img: U('1602152682-2e0a3d25f6f2'), lat: 32.0225, lng: 35.8758 },
  { id: 'n11', name: '1st Circle Little Stars',   district: '1st Circle',   rating: 4.9, reviews: 156, priceFrom: 200, unit: 'mo', ages: ['toddler', 'preschool'],          avail: 'available', verified: true,  sponsored: true,  tag: 'IB curriculum · Bilingual',     img: U('1533483595632-48e0adb05e9a'), lat: 31.9500, lng: 35.9167 },
  { id: 'n12', name: 'Marj Al Hamam Kids',        district: 'Marj Al Hamam',rating: 4.4, reviews: 37,  priceFrom: 5,   unit: 'hr', ages: ['toddler', 'preschool'],          avail: 'available', verified: false, sponsored: false, tag: 'Flexible hours · Play-based',   img: U('1546074177-ffdda98f9c94'), lat: 31.9322, lng: 35.8489 },
  { id: 'n13', name: 'Al Rabieh Learning Hub',    district: 'Al Rabieh',    rating: 4.7, reviews: 91,  priceFrom: 175, unit: 'mo', ages: ['preschool'],                    avail: 'limited',   verified: true,  sponsored: false, tag: 'STEM · Language enrichment',    img: U('1576085898323-bbbfdba4e30f'), lat: 31.9900, lng: 35.9100 },
  { id: 'n14', name: 'Sweileh Sunshine Nursery',  district: 'Sweileh',      rating: 4.5, reviews: 58,  priceFrom: 120, unit: 'mo', ages: ['infant', 'toddler'],             avail: 'available', verified: true,  sponsored: false, tag: 'Affordable · Full day',         img: U('1511965112-eb31b7c3ad3d'), lat: 32.0069, lng: 35.8722 },
  { id: 'n15', name: 'Gardens Montessori',         district: 'Gardens',      rating: 4.8, reviews: 103, priceFrom: 210, unit: 'mo', ages: ['toddler', 'preschool'],          avail: 'limited',   verified: true,  sponsored: false, tag: 'Montessori · Organic snacks',   img: U('1584475784-d5a3e2e9fcc3'), lat: 31.9558, lng: 35.8939 },
];

export const getNursery = (id: string) => NURSERIES.find(n => n.id === id);

export type Child = { id: string; name: string; dob: string; ageGroup: string; allergies: string; photoUri: string };
export type Booking = { id: string; nurseryId: string; childId: string; childIds?: string[]; type: string; status: string; dates: string; price: number; unit: string };
export type Notification = { id: string; kind: string; title: string; body: string; time: string; read: boolean; target: string | null };
export type Message = { me: boolean; text: string; time: string };
export type Thread = { id: string; nurseryId: string; unread: number; last: string; time: string; messages: Message[] };

export type AppStore = {
  user: { name: string; phone: string; email: string; photoUri: string };
  children: Child[];
  favorites: string[];
  draft: Record<string, any>;
  bookings: Booking[];
  notifications: Notification[];
  threads: Thread[];
};

export function seedStore(): AppStore {
  return {
    user: { name: '', phone: '', email: '', photoUri: '' },
    children: [],
    favorites: [],
    draft: {},
    bookings: [],
    notifications: [],
    threads: [],
  };
}
