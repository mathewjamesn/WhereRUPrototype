import React, { useCallback, useEffect } from 'react';
import { StyleSheet, Vibration, View } from 'react-native';
import { router, useLocalSearchParams } from '../nav';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { CountdownRing, DarkTag, RouteList, StatTiles } from '../ui/Ride';
import { colors } from '../theme';
import { SIMPLE, STOPS, rupees } from '../state/ride';

/** Full-screen incoming request. Destination is always shown, for every ride. */
export default function Request() {
  const { stops } = useLocalSearchParams<{ stops?: string }>();
  const multi = stops === '1';
  const fare = multi ? STOPS.fare : SIMPLE.fare;

  useEffect(() => {
    Vibration.vibrate([0, 600, 400, 600], true);
    return () => Vibration.cancel();
  }, []);

  const missed = useCallback(() => router.replace('/home'), []);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.head}>
        <View style={{ flex: 1 }}>
          <AppText color={colors.darkMuted} style={{ fontSize: 15, fontWeight: '600' }}>
            New ride request
          </AppText>
          <AppText color={colors.lime} style={{ fontSize: multi ? 54 : 60, fontWeight: '800', letterSpacing: -1.8, lineHeight: multi ? 60 : 66 }}>
            {rupees(fare, 0)}
          </AppText>
          <View style={styles.tags}>
            {multi ? <DarkTag label="2 stops" lime /> : null}
            <DarkTag label={SIMPLE.payment} />
            <DarkTag label={SIMPLE.vehicle} />
          </View>
        </View>
        <CountdownRing seconds={15} size={multi ? 88 : 96} onDone={missed} />
      </View>
      <StatTiles
        items={[
          ['To pickup', `${SIMPLE.pickupKm} km`],
          ['Trip', `${multi ? STOPS.tripKm : SIMPLE.tripKm} km`],
          ['Rate', `₹${SIMPLE.rate}/km`],
        ]}
      />
      <View style={styles.route}>
        <RouteList points={multi ? STOPS.points : SIMPLE.points} dark />
      </View>
      <View style={{ flex: 1 }} />
      <Button
        label="Accept"
        variant="green"
        icon="check"
        height={multi ? 68 : 72}
        fontSize={22}
        style={{ borderRadius: 22 }}
        onPress={() => router.replace(multi ? '/on-trip-stops' : '/to-pickup')}
      />
      <Button label="Pass" variant="darkOutline" height={52} onPress={() => router.replace('/home')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, gap: 16 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  tags: { flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' },
  route: { backgroundColor: colors.darkCard, borderRadius: 18, padding: 18 },
});
