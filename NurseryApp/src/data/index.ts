// Types
export type RequestStatus = 'pending' | 'accepted' | 'declined' | 'expired';
export type RosterStatus = 'in' | 'out' | 'absent';
export type InvoiceStatus = 'paid' | 'pending' | 'overdue';
export type PayoutStatus = 'paid' | 'accruing';
export type ApprovalStatus = 'pending' | 'rejected' | 'approved';

export interface BookingRequest {
  id: string;
  parent: string;
  child: string;
  ageGroup: string;
  type: string;
  from: string;
  price: number;
  unit: string;
  status: RequestStatus;
  expiresIn: number;
  note: string;
  phoneLast: string;
  paid: boolean;
}

export interface RosterChild {
  id: string;
  name: string;
  age: string;
  group: string;
  parent: string;
  parentPhone: string;
  status: RosterStatus;
  inAt: string;
  note: string;
  booking: string;
}

export interface CapacityGroup {
  group: string;
  age: string;
  total: number;
  filled: number;
}

export interface DailyReport {
  id: string;
  date: string;
  posted: number;
  total: number;
  status: string;
}

export interface Invoice {
  id: string;
  parent: string;
  child: string;
  amount: number;
  status: InvoiceStatus;
  date: string;
  method: string;
}

export interface Payout {
  id: string;
  period: string;
  gross: number;
  fees: number;
  net: number;
  status: PayoutStatus;
  date: string;
}

export interface MessageThread {
  id: string;
  parent: string;
  child: string;
  unread: number;
  last: string;
  time: string;
  messages: { me: boolean; text: string; time: string }[];
}

export interface Notification {
  id: string;
  kind: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  target: string | null;
}

export interface NurseryStore {
  nursery: {
    id: string;
    name: string;
    district: string;
    phone: string;
    verified: boolean;
    listed: boolean;
    rating: number;
    reviews: number;
  };
  requests: BookingRequest[];
  roster: RosterChild[];
  capacity: CapacityGroup[];
  reports: DailyReport[];
  invoices: Invoice[];
  payouts: Payout[];
  threads: MessageThread[];
  notifications: Notification[];
  draft: Record<string, any>;
  registration: {
    businessName: string;
    license: string;
    commercial: string;
    owner: string;
    phone: string;
    email: string;
    address: string;
    district: string;
    licenseDoc: string | null;
    idDoc: string | null;
    photo: string | null;
  };
  approvalStatus: ApprovalStatus;
}

const REQUESTS: BookingRequest[] = [
  { id: 'rq1', parent: 'Layla H.', child: 'Yara · 22 months', ageGroup: 'toddler', type: 'monthly', from: '1 Jul 2026', price: 160, unit: 'mo', status: 'pending', expiresIn: 22 * 3600, note: 'Yara is allergic to peanuts. We\'d love a tour first if possible.', phoneLast: '67', paid: true },
  { id: 'rq2', parent: 'Omar S.', child: 'Karim · 3 yrs', ageGroup: 'preschool', type: 'daily', from: 'Mon 9 Jun · 8am–5pm', price: 14, unit: 'day', status: 'pending', expiresIn: 4 * 3600, note: 'Trial day before committing.', phoneLast: '12', paid: false },
  { id: 'rq3', parent: 'Rana K.', child: 'Mira · 9 months', ageGroup: 'infant', type: 'hourly', from: 'Wed · 9–12am', price: 18, unit: '3h', status: 'pending', expiresIn: 11 * 3600, note: '', phoneLast: '33', paid: true },
  { id: 'rq4', parent: 'Hala Z.', child: 'Sami · 2 yrs', ageGroup: 'toddler', type: 'weekly', from: 'Starts 15 Jun · Sun–Thu', price: 65, unit: 'wk', status: 'accepted', expiresIn: 0, note: '', phoneLast: '88', paid: true },
];

const ROSTER: RosterChild[] = [
  { id: 'k1', name: 'Yara H.', age: '22m', group: 'Sunshine', parent: 'Layla H.', parentPhone: '9123 4567', status: 'in', inAt: '8:32', note: 'Allergic to peanuts', booking: 'monthly' },
  { id: 'k2', name: 'Sami Z.', age: '2y', group: 'Sunshine', parent: 'Hala Z.', parentPhone: '7888 1212', status: 'in', inAt: '8:18', note: '', booking: 'weekly' },
  { id: 'k3', name: 'Mira K.', age: '9m', group: 'Tiny Sprouts', parent: 'Rana K.', parentPhone: '7733 4455', status: 'out', inAt: '', note: '', booking: 'hourly' },
  { id: 'k4', name: 'Karim S.', age: '3y', group: 'Rainbow', parent: 'Omar S.', parentPhone: '7912 0012', status: 'in', inAt: '8:50', note: 'Asthma — inhaler in bag', booking: 'daily' },
  { id: 'k5', name: 'Layan T.', age: '2y', group: 'Sunshine', parent: 'Dina T.', parentPhone: '7710 5566', status: 'absent', inAt: '', note: 'Parent reported flu', booking: 'monthly' },
  { id: 'k6', name: 'Adam M.', age: '3y', group: 'Rainbow', parent: 'Noor M.', parentPhone: '7798 7654', status: 'in', inAt: '9:05', note: '', booking: 'monthly' },
];

const CAPACITY: CapacityGroup[] = [
  { group: 'Tiny Sprouts', age: 'Infant · 0–1 yr', total: 6, filled: 4 },
  { group: 'Sunshine', age: 'Toddler · 1–3 yrs', total: 12, filled: 11 },
  { group: 'Rainbow', age: 'Preschool · 3–5 yrs', total: 14, filled: 9 },
];

const N_REPORTS: DailyReport[] = [
  { id: 'nr1', date: 'Today · 2 Jun', posted: 4, total: 5, status: 'drafting' },
  { id: 'nr2', date: 'Yesterday · 1 Jun', posted: 6, total: 6, status: 'done' },
  { id: 'nr3', date: 'Fri · 30 May', posted: 6, total: 6, status: 'done' },
];

const INVOICES: Invoice[] = [
  { id: 'in1', parent: 'Layla H.', child: 'Yara', amount: 160, status: 'paid', date: '1 Jun · 09:15', method: 'card' },
  { id: 'in2', parent: 'Hala Z.', child: 'Sami', amount: 260, status: 'paid', date: '1 Jun · 08:42', method: 'cliq' },
  { id: 'in3', parent: 'Noor M.', child: 'Adam', amount: 160, status: 'paid', date: '1 Jun · 07:55', method: 'card' },
  { id: 'in4', parent: 'Omar S.', child: 'Karim', amount: 14, status: 'pending', date: '3 Jun · est.', method: '—' },
  { id: 'in5', parent: 'Dina T.', child: 'Layan', amount: 160, status: 'overdue', date: 'due 28 May', method: '—' },
];

const PAYOUTS: Payout[] = [
  { id: 'po1', period: 'May 2026', gross: 3640, fees: 182, net: 3458, status: 'paid', date: '1 Jun' },
  { id: 'po2', period: 'Apr 2026', gross: 3420, fees: 171, net: 3249, status: 'paid', date: '1 May' },
  { id: 'po3', period: 'Jun 2026 (in progress)', gross: 540, fees: 27, net: 513, status: 'accruing', date: '—' },
];

const N_THREADS: MessageThread[] = [
  {
    id: 'nt1', parent: 'Layla H.', child: 'Yara', unread: 1, last: 'Yara seemed extra sleepy today, just FYI.', time: '11:02',
    messages: [
      { me: true, text: 'Good morning! Yara had a lovely breakfast today.', time: '8:40' },
      { me: false, text: "That's wonderful, thank you!", time: '9:02' },
      { me: true, text: "She's napping now, all settled.", time: '10:20' },
      { me: false, text: 'Yara seemed extra sleepy today, just FYI.', time: '11:02' },
    ],
  },
  {
    id: 'nt2', parent: 'Omar S.', child: 'Karim', unread: 0, last: 'Sounds good — see you Monday.', time: 'Yesterday',
    messages: [
      { me: false, text: 'Hi, can I book a trial day Monday?', time: 'Yesterday' },
      { me: true, text: "Of course! 8am–5pm? We'd love to meet Karim.", time: 'Yesterday' },
      { me: false, text: 'Sounds good — see you Monday.', time: 'Yesterday' },
    ],
  },
];

const N_NOTIFS: Notification[] = [
  { id: 'nn1', kind: 'booking', title: 'New booking request', body: 'Omar S. requested a daily for Karim — expires in 4 h.', time: '20 min ago', read: false, target: 'nRequests' },
  { id: 'nn2', kind: 'payment', title: 'Payout sent', body: 'May payout 3,458 JD has settled to your account.', time: '2h ago', read: false, target: 'nSettlements' },
  { id: 'nn3', kind: 'review', title: 'New 5-star review', body: 'Rana K. left a review on your profile.', time: '1d ago', read: true, target: null },
  { id: 'nn4', kind: 'system', title: 'License renewal due in 38 days', body: 'Upload the renewed license before 12 Jul to stay listed.', time: '2d ago', read: true, target: 'nApproval' },
];

export function seedNursery(): NurseryStore {
  return {
    nursery: {
      id: 'n2',
      name: 'Olive Tree Kids',
      district: 'Sweifieh',
      phone: '06 555 1234',
      verified: true,
      listed: true,
      rating: 4.8,
      reviews: 94,
    },
    requests: REQUESTS,
    roster: ROSTER,
    capacity: CAPACITY,
    reports: N_REPORTS,
    invoices: INVOICES,
    payouts: PAYOUTS,
    threads: N_THREADS,
    notifications: N_NOTIFS,
    draft: {},
    registration: {
      businessName: '',
      license: '',
      commercial: '',
      owner: '',
      phone: '',
      email: '',
      address: '',
      district: '',
      licenseDoc: null,
      idDoc: null,
      photo: null,
    },
    approvalStatus: 'approved',
  };
}
