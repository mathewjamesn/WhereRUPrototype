import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';
import { RouteList } from '../ui/Ride';
import { colors } from '../theme';
import { SIMPLE } from '../state/ride';
import { NoticeCard } from '../ui/Trip';

/** Accept returned HTTP 400: another driver got there first. */
export default function RideTaken() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.ink }}>
      <SafeAreaView style={{ padding: 20, paddingTop: 24, opacity: 0.35 }} edges={['top']}>
        <AppText color={colors.darkMuted} style={{ fontSize: 15, fontWeight: '600' }}>
          New ride request
        </AppText>
        <AppText color={colors.lime} style={{ fontSize: 60, fontWeight: '800', letterSpacing: -1.8 }}>{`₹${SIMPLE.fare}`}</AppText>
        <View style={{ backgroundColor: colors.darkCard, borderRadius: 18, padding: 18, marginTop: 24 }}>
          <RouteList points={SIMPLE.points} dark />
        </View>
      </SafeAreaView>
      <NoticeCard
        iconBg={colors.ground}
        icon={<Icon name="car" size={28} />}
        title="Another driver accepted this ride"
        text="Ride requests go to several nearby drivers, and the first to accept gets it. You’re still online and will get the next request."
      />
    </View>
  );
}
