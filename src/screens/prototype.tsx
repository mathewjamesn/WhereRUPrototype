import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, type Href } from '../nav';
import { Screen } from '../ui/Screen';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { ListCard, SectionLabel } from '../ui/Parts';
import { Icon } from '../ui/Icon';
import { colors } from '../theme';
import { approvedDriver, proto, useProto, type Conn, type ProtoState } from '../state/proto';

type Item = { label: string; href: Href; prep?: Partial<ProtoState> };

const approved = approvedDriver;
const GROUPS: { title: string; items: Item[] }[] = [
  {
    title: 'Sign up and sign in',
    items: [
      { label: 'Choose language', href: '/language', prep: { language: null } },
      { label: 'Sign in or sign up', href: '/login' },
      { label: 'Verify OTP', href: '/otp', prep: { mobile: '9876543210' } },
      { label: 'Your details', href: '/details' },
      { label: 'Documents (4 steps)', href: '/documents' },
      { label: 'All documents uploaded, waiting', href: '/review', prep: { ...approved, verification: 'pending' } },
      { label: 'Documents rejected, upload again', href: '/review', prep: { ...approved, verification: 'rejected' } },
      { label: 'Set up your phone (permissions)', href: '/permissions', prep: { ...approved, gatePassed: false, gate: { ...approved.gate!, fullscreen: false, popups: false, battery: false } } },
    ],
  },
  {
    title: 'Home and account',
    items: [
      { label: 'Home, offline', href: '/home', prep: { ...approved, online: false, conn: 'ok' } },
      { label: 'Home, online', href: '/home', prep: { ...approved, online: true, conn: 'ok' } },
      { label: 'Home, no internet', href: '/home', prep: { ...approved, online: true, conn: 'noNet' } },
      { label: 'Home, location off', href: '/home', prep: { ...approved, online: true, conn: 'gpsOff' } },
      { label: 'Inbox', href: '/inbox' },
      { label: 'Account', href: '/account' },
      { label: 'Profile', href: '/profile' },
      { label: 'My vehicle', href: '/vehicle' },
      { label: 'Self check', href: '/self-check' },
      { label: 'Settings', href: '/settings' },
      { label: 'Language (from settings)', href: { pathname: '/language', params: { from: 'settings' } } },
    ],
  },
  {
    title: 'Ride flow',
    items: [
      { label: '1. Incoming request', href: '/request', prep: { online: true } },
      { label: '2. Heading to pickup', href: '/to-pickup' },
      { label: '2a. Chat with passenger', href: '/chat' },
      { label: '3. Arrived, ride code', href: '/arrived' },
      { label: '4. On trip', href: '/on-trip', prep: { conn: 'ok' } },
      { label: '4. On trip, no internet', href: '/on-trip', prep: { conn: 'noNet' } },
      { label: '5. Collect payment', href: '/collect' },
      { label: '6. Trip summary', href: '/summary' },
    ],
  },
  {
    title: 'Rides with stops',
    items: [
      { label: 'Request with 2 stops', href: { pathname: '/request', params: { stops: '1' } }, prep: { online: true } },
      { label: 'On trip with stops', href: '/on-trip-stops' },
    ],
  },
  {
    title: 'Cancellations and missed rides',
    items: [
      { label: 'Driver cancels, choose reason', href: '/driver-cancel' },
      { label: 'Passenger cancelled', href: '/passenger-cancelled' },
      { label: 'Ride taken by another driver', href: '/ride-taken' },
    ],
  },
  {
    title: 'Trips and money',
    items: [
      { label: 'Trips', href: '/trips' },
      { label: 'Trip details', href: '/trip-detail' },
      { label: 'Earnings', href: '/earnings' },
      { label: 'Wallet', href: '/wallet' },
    ],
  },
];

const CONNS: [Conn, string][] = [
  ['ok', 'Connected'],
  ['noNet', 'No internet'],
  ['gpsOff', 'Location off'],
  ['back', 'Back online'],
];

export default function PrototypeMenu() {
  const conn = useProto(s => s.conn);
  const go = (i: Item) => {
    const s = proto.get();
    // Screens past sign-in need a signed-up driver; fill one in if the prototype hasn't got there yet.
    const needsDriver = !['/language', '/login', '/otp', '/details', '/documents'].includes(typeof i.href === 'string' ? i.href : i.href.pathname);
    proto.set({ ...(needsDriver && !s.details.first ? approved : {}), ...(i.prep ?? {}) });
    if (router.canDismiss()) router.dismissAll();
    router.replace(i.href);
  };
  return (
    <Screen title="Prototype" back>
      <SectionLabel>Device status</SectionLabel>
      <View style={styles.seg}>
        {CONNS.map(([k, l]) => (
          <Pressable key={k} accessibilityRole="button" accessibilityState={{ selected: conn === k }} onPress={() => proto.set({ conn: k })} style={[styles.segBtn, conn === k ? styles.segOn : null]}>
            <AppText color={conn === k ? colors.white : colors.muted} style={{ fontSize: 13, fontWeight: '800', textAlign: 'center' }}>
              {l}
            </AppText>
          </Pressable>
        ))}
      </View>
      {GROUPS.map(g => (
        <View key={g.title} style={{ gap: 8 }}>
          <SectionLabel>{g.title}</SectionLabel>
          <ListCard style={{ paddingVertical: 0 }}>
            {g.items.map((i, idx) => (
              <Pressable key={i.label} accessibilityRole="button" onPress={() => go(i)} style={[styles.row, idx < g.items.length - 1 ? styles.divider : null]}>
                <AppText variant="bodyStrong" style={{ flex: 1 }}>
                  {i.label}
                </AppText>
                <Icon name="chev" size={18} color={colors.muted} />
              </Pressable>
            ))}
          </ListCard>
        </View>
      ))}
      <Button
        label="Restart prototype"
        variant="outline"
        icon="reset"
        onPress={() => {
          proto.reset();
          if (router.canDismiss()) router.dismissAll();
          router.replace('/');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  seg: { flexDirection: 'row', gap: 6, padding: 5, backgroundColor: colors.white, borderRadius: 14 },
  segBtn: { flex: 1, minHeight: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  segOn: { backgroundColor: colors.ink },
  row: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 8 },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.line },
});
