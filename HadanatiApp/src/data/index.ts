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
};

export const NURSERIES: Nursery[] = [
  { id: 'n1',  name: 'Little Sprouts Nursery',   district: 'Abdoun',       rating: 4.9, reviews: 128, priceFrom: 180, unit: 'mo', ages: ['infant', 'toddler'],             avail: 'available', verified: true,  sponsored: true,  tag: 'Montessori · Meals included',   img: U('1587654780291-39c9404d746b') },
  { id: 'n2',  name: 'Olive Tree Kids',           district: 'Sweifieh',     rating: 4.8, reviews: 94,  priceFrom: 160, unit: 'mo', ages: ['toddler', 'preschool'],          avail: 'limited',   verified: true,  sponsored: true,  tag: 'Outdoor garden · Transport',    img: U('1503676260728-1c00da094a0b') },
  { id: 'n3',  name: 'Sunflower Daycare',         district: 'Khalda',       rating: 4.7, reviews: 76,  priceFrom: 6,   unit: 'hr', ages: ['infant', 'toddler', 'preschool'], avail: 'available', verified: true,  sponsored: false, tag: 'Hourly care · Bilingual',       img: U('1503454537195-1dcabb73ffb9') },
  { id: 'n4',  name: 'Tiny Steps Academy',        district: 'Deir Ghbar',   rating: 4.9, reviews: 210, priceFrom: 220, unit: 'mo', ages: ['preschool'],                    avail: 'limited',   verified: true,  sponsored: false, tag: 'STEM play · Special needs',     img: U('1597393353415-b3730f3719fe') },
  { id: 'n5',  name: 'Green Garden Nursery',      district: 'Dabouq',       rating: 4.6, reviews: 51,  priceFrom: 150, unit: 'mo', ages: ['infant', 'toddler'],             avail: 'full',      verified: true,  sponsored: false, tag: 'Organic meals · CCTV',          img: U('1503919545889-aef636e10ad4') },
  { id: 'n6',  name: 'Tiny Hearts Nursery',       district: 'Um Uthaina',   rating: 4.7, reviews: 88,  priceFrom: 190, unit: 'mo', ages: ['infant', 'toddler'],             avail: 'available', verified: true,  sponsored: false, tag: 'Montessori · Infant-focused',   img: U('1555116233-38f2d6f6a01f') },
  { id: 'n7',  name: 'Rainbow Kids Academy',      district: 'Shmeisani',    rating: 4.8, reviews: 112, priceFrom: 7,   unit: 'hr', ages: ['toddler', 'preschool'],          avail: 'limited',   verified: true,  sponsored: true,  tag: 'Music & Arts · Hourly',         img: U('1516627145551-4ff4f05b70a3') },
  { id: 'n8',  name: 'Blossom Early Learning',    district: 'Lweibdeh',     rating: 4.6, reviews: 63,  priceFrom: 140, unit: 'mo', ages: ['toddler', 'preschool'],          avail: 'available', verified: true,  sponsored: false, tag: 'Reggio Emilia · French',        img: U('1559181567-c3190789f7ac') },
  { id: 'n9',  name: "Tender Roots Kids",         district: "Tla' Al Ali",  rating: 4.5, reviews: 44,  priceFrom: 130, unit: 'mo', ages: ['infant', 'toddler', 'preschool'], avail: 'available', verified: false, sponsored: false, tag: 'Budget-friendly · Transport',   img: U('1547623542-de3ff5941fd3') },
  { id: 'n10', name: 'Sprout & Grow Nursery',     district: 'Jubeiha',      rating: 4.8, reviews: 79,  priceFrom: 170, unit: 'mo', ages: ['infant', 'toddler'],             avail: 'limited',   verified: true,  sponsored: false, tag: 'Nature-based · Outdoor play',   img: U('1602152682-2e0a3d25f6f2') },
  { id: 'n11', name: '1st Circle Little Stars',   district: '1st Circle',   rating: 4.9, reviews: 156, priceFrom: 200, unit: 'mo', ages: ['toddler', 'preschool'],          avail: 'available', verified: true,  sponsored: true,  tag: 'IB curriculum · Bilingual',     img: U('1533483595632-48e0adb05e9a') },
  { id: 'n12', name: 'Marj Al Hamam Kids',        district: 'Marj Al Hamam',rating: 4.4, reviews: 37,  priceFrom: 5,   unit: 'hr', ages: ['toddler', 'preschool'],          avail: 'available', verified: false, sponsored: false, tag: 'Flexible hours · Play-based',   img: U('1546074177-ffdda98f9c94') },
  { id: 'n13', name: 'Al Rabieh Learning Hub',    district: 'Al Rabieh',    rating: 4.7, reviews: 91,  priceFrom: 175, unit: 'mo', ages: ['preschool'],                    avail: 'limited',   verified: true,  sponsored: false, tag: 'STEM · Language enrichment',    img: U('1576085898323-bbbfdba4e30f') },
  { id: 'n14', name: 'Sweileh Sunshine Nursery',  district: 'Sweileh',      rating: 4.5, reviews: 58,  priceFrom: 120, unit: 'mo', ages: ['infant', 'toddler'],             avail: 'available', verified: true,  sponsored: false, tag: 'Affordable · Full day',         img: U('1511965112-eb31b7c3ad3d') },
  { id: 'n15', name: 'Gardens Montessori',         district: 'Gardens',      rating: 4.8, reviews: 103, priceFrom: 210, unit: 'mo', ages: ['toddler', 'preschool'],          avail: 'limited',   verified: true,  sponsored: false, tag: 'Montessori · Organic snacks',   img: U('1584475784-d5a3e2e9fcc3') },
];

export const getNursery = (id: string) => NURSERIES.find(n => n.id === id);

export type Child = { id: string; name: string; dob: string; ageGroup: string; allergies: string; photo: boolean };
export type Booking = { id: string; nurseryId: string; childId: string; type: string; status: string; dates: string; price: number; unit: string };
export type Notification = { id: string; kind: string; title: string; body: string; time: string; read: boolean; target: string | null };
export type Message = { me: boolean; text: string; time: string };
export type Thread = { id: string; nurseryId: string; unread: number; last: string; time: string; messages: Message[] };

export type AppStore = {
  user: { name: string; phone: string; email: string; photo: boolean };
  children: Child[];
  favorites: string[];
  draft: Record<string, any>;
  bookings: Booking[];
  notifications: Notification[];
  threads: Thread[];
};

export function seedStore(): AppStore {
  return {
    user: { name: 'Layla Haddad', phone: '7 9123 4567', email: '', photo: false },
    children: [
      { id: 'c1', name: 'Yara', dob: '2023-04-12', ageGroup: 'toddler', allergies: 'Peanuts', photo: false },
    ],
    favorites: ['n2'],
    draft: {},
    bookings: [
      { id: 'b1', nurseryId: 'n2', childId: 'c1', type: 'monthly', status: 'active', dates: 'Started 1 May 2026', price: 160, unit: 'mo' },
      { id: 'b2', nurseryId: 'n4', childId: 'c1', type: 'daily', status: 'pending', dates: 'Mon 9 Jun 2026', price: 14, unit: 'day' },
    ],
    notifications: [
      { id: 't1', kind: 'report', title: 'New daily report', body: "Yara's day at Olive Tree Kids is ready.", time: '2h ago', read: false, target: 'ReportFeed' },
      { id: 't2', kind: 'attendance', title: 'Checked in', body: 'Yara was checked in at 8:32 AM.', time: '5h ago', read: false, target: null },
      { id: 't3', kind: 'emergency', title: 'Early closure today', body: 'Olive Tree Kids closes at 2 PM due to weather.', time: '1d ago', read: true, target: null },
      { id: 't4', kind: 'payment', title: 'Payment received', body: 'Your May subscription was paid.', time: '3d ago', read: true, target: null },
    ],
    threads: [
      { id: 'th1', nurseryId: 'n2', unread: 2, last: 'See you at pickup! 🌿', time: '10:24', messages: [
        { me: false, text: 'Good morning! Yara had a lovely breakfast today.', time: '8:40' },
        { me: true, text: "That's wonderful, thank you!", time: '9:02' },
        { me: false, text: "She's napping now, all settled.", time: '10:20' },
        { me: false, text: 'See you at pickup! 🌿', time: '10:24' },
      ] },
    ],
  };
}
