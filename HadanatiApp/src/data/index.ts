export const DISTRICTS = ['Abdoun', 'Sweifieh', 'Khalda', 'Deir Ghbar', 'Dabouq', 'Jabal Amman', 'Marj Al Hamam'];

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
  { id: 'n1', name: 'Little Sprouts Nursery', district: 'Abdoun', rating: 4.9, reviews: 128, priceFrom: 180, unit: 'mo', ages: ['infant', 'toddler'], avail: 'available', verified: true, sponsored: true, tag: 'Montessori · Meals included', img: U('1587654780291-39c9404d746b') },
  { id: 'n2', name: 'Olive Tree Kids', district: 'Sweifieh', rating: 4.8, reviews: 94, priceFrom: 160, unit: 'mo', ages: ['toddler', 'preschool'], avail: 'limited', verified: true, sponsored: true, tag: 'Outdoor garden · Transport', img: U('1503676260728-1c00da094a0b') },
  { id: 'n3', name: 'Sunflower Daycare', district: 'Khalda', rating: 4.7, reviews: 76, priceFrom: 6, unit: 'hr', ages: ['infant', 'toddler', 'preschool'], avail: 'available', verified: true, sponsored: false, tag: 'Hourly care · Bilingual', img: U('1503454537195-1dcabb73ffb9') },
  { id: 'n4', name: 'Tiny Steps Academy', district: 'Deir Ghbar', rating: 4.9, reviews: 210, priceFrom: 220, unit: 'mo', ages: ['preschool'], avail: 'limited', verified: true, sponsored: false, tag: 'STEM play · Special needs', img: U('1597393353415-b3730f3719fe') },
  { id: 'n5', name: 'Green Garden Nursery', district: 'Dabouq', rating: 4.6, reviews: 51, priceFrom: 150, unit: 'mo', ages: ['infant', 'toddler'], avail: 'full', verified: true, sponsored: false, tag: 'Organic meals · CCTV', img: U('1503919545889-aef636e10ad4') },
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
