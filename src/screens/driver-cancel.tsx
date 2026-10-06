import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from '../nav';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { MapArt } from '../ui/Map';
import { Notice, TextField } from '../ui/Parts';
import { Scrim, Sheet } from '../ui/Ride';
import { goBack } from '../ui/Screen';
import { colors } from '../theme';

const REASONS = ['Passenger asked me to cancel', 'Passenger not reachable', 'Passenger not at pickup point', 'Pickup is too far', 'Vehicle problem', 'Other'];

/** Driver cancels before the trip starts; a reason is required (sent to the cancellation API). */
export default function DriverCancel() {
  const [reason, setReason] = useState<string | null>(null);
  const [other, setOther] = useState('');
  const ok = reason !== null && (reason !== 'Other' || other.trim() !== '');
  return (
    <View style={{ flex: 1 }}>
      <MapArt route carAt={[120, 470]} />
      <Scrim onPress={() => goBack('/to-pickup')} />
      <Sheet>
        <View>
          <AppText style={{ fontSize: 24, fontWeight: '800' }} accessibilityRole="header">
            Why are you cancelling?
          </AppText>
          <AppText color={colors.muted} style={{ fontSize: 15, marginTop: 4 }}>
            Choose a reason. This helps us fix problems on the passenger side.
          </AppText>
        </View>
        <View style={{ gap: 8 }} accessibilityRole="radiogroup" accessibilityLabel="Cancellation reason">
          {REASONS.map(r => {
            const on = reason === r;
            return (
              <Pressable key={r} accessibilityRole="radio" accessibilityState={{ checked: on }} onPress={() => setReason(r)} style={[styles.row, on ? styles.rowOn : null]}>
                <View style={[styles.radio, on ? { borderColor: colors.ink } : null]}>{on ? <View style={styles.radioDot} /> : null}</View>
                <AppText variant="bodyStrong" style={{ fontWeight: '600' }}>
                  {r}
                </AppText>
              </Pressable>
            );
          })}
        </View>
        {reason === 'Other' ? <TextField label="Tell us more" value={other} onChangeText={setOther} placeholder="Reason" /> : null}
        <Notice tone="warn">Frequent cancellations can affect your account.</Notice>
        <Button label={ok ? 'Cancel ride' : 'Choose a reason to cancel'} variant="danger" disabled={!ok} onPress={() => router.replace('/home')} />
        <Button label="Keep ride" variant="text" height={44} onPress={() => goBack('/to-pickup')} />
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.white },
  rowOn: { borderWidth: 2, borderColor: colors.ink, backgroundColor: colors.lime },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.muted, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.ink },
});
