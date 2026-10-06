import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from '../nav';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from './Button';
import { AppText } from './AppText';
import { Icon } from './Icon';
import { Avatar, RoundButton } from './Parts';
import { TopRight } from './Ride';
import { colors } from '../theme';
import { PASSENGER } from '../state/ride';

export function PassengerRow({ unread = 0, sub = 'Passenger, cash' }: { unread?: number; sub?: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Avatar initials={PASSENGER.initials} />
      <View style={{ flex: 1 }}>
        <AppText style={{ fontSize: 17, fontWeight: '800' }}>{PASSENGER.name}</AppText>
        <AppText color={colors.muted} style={{ fontSize: 14 }}>
          {sub}
        </AppText>
      </View>
      <RoundButton icon="phone" label="Call passenger" />
      <RoundButton icon="chat" label={unread ? `Chat with passenger, ${unread} unread` : 'Chat with passenger'} badge={unread} onPress={() => router.push('/chat')} />
    </View>
  );
}

export function MoreButton() {
  return (
    <TopRight>
      <Pressable accessibilityRole="button" accessibilityLabel="Cancel ride" onPress={() => router.push('/driver-cancel')} style={styles.more}>
        <Icon name="more" size={22} strokeWidth={3} />
      </Pressable>
    </TopRight>
  );
}

export function SosButton() {
  return (
    <TopRight>
      <Pressable accessibilityRole="button" accessibilityLabel="Emergency SOS" style={styles.sos}>
        <Icon name="shield" size={18} color={colors.white} />
        <AppText color={colors.white} style={{ fontSize: 15, fontWeight: '800' }}>
          SOS
        </AppText>
      </Pressable>
    </TopRight>
  );
}

export function NoticeCard(props: { iconBg: string; icon: React.ReactNode; title: string; text: string; extra?: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.card, { bottom: 24 + insets.bottom }]} accessibilityRole="alert">
      <View style={[styles.icon, { backgroundColor: props.iconBg }]}>{props.icon}</View>
      <View>
        <AppText style={{ fontSize: 24, fontWeight: '800' }}>{props.title}</AppText>
        <AppText color={colors.muted} style={{ fontSize: 16, lineHeight: 23, marginTop: 6 }}>
          {props.text}
        </AppText>
      </View>
      {props.extra}
      <Button label="Back to finding rides" onPress={() => router.replace('/home')} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { position: 'absolute', left: 16, right: 16, backgroundColor: colors.white, borderRadius: 24, paddingTop: 24, paddingHorizontal: 20, paddingBottom: 18, gap: 14 },
  icon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  sos: { height: 48, paddingHorizontal: 16, borderRadius: 24, backgroundColor: colors.red, flexDirection: 'row', alignItems: 'center', gap: 6 },
  more: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
});
