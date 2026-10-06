import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from '../nav';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../ui/AppText';
import { Card } from '../ui/Parts';
import { Icon } from '../ui/Icon';
import { TAB_HEIGHT, TabBar } from '../ui/Chrome';
import { colors } from '../theme';
import { useProto } from '../state/proto';
import { net, rupees } from '../state/ride';

const WEEKS = [
  { label: '21 Sep to 27 Sep', total: 4388.4, days: [612, 845.5, 0, 702.4, 990, 1238.5, 0], today: -1 },
  { label: '28 Sep to 4 Oct', total: 5126.8, days: [945.4, 699.9, 490.9, 718.1, 454.5, 1818, 0], today: 5 },
];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Earnings() {
  const insets = useSafeAreaInsets();
  const due = useProto(s => s.walletDue);
  const [w, setW] = useState(1);
  const week = WEEKS[w];
  const max = Math.max(...week.days, 1);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ground }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: TAB_HEIGHT + insets.bottom + 16, paddingHorizontal: 16, gap: 12 }}>
        <AppText variant="display" accessibilityRole="header" style={{ paddingHorizontal: 4, paddingTop: 24 }}>
          Earnings
        </AppText>
        <Card>
          <View style={styles.weekRow}>
            <Pressable accessibilityRole="button" accessibilityLabel="Previous week" disabled={w === 0} onPress={() => setW(0)} style={styles.arrow}>
              <Icon name="back" color={w === 0 ? colors.line : colors.ink} />
            </Pressable>
            <AppText style={{ fontSize: 15, fontWeight: '700' }}>{week.label}</AppText>
            <Pressable accessibilityRole="button" accessibilityLabel="Next week" disabled={w === 1} onPress={() => setW(1)} style={styles.arrow}>
              <Icon name="chev" color={w === 1 ? colors.line : colors.ink} />
            </Pressable>
          </View>
          <View style={{ alignItems: 'center', marginTop: 4, marginBottom: 14 }}>
            <AppText style={{ fontSize: 44, fontWeight: '800', letterSpacing: -1 }}>{rupees(week.total)}</AppText>
            <AppText color={colors.muted} style={{ fontSize: 14 }}>
              After platform fees
            </AppText>
          </View>
          <View style={styles.chart} accessibilityLabel={`Daily earnings for ${week.label}`}>
            {week.days.map((v, i) => {
              const on = i === week.today;
              return (
                <View key={DAYS[i]} style={styles.col}>
                  <AppText color={on ? colors.ink : colors.muted} style={{ fontSize: 11, fontWeight: '700' }}>
                    {v ? `₹${Math.round(v).toLocaleString('en-IN')}` : '–'}
                  </AppText>
                  <View style={[styles.bar, { height: Math.max(4, Math.round((v / max) * 150)), backgroundColor: on ? colors.ink : '#CFCFCF' }]} />
                  <AppText color={on ? colors.ink : colors.muted} style={{ fontSize: 13, fontWeight: on ? '800' : '600' }}>
                    {DAYS[i]}
                  </AppText>
                </View>
              );
            })}
          </View>
        </Card>
        <Pressable accessibilityRole="button" onPress={() => router.push('/wallet')}>
          <Card style={styles.linkCard}>
            <View style={[styles.iconBox, { backgroundColor: due > 0 ? colors.redTint : colors.greenTint }]}>
              <Icon name="wallet" color={due > 0 ? colors.red : colors.green} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText style={{ fontSize: 16, fontWeight: '800' }}>Wallet</AppText>
              <AppText color={due > 0 ? colors.red : colors.green} style={{ fontSize: 14, fontWeight: '600' }}>
                {due > 0 ? `You owe ${rupees(due)}` : 'All paid'}
              </AppText>
            </View>
            <Icon name="chev" size={20} color={colors.muted} />
          </Card>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => router.push('/trip-detail')}>
          <Card style={styles.linkCard}>
            <View style={{ flex: 1 }}>
              <AppText color={colors.muted} style={{ fontSize: 14, fontWeight: '600' }}>
                Last trip
              </AppText>
              <AppText style={{ fontSize: 18, fontWeight: '800' }}>{rupees(net())}</AppText>
            </View>
            <Icon name="chev" size={20} color={colors.muted} />
          </Card>
        </Pressable>
      </ScrollView>
      <TabBar active="earn" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  weekRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  arrow: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  chart: { flexDirection: 'row', gap: 6, height: 200, alignItems: 'flex-end' },
  col: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 6 },
  bar: { width: '100%', borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomLeftRadius: 3, borderBottomRightRadius: 3 },
  linkCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
