import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, usePathname } from '../nav';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { proto, useProto } from '../state/proto';
import { AppText } from './AppText';
import { Icon, IconName } from './Icon';

const TABS: { key: string; label: string; icon: IconName; href: '/home' | '/trips' | '/earnings' | '/account' }[] = [
  { key: 'home', label: 'Home', icon: 'home', href: '/home' },
  { key: 'trips', label: 'Trips', icon: 'trips', href: '/trips' },
  { key: 'earn', label: 'Earnings', icon: 'earn', href: '/earnings' },
  { key: 'account', label: 'Account', icon: 'user', href: '/account' },
];

export const TAB_HEIGHT = 72;

/** Bottom navigation: Home, Trips, Earnings, Account. */
export function TabBar({ active }: { active: 'home' | 'trips' | 'earn' | 'account' }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.tabbar, { height: TAB_HEIGHT + insets.bottom, paddingBottom: insets.bottom }]} accessibilityRole="tablist">
      {TABS.map(t => {
        const on = t.key === active;
        const col = on ? colors.ink : colors.muted;
        return (
          <Pressable
            key={t.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => !on && router.replace(t.href)}
            style={styles.tab}>
            <View style={[styles.tabBar, { backgroundColor: on ? colors.ink : 'transparent' }]} />
            <Icon name={t.icon} size={22} color={col} strokeWidth={on ? 2.2 : 1.8} />
            <AppText color={col} style={{ fontSize: 12, fontWeight: on ? '800' : '500' }}>
              {t.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Red/green banner shown over every screen for no internet, location off and back online. */
export function ConnectionBanner() {
  const conn = useProto(s => s.conn);
  const insets = useSafeAreaInsets();
  if (conn === 'ok') return null;
  const off = conn !== 'back';
  return (
    <View
      accessibilityRole={off ? 'alert' : 'text'}
      accessibilityLiveRegion="polite"
      style={[styles.banner, { paddingTop: insets.top + 12, backgroundColor: off ? colors.red : colors.green }]}>
      <Icon name={conn === 'noNet' ? 'wifiOff' : conn === 'gpsOff' ? 'pinOff' : 'check'} size={22} color={colors.white} strokeWidth={conn === 'back' ? 3 : 2} />
      <View style={{ flex: 1 }}>
        <AppText color={colors.white} style={{ fontSize: 15, fontWeight: '700' }}>
          {conn === 'noNet' ? 'No internet connection' : conn === 'gpsOff' ? 'Location is off' : 'Back online'}
        </AppText>
        {off ? (
          <AppText color={colors.white} style={{ fontSize: 13 }}>
            {conn === 'noNet' ? 'Reconnecting. Ride requests are paused.' : 'Passengers can’t find you.'}
          </AppText>
        ) : null}
      </View>
      {conn === 'gpsOff' ? (
        <Pressable accessibilityRole="button" onPress={() => proto.set({ conn: 'back' })} style={styles.turnOn}>
          <AppText color={colors.red} style={{ fontSize: 15, fontWeight: '800' }}>
            Turn on
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

/** Small floating button that opens the prototype panel (jump to screens, simulate connection). */
export function PrototypeFab() {
  const path = usePathname();
  const insets = useSafeAreaInsets();
  if (path === '/' || path === '/prototype') return null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Prototype menu"
      onPress={() => router.push('/prototype')}
      hitSlop={8}
      style={({ pressed }) => [styles.fab, { top: insets.top + 132 }, pressed ? { opacity: 1 } : null]}>
      <Icon name="grid" size={16} color={colors.lime} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabbar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.line, flexDirection: 'row' },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  tabBar: { position: 'absolute', top: 0, width: 32, height: 3, borderBottomLeftRadius: 3, borderBottomRightRadius: 3 },
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    elevation: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 14,
  },
  turnOn: { height: 40, paddingHorizontal: 14, borderRadius: 20, backgroundColor: colors.white, justifyContent: 'center' },
  fab: {
    position: 'absolute',
    right: 0,
    width: 34,
    height: 40,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: colors.ink,
    opacity: 0.55,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 60,
    elevation: 60,
  },
});
