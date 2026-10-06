import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from '../nav';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../ui/AppText';
import { Card } from '../ui/Parts';
import { RouteList } from '../ui/Ride';
import { TAB_HEIGHT, TabBar } from '../ui/Chrome';
import { colors } from '../theme';

const DATA = {
  Today: {
    total: '₹1,818',
    trips: [
      { time: '3:17 PM to 3:38 PM, cash', from: 'Kakkanad, Kochi', to: 'Sunrise Hospital, Kochi', amt: '₹227' },
      { time: '1:05 PM to 1:52 PM, UPI', from: 'Edappally, Kochi', to: 'Cochin International Airport', amt: '₹912' },
      { time: '10:20 AM to 10:41 AM, cash', from: 'Vyttila Hub', to: 'Lulu Mall, Edappally', amt: '₹318' },
    ],
  },
  'This week': {
    total: '₹5,126.80',
    trips: [
      { time: 'Sat, 3:17 PM, cash', from: 'Kakkanad, Kochi', to: 'Sunrise Hospital, Kochi', amt: '₹227' },
      { time: 'Fri, 6:40 PM, UPI', from: 'MG Road, Kochi', to: 'Fort Kochi Beach', amt: '₹454' },
      { time: 'Thu, 9:12 AM, cash', from: 'Aluva Metro', to: 'Infopark Phase 1, Kakkanad', amt: '₹718' },
    ],
  },
} as const;
type Range = keyof typeof DATA | 'Pick dates';

export default function Trips() {
  const insets = useSafeAreaInsets();
  const [range, setRange] = useState<Range>('Today');
  const d = DATA[range === 'Pick dates' ? 'This week' : range];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ground }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: TAB_HEIGHT + insets.bottom + 16 }}>
        <AppText variant="display" accessibilityRole="header" style={styles.h1}>
          Trips
        </AppText>
        <View style={styles.chips}>
          {(['Today', 'This week', 'Pick dates'] as Range[]).map(c => {
            const on = c === range;
            return (
              <Pressable key={c} accessibilityRole="button" accessibilityState={{ selected: on }} onPress={() => setRange(c)} style={[styles.chip, on ? styles.chipOn : null]}>
                <AppText color={on ? colors.white : colors.ink} style={{ fontSize: 15, fontWeight: '700' }}>
                  {c}
                </AppText>
              </Pressable>
            );
          })}
        </View>
        <AppText color={colors.muted} style={{ paddingHorizontal: 20, paddingBottom: 10, fontSize: 15 }}>{`${range === 'Today' ? 'Today' : 'This week'}, ${d.total} earned`}</AppText>
        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          {d.trips.map(t => (
            <Pressable key={t.time} accessibilityRole="button" onPress={() => router.push('/trip-detail')}>
              <Card style={{ gap: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <AppText color={colors.muted} style={{ fontSize: 14, fontWeight: '600' }}>
                    {t.time}
                  </AppText>
                  <AppText style={{ fontSize: 18, fontWeight: '800' }}>{t.amt}</AppText>
                </View>
                <RouteList points={[{ kind: 'pick', title: t.from }, { kind: 'drop', title: t.to }]} />
              </Card>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <TabBar active="trips" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  h1: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8 },
  chips: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingTop: 4, paddingBottom: 12 },
  chip: { height: 40, paddingHorizontal: 16, borderRadius: 20, justifyContent: 'center', backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.line },
  chipOn: { backgroundColor: colors.ink, borderColor: colors.ink },
});
