import type { Point } from '../ui/Ride';

/** Sample data for the ride screens. Fare maths matches the corrected earnings breakdown. */
export const PASSENGER = { name: 'Anjali Menon', initials: 'AM' };

export const SIMPLE = {
  fare: 227,
  rate: 65,
  tripKm: 3.5,
  pickupKm: 0.8,
  vehicle: 'SUV',
  payment: 'Cash',
  points: [
    { kind: 'pick', label: 'Pickup', title: 'Kakkanad, Kochi', sub: '29G5+3GC, Kakkanad 682030' },
    { kind: 'drop', label: 'Drop', title: 'Sunrise Hospital, Kochi', sub: 'Seaport-Airport Rd, Kakkanad' },
  ] as Point[],
};

export const STOPS = {
  fare: 1781,
  tripKm: 27.4,
  points: [
    { kind: 'pick', label: 'Pickup', title: 'Kakkanad, Kochi', sub: '29G5+3GC, Kakkanad 682030' },
    { kind: '1', label: 'Stop 1', title: 'Infopark Phase 1, Kakkanad' },
    { kind: '2', label: 'Stop 2', title: 'Lulu Mall, Edappally' },
    { kind: 'drop', label: 'Drop', title: 'Cochin International Airport', sub: 'Nedumbassery' },
  ] as Point[],
};

/** ₹227 fare − ₹9.09 platform fee − ₹1.64 GST on the fee = ₹216.27 to the driver. */
export const EARN = { fare: 227, fee: 9.09, gst: 1.64 };
export const net = (e = EARN) => +(e.fare - e.fee - e.gst).toFixed(2);
export const rupees = (n: number, dp = 2) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;
