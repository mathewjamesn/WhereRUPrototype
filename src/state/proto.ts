import { useSyncExternalStore } from 'react';

/** Everything the prototype remembers while it runs. Nothing is sent anywhere. */
export type Conn = 'ok' | 'noNet' | 'gpsOff' | 'back';
export type Verification = 'none' | 'pending' | 'rejected' | 'approved';
export type Vehicle = { reg: string; type: string; make: string; model: string; year: string; colour: string };

export const GATE_ITEMS = [
  { id: 'location', title: 'Location while you’re online', hint: 'We share your location only while you are online, to find ride requests near you.', critical: true },
  { id: 'notifications', title: 'Ride request alerts', hint: 'Allow notifications so new ride requests can ring and open on your screen.', critical: true },
  { id: 'fullscreen', title: 'Full-screen ride alerts', hint: 'Lets a ride request open over the lock screen.', critical: true },
  { id: 'overlay', title: 'Display over other apps', hint: 'Opens the request screen while you are using another app.', critical: true },
  { id: 'popups', title: 'Background pop-ups and lock screen', hint: 'Phone maker setting (Xiaomi, vivo, Realme, Oppo). Confirm once you have turned it on.', critical: true },
  { id: 'always', title: 'Location: allow all the time', hint: 'Keeps your location shared when the app is closed.', critical: true },
  { id: 'battery', title: 'Battery: unrestricted', hint: 'Stops the phone closing the app while you’re online.', critical: true },
  { id: 'autostart', title: 'Auto-start', hint: 'Lets ride alerts work after the phone restarts.', critical: false },
] as const;

/** Reviewer comments shown when documents are rejected (profileImageComments, driverLicenseComments). */
export const REJECT_NOTES = { photo: 'Face not clearly visible. Retake in good light.', licence: 'Back side is blurred.' };

export type GateId = (typeof GATE_ITEMS)[number]['id'];

export type ProtoState = {
  language: 'en' | 'ml' | null;
  stateName: string;
  mobile: string;
  details: { first: string; last: string; email: string; dob: string };
  photo: boolean;
  licenceNo: string;
  dlFront: boolean;
  dlBack: boolean;
  vehicle: Vehicle | null;
  rcFront: boolean;
  rcBack: boolean;
  verification: Verification;
  gate: Record<GateId, boolean>;
  gatePassed: boolean;
  online: boolean;
  conn: Conn;
  acceptsMini: boolean;
  acceptsSedan: boolean;
  walletDue: number;
};

const emptyGate = Object.fromEntries(GATE_ITEMS.map(i => [i.id, false])) as Record<GateId, boolean>;

export const initialState: ProtoState = {
  language: null,
  stateName: 'Kerala',
  mobile: '',
  details: { first: '', last: '', email: '', dob: '' },
  photo: false,
  licenceNo: '',
  dlFront: false,
  dlBack: false,
  vehicle: null,
  rcFront: false,
  rcBack: false,
  verification: 'none',
  gate: emptyGate,
  gatePassed: false,
  online: false,
  conn: 'ok',
  acceptsMini: true,
  acceptsSedan: true,
  walletDue: 632.25,
};

/** A driver who is approved and set up, used by "Start as existing driver". */
export const approvedDriver: Partial<ProtoState> = {
  language: 'en',
  mobile: '9876543210',
  details: { first: 'Mathew', last: 'James', email: 'mathew@example.com', dob: '18 Sep 1995' },
  photo: true,
  licenceNo: 'KL07 20110012345',
  dlFront: true,
  dlBack: true,
  vehicle: { reg: 'KL07AB1234', type: 'Car', make: 'Toyota', model: 'Innova Crysta (SUV)', year: '2022', colour: 'White' },
  rcFront: true,
  rcBack: true,
  verification: 'approved',
  // Auto-start (optional) left off so Home shows the Self check reminder.
  gate: Object.fromEntries(GATE_ITEMS.map(i => [i.id, i.id !== 'autostart'])) as Record<GateId, boolean>,
  gatePassed: true,
};

let state: ProtoState = initialState;
const listeners = new Set<() => void>();
let backTimer: ReturnType<typeof setTimeout> | null = null;

export const proto = {
  get: () => state,
  set(patch: Partial<ProtoState>) {
    state = { ...state, ...patch };
    listeners.forEach(l => l());
    if (patch.conn === 'back') {
      if (backTimer) clearTimeout(backTimer);
      backTimer = setTimeout(() => proto.set({ conn: 'ok' }), 2500);
    }
  },
  reset(patch: Partial<ProtoState> = {}) {
    state = { ...initialState, ...patch };
    listeners.forEach(l => l());
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};

export function useProto<T>(select: (s: ProtoState) => T): T {
  return useSyncExternalStore(proto.subscribe, () => select(state), () => select(state));
}

/** Which onboarding step is first incomplete, same order as the real app (RegistrationProvider). */
export function docsReady(s: ProtoState) {
  return [s.photo, s.licenceNo.trim().length >= 6 && s.dlFront && s.dlBack, !!s.vehicle, s.rcFront && s.rcBack];
}

export function gateReady(s: ProtoState) {
  return GATE_ITEMS.every(i => !i.critical || s.gate[i.id]);
}

/** Where a signed-in driver lands, following the profile-flag routing of the real app. */
export function routeAfterSignIn(s: ProtoState): string {
  if (!s.details.first) return '/details';
  const ready = docsReady(s);
  if (ready.includes(false)) return '/documents';
  if (s.verification === 'pending' || s.verification === 'none') return '/review';
  if (s.verification === 'rejected') return '/review';
  if (!s.gatePassed || !gateReady(s)) return '/permissions';
  return '/home';
}
