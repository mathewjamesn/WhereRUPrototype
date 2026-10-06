import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from '../nav';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { MapArt } from '../ui/Map';
import { Sheet, SlideToConfirm, StatusPill } from '../ui/Ride';
import { SosButton } from '../ui/Trip';
import { colors } from '../theme';
import { STOPS } from '../state/ride';

/** Multi-stop trip: the driver confirms each stop, then slides to end at the final drop. */
export default function OnTripStops() {
  const [leg, setLeg] = useState(1); // 1 and 2 are stops, 3 is the final drop
  const names = STOPS.points.map(p => p.title);
  const isStop = leg === 1 || leg === 2;

  return (
    <View style={{ flex: 1 }}>
      <MapArt stops carAt={leg === 1 ? [124, 400] : leg === 2 ? [180, 316] : [240, 230]} style={{ bottom: 400 }} />
      <StatusPill text={isStop ? `On trip, heading to stop ${leg}` : 'On trip, heading to drop'} right={110} />
      <SosButton />
      <Sheet>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <AppText color={colors.muted} style={{ fontSize: 15, fontWeight: '600' }}>
              {isStop ? `Stop ${leg} of 2` : 'Final drop'}
            </AppText>
            <AppText style={{ fontSize: 24, fontWeight: '800' }}>{names[leg]}</AppText>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Navigate" style={styles.nav}>
            <Icon name="nav" color={colors.white} />
          </Pressable>
        </View>
        <View>
          {names.map((n, i) => {
            const done = i < leg;
            const next = i === leg;
            const drop = i === names.length - 1;
            return (
              <View key={n} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
                <View style={{ width: 24, alignItems: 'center', paddingTop: 2 }}>
                  {done ? (
                    <View style={[styles.mk, { backgroundColor: colors.green }]}>
                      <Icon name="check" size={13} color={colors.white} strokeWidth={3.5} />
                    </View>
                  ) : drop ? (
                    <View style={{ width: 14, height: 14, margin: 4, backgroundColor: colors.ink }} />
                  ) : (
                    <View style={[styles.mk, { backgroundColor: next ? colors.lime : colors.white, borderWidth: 2, borderColor: colors.ink }]}>
                      <AppText style={{ fontSize: 12, fontWeight: '800' }}>{String(i)}</AppText>
                    </View>
                  )}
                  {i < names.length - 1 ? <View style={{ width: 2, height: 22, backgroundColor: colors.line, marginVertical: 4 }} /> : null}
                </View>
                <AppText
                  color={done ? colors.muted : colors.ink}
                  style={{ flex: 1, fontSize: 16, paddingTop: 1, fontWeight: next ? '800' : '600', textDecorationLine: done ? 'line-through' : 'none' }}>
                  {n}
                </AppText>
                {next || done ? (
                  <View style={[styles.tag, next ? { backgroundColor: colors.lime } : null]}>
                    <AppText color={next ? colors.ink : colors.muted} style={{ fontSize: 12, fontWeight: '800' }}>
                      {next ? 'Next' : 'Done'}
                    </AppText>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
        {isStop ? (
          <>
            <Button label={`Reached stop ${leg}, continue`} onPress={() => setLeg(leg + 1)} />
            <AppText variant="small" color={colors.muted} style={{ textAlign: 'center' }}>
              Waiting time at stops is added to the fare as per the stop waiting rule.
            </AppText>
          </>
        ) : (
          <SlideToConfirm label="Slide to end trip" onConfirm={() => router.replace('/collect')} />
        )}
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  mk: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
});
