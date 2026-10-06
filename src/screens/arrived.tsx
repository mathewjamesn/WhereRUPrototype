import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { router } from '../nav';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { MapArt } from '../ui/Map';
import { Sheet, StatusPill } from '../ui/Ride';
import { MoreButton, PassengerRow } from '../ui/Trip';
import { colors } from '../theme';

/** At pickup: waiting timer and the passenger's 4-digit ride code. */
export default function Arrived() {
  const [secs, setSecs] = useState(84);
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const input = useRef<TextInput>(null);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');

  return (
    <View style={{ flex: 1 }}>
      <MapArt route carAt={[120, 470]} style={{ bottom: 400 }} />
      <StatusPill text="Waiting for passenger" dot={colors.lime} />
      <MoreButton />
      <Sheet>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <View>
            <AppText style={{ fontSize: 26, fontWeight: '800' }}>You’ve arrived</AppText>
            <AppText color={colors.muted} style={{ fontSize: 15 }}>
              Passenger has been notified
            </AppText>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <AppText variant="small" color={colors.muted} style={{ fontWeight: '600' }}>
              Waiting
            </AppText>
            <AppText style={{ fontSize: 24, fontWeight: '800', fontVariant: ['tabular-nums'] }}>{`${mm}:${ss}`}</AppText>
          </View>
        </View>
        <PassengerRow />
        <View>
          <AppText variant="bodyStrong" style={{ marginBottom: 10 }}>
            Enter the passenger’s 4-digit ride code
          </AppText>
          <Pressable onPress={() => input.current?.focus()} style={styles.boxes} accessibilityLabel="Ride code">
            {[0, 1, 2, 3].map(i => (
              <View key={i} style={[styles.box, i === code.length ? { borderColor: colors.ink } : null, error ? { borderColor: colors.red } : null]}>
                <AppText style={{ fontSize: 28, fontWeight: '800' }}>{code[i] ?? ''}</AppText>
              </View>
            ))}
            <TextInput
              ref={input}
              value={code}
              onChangeText={v => {
                setError(false);
                setCode(v.replace(/[^0-9]/g, '').slice(0, 4));
              }}
              keyboardType="number-pad"
              maxLength={4}
              style={styles.hidden}
              accessibilityLabel="Ride code"
            />
          </Pressable>
          {error ? (
            <AppText color={colors.red} style={{ marginTop: 8 }}>
              That code doesn’t match. Ask the passenger to check the app.
            </AppText>
          ) : (
            <AppText variant="small" color={colors.muted} style={{ marginTop: 8 }}>
              Prototype: any 4 digits work. 0000 shows the error.
            </AppText>
          )}
        </View>
        <Button
          label="Verify and start trip"
          disabled={code.length !== 4}
          onPress={() => (code === '0000' ? setError(true) : router.replace('/on-trip'))}
        />
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  boxes: { flexDirection: 'row', gap: 10 },
  box: { flex: 1, height: 64, borderRadius: 16, borderWidth: 2, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  hidden: { position: 'absolute', opacity: 0, width: 1, height: 1 },
});
