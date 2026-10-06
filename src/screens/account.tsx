import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router, type Href } from '../nav';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../ui/AppText';
import { Avatar, ListCard, NavRow } from '../ui/Parts';
import { Icon, IconName } from '../ui/Icon';
import { TAB_HEIGHT, TabBar } from '../ui/Chrome';
import { colors } from '../theme';
import { GATE_ITEMS, proto, useProto } from '../state/proto';
import { rupees } from '../state/ride';

function Tile({ icon, label, sub, subColor = colors.muted, badge, href }: { icon: IconName; label: string; sub: string; subColor?: string; badge?: number; href: Href }) {
  return (
    <Pressable accessibilityRole="button" onPress={() => router.push(href)} style={({ pressed }) => [styles.tile, pressed ? { opacity: 0.7 } : null]}>
      {badge ? (
        <View style={styles.badge}>
          <AppText color={colors.white} style={{ fontSize: 12, fontWeight: '800' }}>
            {badge}
          </AppText>
        </View>
      ) : null}
      <View style={styles.tileIcon}>
        <Icon name={icon} />
      </View>
      <View>
        <AppText style={{ fontSize: 16, fontWeight: '800' }}>{label}</AppText>
        <AppText color={subColor} style={{ fontSize: 13, fontWeight: '600', marginTop: 2 }}>
          {sub}
        </AppText>
      </View>
    </Pressable>
  );
}

export default function Account() {
  const insets = useSafeAreaInsets();
  const s = useProto(x => x);
  const review = GATE_ITEMS.filter(i => !s.gate[i.id]).length;
  const name = `${s.details.first || 'Mathew'} ${s.details.last || 'James'}`;
  const initials = (s.details.first[0] ?? 'M') + (s.details.last[0] ?? 'J');
  const logOff = () =>
    Alert.alert('Log out of WhereRU Driver?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => {
          // Language is kept across logout, like the real app.
          proto.reset({ language: proto.get().language ?? 'en' });
          router.replace('/login');
        },
      },
    ]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ground }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: TAB_HEIGHT + insets.bottom + 16 }}>
        <View style={styles.head}>
          <Avatar initials={initials} size={60} dark />
          <View>
            <AppText style={{ fontSize: 24, fontWeight: '800' }}>{name}</AppText>
            <AppText color={colors.muted} style={{ fontSize: 14, marginTop: 2 }}>{`SUV driver, ${s.vehicle?.reg ?? 'KL07AB1234'}`}</AppText>
          </View>
        </View>
        <View style={styles.grid}>
          <Tile icon="user" label="Profile" sub="Name, mobile, licence" href="/profile" />
          <Tile icon="car" label="My vehicle" sub="SUV, RC details" href="/vehicle" />
          <Tile icon="wallet" label="Wallet" sub={s.walletDue > 0 ? `You owe ${rupees(s.walletDue)}` : 'All paid'} subColor={s.walletDue > 0 ? colors.red : colors.green} href="/wallet" />
          <Tile icon="shield" label="Self check" sub={review ? `${review} to review` : 'All ready'} subColor={review ? colors.warnText : colors.green} badge={review || undefined} href="/self-check" />
        </View>
        <ListCard style={{ marginHorizontal: 16 }}>
          <NavRow icon="gear" label="Settings" onPress={() => router.push('/settings')} />
          <NavRow icon="globe" label="Language" sub={s.language === 'ml' ? 'മലയാളം' : 'English'} onPress={() => router.push({ pathname: '/language', params: { from: 'settings' } })} />
          <NavRow icon="help" label="Help" onPress={() => Alert.alert('Help', 'Opens support (call or WhatsApp) in the real app.')} />
          <NavRow icon="info" label="About" onPress={() => Alert.alert('WhereRU Driver', 'Prototype 2.0.0')} />
          <NavRow icon="logout" label="Log off" color={colors.red} onPress={logOff} last />
        </ListCard>
        <AppText variant="small" color={colors.muted} style={{ margin: 20, marginTop: 14 }}>
          Version 2.0.0 (prototype)
        </AppText>
      </ScrollView>
      <TabBar active="account" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 16, paddingTop: 4, paddingBottom: 16 },
  tile: { width: '48%', flexGrow: 1, minHeight: 112, padding: 16, gap: 10, backgroundColor: colors.white, borderRadius: 18 },
  tileIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.ground, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 12, right: 12, minWidth: 22, height: 22, borderRadius: 11, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
});
