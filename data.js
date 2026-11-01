/**
 * Zenith Club member experience — local, fictional demonstration data.
 * No production member records, venue inventory, payments or NFC credentials
 * are read or written by this module.
 */

export const DEMO_NOTICE = 'Demo experience. Venues, availability, rankings and activity are illustrative.';
export const STORAGE_KEY = 'zenith-member-demo-v1';
export const sports = ['All sports', 'Padel', 'Pickleball', 'Tennis', 'Badminton'];

const eveningSlots = ['07:00', '08:30', '10:00', '12:00', '15:00', '16:30', '18:30', '20:00', '21:00'];

export const venues = [
  {
    id: 'palm-club', name: 'The Palm Club', sport: 'Padel', area: 'Golf Course Road',
    description: 'Golden-hour rallies, panoramic glass courts and a little time at the clubhouse.',
    price: 1200, originalPrice: 1600, rating: 4.9, distance: '2.4 km',
    amenities: ['Outdoor', 'Equipment rental', 'Café', 'Parking'],
    image: 'assets/court-padel.webp', slots: [...eveningSlots],
  },
  {
    id: 'rally-house', name: 'Rally House', sport: 'Pickleball', area: 'Sector 57',
    description: 'Easy-going games and a welcoming community, from your first serve to the final point.',
    price: 600, originalPrice: 800, rating: 4.8, distance: '3.1 km',
    amenities: ['Outdoor', 'Equipment rental', 'Changing rooms', 'Parking'],
    image: 'assets/court-pickleball.svg', slots: ['06:00', '07:00', '08:30', '10:00', '16:30', '18:30', '20:00'],
  },
  {
    id: 'court-nine', name: 'Court Nine', sport: 'Tennis', area: 'DLF Phase 4',
    description: 'Beautifully maintained hard courts for a focused session or a friendly evening set.',
    price: 900, originalPrice: 1200, rating: 4.9, distance: '4.8 km',
    amenities: ['Outdoor', 'Floodlights', 'Coaching', 'Changing rooms'],
    image: 'assets/court-tennis.svg', slots: ['06:00', '07:00', '08:30', '10:00', '12:00', '15:00', '18:30', '20:00'],
  },
  {
    id: 'padel-garden', name: 'The Padel Garden', sport: 'Padel', area: 'Sector 65',
    description: 'A green escape with crisp courts, friendly doubles and space to unwind after the match.',
    price: 1050, originalPrice: 1400, rating: 4.7, distance: '5.2 km',
    amenities: ['Outdoor', 'Equipment rental', 'Café', 'Floodlights'],
    image: 'assets/court-padel.webp', slots: ['07:00', '08:30', '10:00', '15:00', '16:30', '18:30', '20:00'],
  },
  {
    id: 'racquet-room', name: 'The Racquet Room', sport: 'Badminton', area: 'Sector 43',
    description: 'Indoor courts, clean lines and a lively doubles community. Come ready to rally.',
    price: 450, originalPrice: 600, rating: 4.8, distance: '3.6 km',
    amenities: ['Indoor', 'Equipment rental', 'Changing rooms', 'Parking'],
    image: 'assets/court-badminton.svg', slots: ['06:00', '07:00', '08:30', '10:00', '12:00', '15:00', '16:30', '18:30', '20:00', '21:00'],
  },
  {
    id: 'club-verde', name: 'Club Verde', sport: 'Pickleball', area: 'Sohna Road',
    description: 'A neighbourhood favourite in this demo, with social courts and weekend community play.',
    price: 525, originalPrice: 700, rating: 4.6, distance: '6.3 km',
    amenities: ['Outdoor', 'Café', 'Coaching', 'Floodlights'],
    image: 'assets/court-pickleball.svg', slots: ['07:00', '08:30', '10:00', '12:00', '16:30', '18:30', '20:00'],
  },
];

const player = (name, color) => ({
  name,
  initials: name.split(/\s+/).map(part => part[0]).slice(0, 2).join(''),
  color,
});

export const games = [
  {
    id: 'sunset-doubles', title: 'Sunset doubles', sport: 'Padel', venueId: 'palm-club',
    dayOffset: 1, time: '18:30', duration: 90, level: 'Intermediate', spots: 1,
    players: [player('Aarav Mehta', '#d9b98c'), player('Anika Shah', '#a7bdb4'), player('Rohan Kapoor', '#c8b6cb')],
    host: 'Aarav', price: 450,
  },
  {
    id: 'pickle-and-coffee', title: 'Pickle & coffee', sport: 'Pickleball', venueId: 'rally-house',
    dayOffset: 2, time: '08:30', duration: 60, level: 'All levels', spots: 2,
    players: [player('Maya Rao', '#c9b6a1'), player('Ishaan Sethi', '#b5c2cc')], host: 'Maya', price: 150,
  },
  {
    id: 'baseline-club', title: 'The baseline club', sport: 'Tennis', venueId: 'court-nine',
    dayOffset: 2, time: '18:30', duration: 90, level: 'Advanced', spots: 1,
    players: [player('Dev Malhotra', '#bac8ad'), player('Sana Khanna', '#d8b9ad'), player('Kabir Anand', '#b6bdcf')],
    host: 'Dev', price: 338,
  },
  {
    id: 'first-rally', title: 'Your first rally', sport: 'Padel', venueId: 'padel-garden',
    dayOffset: 3, time: '16:30', duration: 60, level: 'Beginner', spots: 3,
    players: [player('Neha Suri', '#cdb9a7')], host: 'Neha', price: 263,
  },
  {
    id: 'after-hours', title: 'After-hours doubles', sport: 'Badminton', venueId: 'racquet-room',
    dayOffset: 3, time: '20:00', duration: 60, level: 'Intermediate', spots: 2,
    players: [player('Arjun Batra', '#b9c7ba'), player('Tara Sen', '#d4bdb9')], host: 'Arjun', price: 113,
  },
  {
    id: 'sunday-social', title: 'The weekend social', sport: 'Pickleball', venueId: 'club-verde',
    dayOffset: 5, time: '10:00', duration: 90, level: 'All levels', spots: 1,
    players: [player('Nina Bose', '#b9bfd5'), player('Vikram Roy', '#d3bc9b'), player('Aditi Jain', '#aec8b7')],
    host: 'Nina', price: 197,
  },
];

export const leaderboard = [
  { name: 'Aarav Mehta', initials: 'AM', level: 4.8, points: 2450, wins: 42, rank: 1, delta: 2 },
  { name: 'Anika Shah', initials: 'AS', level: 4.6, points: 2310, wins: 38, rank: 2, delta: 1 },
  { name: 'Dev Malhotra', initials: 'DM', level: 4.5, points: 2240, wins: 36, rank: 3, delta: -2 },
  { name: 'Maya Rao', initials: 'MR', level: 4.3, points: 2080, wins: 32, rank: 4, delta: 3 },
  { name: 'Rohan Kapoor', initials: 'RK', level: 4.2, points: 1980, wins: 29, rank: 5, delta: 0 },
  { name: 'Caleb', initials: 'CP', level: 3.8, points: 1840, wins: 24, rank: 6, delta: 4 },
  { name: 'Neha Suri', initials: 'NS', level: 3.7, points: 1760, wins: 23, rank: 7, delta: -1 },
  { name: 'Ishaan Sethi', initials: 'IS', level: 3.6, points: 1690, wins: 21, rank: 8, delta: 1 },
];

export const notifications = [
  { id: 'welcome', title: 'Welcome to your club', body: 'Your demo member pass is ready. Explore it in Tap.', time: 'Just now', read: false },
  { id: 'match-ready', title: 'Your next rally is waiting', body: 'A demo booking at The Palm Club is on your calendar for tomorrow.', time: '10 min ago', read: false },
  { id: 'member-rates', title: 'More court time. Member rates.', body: 'Browse illustrative member pricing across the demo venues.', time: '1 hour ago', read: false },
];

export const CLUB_TIME_ZONE = 'Asia/Kolkata';
const clubClock = new Intl.DateTimeFormat('en-GB', {
  timeZone: CLUB_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});

/** All visible club dates and times use Gurugram's clock, wherever the visitor is. */
export function clubNow(instant = new Date()) {
  const parts = Object.fromEntries(clubClock.formatToParts(instant).map(part => [part.type, part.value]));
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
    hour: Number(parts.hour), minute: Number(parts.minute),
  };
}

/** Add calendar days in the club timezone without browser-zone or DST drift. */
export function localDate(offset = 0) {
  const [year, month, day] = clubNow().date.split('-').map(Number);
  const requestedOffset = Number(offset || 0);
  const days = Number.isFinite(requestedOffset) ? Math.trunc(requestedOffset) : 0;
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

function parseDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day, 12);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}

export function formatDate(value, options = {}) {
  const date = value instanceof Date ? value : parseDate(value);
  if (!date || Number.isNaN(date.getTime())) return 'Date unavailable';
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', ...options }).format(date);
}

export function formatMoney(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value) || 0);
}

function defaults() {
  return {
    profile: {
      name: 'Caleb', fullName: 'Caleb Pérez', handle: 'caleb', city: 'Gurugram',
      sport: 'Padel', hand: 'Right-handed', bio: 'Here for the next rally and the people who make it.', email: '',
    },
    color: 'black', theme: 'light',
    bookings: [{
      id: 'booking-welcome', venueId: 'palm-club', venueName: 'The Palm Club', sport: 'Padel',
      date: localDate(1), time: '18:30', duration: 90, guests: 4,
      price: 1200, total: 1800, originalTotal: 2400, savings: 600,
      status: 'confirmed', createdAt: new Date().toISOString(), demo: true,
    }],
    joinedGames: [], hostedGames: [], friends: [],
    privacy: { publicProfile: true, showActivity: true },
    notificationsRead: false, weeklyGoal: 3,
  };
}

function storage() {
  try { return globalThis.localStorage ?? null; } catch { return null; }
}

const cleanText = (value, max = 100) => String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, max);
const isRecord = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

function loadState() {
  const fallback = defaults();
  try {
    const raw = storage()?.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const saved = JSON.parse(raw);
    if (!isRecord(saved)) return fallback;
    // Only restore our known fields. Browser storage is never an auth source.
    if (isRecord(saved.profile)) {
      for (const key of Object.keys(fallback.profile)) {
        if (typeof saved.profile[key] === 'string') fallback.profile[key] = cleanText(saved.profile[key], key === 'bio' ? 240 : 100);
      }
      if (!fallback.profile.name) fallback.profile.name = 'Caleb';
      if (!fallback.profile.fullName) fallback.profile.fullName = fallback.profile.name;
      if (!sports.slice(1).includes(fallback.profile.sport)) fallback.profile.sport = 'Padel';
    }
    if (['black', 'cream'].includes(saved.color)) fallback.color = saved.color;
    if (['light', 'dark', 'system'].includes(saved.theme)) fallback.theme = saved.theme;
    if (Array.isArray(saved.bookings)) fallback.bookings = saved.bookings.filter(item => isRecord(item) && typeof item.id === 'string' && venues.some(venue => venue.id === item.venueId) && parseDate(item.date) && /^([01]\d|2[0-3]):[0-5]\d$/.test(item.time) && [60, 90, 120].includes(Number(item.duration)) && ['confirmed', 'cancelled'].includes(item.status)).slice(0, 300);
    if (Array.isArray(saved.hostedGames)) fallback.hostedGames = saved.hostedGames.filter(item => isRecord(item) && typeof item.id === 'string' && parseDate(item.date) && venues.some(venue => venue.id === item.venueId)).slice(0, 100);
    if (Array.isArray(saved.joinedGames)) fallback.joinedGames = [...new Set(saved.joinedGames.filter(id => typeof id === 'string' && [...games, ...fallback.hostedGames].some(game => game.id === id)))];
    if (Array.isArray(saved.friends)) fallback.friends = saved.friends.filter(item => typeof item === 'string' || isRecord(item)).slice(0, 200);
    if (isRecord(saved.privacy)) {
      for (const key of Object.keys(fallback.privacy)) if (typeof saved.privacy[key] === 'boolean') fallback.privacy[key] = saved.privacy[key];
    }
    fallback.notificationsRead = saved.notificationsRead === true;
    if (Number.isInteger(saved.weeklyGoal) && saved.weeklyGoal >= 1 && saved.weeklyGoal <= 14) fallback.weeklyGoal = saved.weeklyGoal;
    return fallback;
  } catch {
    // A blocked or damaged local store must not prevent using the demo.
    return fallback;
  }
}

export const state = loadState();

/** Returns false when private browsing or storage quota prevents persistence. */
export function saveState() {
  try {
    const target = storage();
    if (!target) return false;
    target.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch { return false; }
}

export function resetDemo() {
  for (const key of Object.keys(state)) delete state[key];
  Object.assign(state, defaults());
  saveState();
  return state;
}

function uniqueId(prefix) {
  const suffix = globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  return `${prefix}-${suffix}`;
}

function toMinutes(time) {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}

function validateSchedule({ venueId, date, time, duration = 60 }) {
  const venue = venues.find(item => item.id === venueId);
  if (!venue) throw new Error('Choose a venue from the club directory.');
  if (!parseDate(date)) throw new Error('Choose a valid calendar date.');
  if (typeof time !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error('Choose a valid start time.');
  if (!venue.slots.includes(time)) throw new Error('That time is not available. Choose another listed slot.');
  const minutes = Number(duration);
  if (![60, 90, 120].includes(minutes)) throw new Error('Choose a 60, 90 or 120 minute session.');
  if (toMinutes(time) + minutes > 23 * 60) throw new Error('That session ends after closing. Choose an earlier start or a shorter session.');
  // India has a fixed UTC+05:30 offset. Never interpret a club slot in the
  // visitor's browser timezone when deciding whether it has already passed.
  const start = new Date(`${date}T${time}:00+05:30`);
  if (start.getTime() <= Date.now()) throw new Error('Choose a date and time in the future.');
  return { venue, duration: minutes };
}

export function bookCourt({ venueId, date, time, duration = 60, guests = 4 } = {}) {
  const checked = validateSchedule({ venueId, date, time, duration });
  const count = Number(guests);
  if (!Number.isInteger(count) || count < 1 || count > 4) throw new Error('Choose between 1 and 4 players.');
  const start = toMinutes(time);
  const end = start + checked.duration;
  const overlap = state.bookings.some(booking => booking.status === 'confirmed' && booking.venueId === venueId && booking.date === date && start < toMinutes(booking.time) + Number(booking.duration) && end > toMinutes(booking.time));
  if (overlap) throw new Error('You already have a booking at this venue that overlaps this time. Choose another slot.');
  const total = Math.round(checked.venue.price * checked.duration / 60);
  const originalTotal = Math.round(checked.venue.originalPrice * checked.duration / 60);
  const booking = {
    id: uniqueId('booking'), venueId, venueName: checked.venue.name, sport: checked.venue.sport,
    date, time, duration: checked.duration, guests: count, price: checked.venue.price,
    total, originalTotal, savings: originalTotal - total,
    status: 'confirmed', createdAt: new Date().toISOString(), demo: true,
  };
  state.bookings.push(booking);
  saveState();
  return booking;
}

export function cancelBooking(id) {
  const booking = state.bookings.find(item => item.id === id);
  if (!booking) throw new Error('This booking could not be found.');
  if (booking.status === 'cancelled') return booking;
  booking.status = 'cancelled';
  booking.cancelledAt = new Date().toISOString();
  saveState();
  return booking;
}

export function joinGame(id) {
  const game = [...games, ...state.hostedGames].find(item => item.id === id);
  if (!game) throw new Error('This game could not be found.');
  if (state.joinedGames.includes(id)) throw new Error('You have already joined this game.');
  if (state.hostedGames.some(item => item.id === id)) throw new Error('You are already the host of this game.');
  if (Number(game.spots) < 1) throw new Error('This game is full. Try another open game.');
  validateSchedule({ venueId: game.venueId, date: game.date || localDate(game.dayOffset), time: game.time, duration: game.duration });
  state.joinedGames.push(id);
  saveState();
  return { ...game, status: 'joined', remainingSpots: Number(game.spots) - 1 };
}

export function leaveGame(id) {
  const index = state.joinedGames.indexOf(id);
  if (index === -1) return false;
  state.joinedGames.splice(index, 1);
  saveState();
  return true;
}

export function hostGame({ title, sport, venueId, date, time, level = 'All levels', spots = 3, duration = 60 } = {}) {
  const checked = validateSchedule({ venueId, date, time, duration });
  const name = cleanText(title, 70);
  if (name.length < 3) throw new Error('Give your game a name with at least 3 characters.');
  if (!sports.slice(1).includes(sport)) throw new Error('Choose a sport for your game.');
  if (checked.venue.sport !== sport) throw new Error('Choose a venue that offers this sport.');
  if (!['All levels', 'Beginner', 'Intermediate', 'Advanced'].includes(level)) throw new Error('Choose a skill level for your game.');
  const available = Number(spots);
  if (!Number.isInteger(available) || available < 1 || available > 3) throw new Error('Choose between 1 and 3 open spots.');
  const duplicate = state.hostedGames.some(game => game.venueId === venueId && game.date === date && toMinutes(time) < toMinutes(game.time) + Number(game.duration) && toMinutes(time) + checked.duration > toMinutes(game.time));
  if (duplicate) throw new Error('You are already hosting a game at this venue at that time.');
  const game = {
    id: uniqueId('game'), title: name, sport, venueId, date, time, duration: checked.duration,
    level, spots: available, players: [player(state.profile.fullName, '#cbb397')],
    host: state.profile.name, price: Math.round(checked.venue.price * checked.duration / 60 / (available + 1)),
    createdAt: new Date().toISOString(), demo: true,
  };
  state.hostedGames.unshift(game);
  saveState();
  return game;
}

export function updateProfile(patch = {}) {
  if (!isRecord(patch)) throw new Error('Provide the profile details you want to update.');
  const next = { ...state.profile };
  const limits = { name: 50, fullName: 100, handle: 30, city: 70, bio: 240, email: 120 };
  for (const [key, max] of Object.entries(limits)) if (Object.hasOwn(patch, key)) next[key] = cleanText(patch[key], max);
  if (Object.hasOwn(patch, 'fullName') && !Object.hasOwn(patch, 'name')) next.name = next.fullName.split(/\s+/)[0];
  if (!next.name || !next.fullName) throw new Error('Please enter your name.');
  next.handle = next.handle.replace(/^@/, '');
  if (!/^[a-zA-Z0-9._]{2,30}$/.test(next.handle)) throw new Error('Use 2–30 letters, numbers, dots or underscores for your handle.');
  if (!next.city) throw new Error('Please enter your city.');
  if (next.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.email)) throw new Error('Enter a valid email address, or leave it blank.');
  if (Object.hasOwn(patch, 'sport')) {
    if (!sports.slice(1).includes(patch.sport)) throw new Error('Choose a sport from the list.');
    next.sport = patch.sport;
  }
  if (Object.hasOwn(patch, 'hand')) {
    if (!['Right-handed', 'Left-handed', 'Ambidextrous'].includes(patch.hand)) throw new Error('Choose your preferred playing hand.');
    next.hand = patch.hand;
  }
  Object.assign(state.profile, next);
  saveState();
  return state.profile;
}

export function setColor(color) {
  if (!['black', 'cream'].includes(color)) throw new Error('Choose the Onyx or Ivory band.');
  state.color = color;
  saveState();
  return color;
}

export function setTheme(theme) {
  if (!['light', 'dark', 'system'].includes(theme)) throw new Error('Choose a light, dark or system appearance.');
  state.theme = theme;
  saveState();
  return theme;
}
