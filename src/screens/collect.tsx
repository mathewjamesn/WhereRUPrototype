import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from '../nav';
import Svg, { Rect } from 'react-native-svg';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { MapArt } from '../ui/Map';
import { Sheet, StatusPill } from '../ui/Ride';
import { colors } from '../theme';
import { PASSENGER, SIMPLE } from '../state/ride';

function QrPlaceholder() {
  return (
    <Svg width={150} height={150} viewBox="0 0 110 110" accessibilityLabel="UPI QR code placeholder">
      <Rect width="110" height="110" fill="#FFFFFF" />
      {[
        [6, 6],
        [76, 6],
        [6, 76],
      ].map(([x, y]) => (
        <Rect key={`${x}-${y}`} x={x} y={y} width="28" height="28" fill="none" stroke="#000" strokeWidth={6} />
      ))}
      {Array.from({ length: 34 }).map((_, i) => (
        <Rect key={i} x={((i * 37) % 9) * 10 + 10} y={((i * 53) % 9) * 10 + 10} width="10" height="10" fill="#000" />
      ))}
    </Svg>
  );
}

export default function Collect() {
  const [method, setMethod] = useState<'cash' | 'upi'>('cash');
  return (
    <View style={{ flex: 1 }}>
      <MapArt route carAt={[248, 160]} style={{ bottom: 420 }} />
      <StatusPill text="Trip ended, collect payment" dot={colors.lime} right={16} />
      <Sheet>
        <View style={{ alignItems: 'center' }}>
          <AppText color={colors.muted} style={{ fontSize: 15, fontWeight: '600' }}>{`Collect from ${PASSENGER.name}`}</AppText>
          <AppText style={{ fontSize: 56, fontWeight: '800', letterSpacing: -1.6 }}>{`₹${SIMPLE.fare}`}</AppText>
          <AppText color={colors.muted} style={{ fontSize: 14 }}>{`${SIMPLE.tripKm} km at ₹${SIMPLE.rate}/km, no pickup charge`}</AppText>
        </View>
        <View style={styles.seg} accessibilityRole="radiogroup" accessibilityLabel="Payment method">
          {(['cash', 'upi'] as const).map(m => (
            <Pressable key={m} accessibilityRole="radio" accessibilityState={{ checked: method === m }} onPress={() => setMethod(m)} style={[styles.segBtn, method === m ? styles.segOn : null]}>
              <AppText color={method === m ? colors.white : colors.muted} style={{ fontSize: 16, fontWeight: '800' }}>
                {m === 'cash' ? 'Cash' : 'UPI'}
              </AppText>
            </Pressable>
          ))}
        </View>
        {method === 'cash' ? (
          <View style={styles.cash}>
            <AppText color={colors.green} style={{ fontSize: 17, fontWeight: '700', textAlign: 'center' }}>{`Take ₹${SIMPLE.fare} in cash from the passenger`}</AppText>
          </View>
        ) : (
          <View style={{ alignItems: 'center', gap: 8 }}>
            <QrPlaceholder />
            <AppText color={colors.muted} style={{ fontSize: 14 }}>{`Passenger scans to pay ₹${SIMPLE.fare} with any UPI app`}</AppText>
          </View>
        )}
        <Button label="Payment received" onPress={() => router.replace('/summary')} />
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  seg: { flexDirection: 'row', gap: 6, padding: 5, backgroundColor: colors.ground, borderRadius: 14 },
  segBtn: { flex: 1, height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  segOn: { backgroundColor: colors.ink },
  cash: { padding: 18, borderRadius: 16, backgroundColor: colors.greenTint },
});
