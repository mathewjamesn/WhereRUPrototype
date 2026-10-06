import React from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { router } from '../nav';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../ui/AppText';
import { Button, ProtoLink } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { MapArt } from '../ui/Map';
import { Sheet } from '../ui/Ride';
import { TAB_HEIGHT, TabBar } from '../ui/Chrome';
import { colors, shadow } from '../theme';
import { GATE_ITEMS, proto, useProto } from '../state/proto';

export default function Home() {
  const insets = useSafeAreaInsets();
  const online = useProto(s => s.online);
  const conn = useProto(s => s.conn);
  const gate = useProto(s => s.gate);
  const toReview = GATE_ITEMS.filter(i => !gate[i.id]).length;
  const paused = online && (conn === 'noNet' || conn === 'gpsOff');
  const top = insets.top + 16;

  const goOnline = () => {
    if (conn === 'gpsOff') return Alert.alert('Turn on location to go online.');
    if (conn === 'noNet') return Alert.alert('Couldn’t reach the server. Check your internet and try again.');
    proto.set({ online: true });
  };

  return (
    <View style={styles.root}>
      <MapArt pulse={online && !paused} carAt={[195, 250]} />

      <View style={[styles.topRow, { top }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Today’s earnings ₹1,818" onPress={() => router.push('/earnings')} style={[styles.today, shadow]}>
          <AppText variant="small" color={colors.muted} style={{ fontWeight: '600' }}>
            Today
          </AppText>
          <AppText style={{ fontSize: 26, fontWeight: '800', letterSpacing: -0.5 }}>₹1,818</AppText>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Inbox, 2 unread" onPress={() => router.push('/inbox')} style={[styles.bell, shadow]}>
          <Icon name="bell" />
          <View style={styles.bellBadge}>
            <AppText color={colors.white} style={{ fontSize: 11, fontWeight: '800' }}>
              2
            </AppText>
          </View>
        </Pressable>
      </View>

      {toReview > 0 ? (
        <Pressable accessibilityRole="button" onPress={() => router.push('/self-check')} style={[styles.warn, { top: top + 80 }]}>
          <Icon name="shield" size={20} color={colors.warnText} />
          <AppText color={colors.warnText} style={{ flex: 1, fontSize: 14, fontWeight: '700' }}>
            {toReview === 1 ? '1 setting may block full-screen ride alerts' : `${toReview} settings may block full-screen ride alerts`}
          </AppText>
          <Icon name="chev" size={18} color={colors.warnText} />
        </Pressable>
      ) : null}

      <Sheet bottom={TAB_HEIGHT + insets.bottom}>
        {!online ? (
          <>
            <View>
              <AppText style={{ fontSize: 24, fontWeight: '800' }}>You’re offline</AppText>
              <AppText color={colors.muted} style={{ fontSize: 15, marginTop: 4 }}>
                Go online to start getting ride requests.
              </AppText>
            </View>
            <Button label="Go online" variant="lime" icon="power" pill height={64} fontSize={19} onPress={goOnline} />
          </>
        ) : paused ? (
          <>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: colors.red, borderColor: colors.redTint }]} />
              <View style={{ flex: 1 }}>
                <AppText style={{ fontSize: 24, fontWeight: '800' }}>Ride requests paused</AppText>
                <AppText color={colors.muted} style={{ fontSize: 15, marginTop: 2 }}>
                  {conn === 'noNet' ? 'You’re still online. Requests come back as soon as your connection returns.' : 'Turn on location so passengers can find you and requests can reach you.'}
                </AppText>
              </View>
            </View>
            <View style={styles.protoRow}>
              <ProtoLink label="Prototype: connection back" onPress={() => proto.set({ conn: 'back' })} />
            </View>
            {conn === 'gpsOff' ? (
              <Button label="Turn on location" icon="pinOff" pill height={60} onPress={() => proto.set({ conn: 'back' })} />
            ) : (
              <Button label="Go offline" variant="outline" icon="power" pill height={60} onPress={() => proto.set({ online: false })} />
            )}
          </>
        ) : (
          <>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: colors.green, borderColor: colors.greenTint }]} />
              <View style={{ flex: 1 }}>
                <AppText style={{ fontSize: 24, fontWeight: '800' }}>You’re online</AppText>
                <AppText color={colors.muted} style={{ fontSize: 15, marginTop: 2 }}>
                  Finding rides near Kakkanad. Location shared just now.
                </AppText>
              </View>
            </View>
            <View style={styles.protoGrid}>
              <View style={styles.protoRow}>
                <ProtoLink label="Prototype: simple ride" onPress={() => router.push('/request')} />
                <ProtoLink label="Prototype: ride with 2 stops" onPress={() => router.push({ pathname: '/request', params: { stops: '1' } })} />
              </View>
              <View style={styles.protoRow}>
                <ProtoLink label="Prototype: passenger cancels" onPress={() => router.push('/passenger-cancelled')} />
                <ProtoLink label="Prototype: ride taken by another driver" onPress={() => router.push('/ride-taken')} />
              </View>
              <View style={styles.protoRow}>
                <ProtoLink label="Prototype: no internet" onPress={() => proto.set({ conn: 'noNet' })} />
                <ProtoLink label="Prototype: location off" onPress={() => proto.set({ conn: 'gpsOff' })} />
              </View>
            </View>
            <Button label="Go offline" variant="outline" icon="power" pill height={60} onPress={() => proto.set({ online: false })} />
          </>
        )}
      </Sheet>
      <TabBar active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ground },
  topRow: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  today: { backgroundColor: colors.white, borderRadius: 18, paddingHorizontal: 18, paddingVertical: 10 },
  bell: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  bellBadge: { position: 'absolute', top: 6, right: 6, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
  warn: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14, backgroundColor: colors.warnTint, borderWidth: 1, borderColor: colors.warnLine },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  statusDot: { width: 24, height: 24, borderRadius: 12, borderWidth: 5 },
  protoGrid: { gap: 8 },
  protoRow: { flexDirection: 'row', gap: 8 },
});
