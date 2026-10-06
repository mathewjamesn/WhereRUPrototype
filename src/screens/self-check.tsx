import React from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { router } from '../nav';
import Svg, { Circle } from 'react-native-svg';
import { Screen } from '../ui/Screen';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { Chip, ListCard } from '../ui/Parts';
import { Icon } from '../ui/Icon';
import { colors } from '../theme';
import { GATE_ITEMS, proto, useProto } from '../state/proto';

export default function SelfCheck() {
  const gate = useProto(s => s.gate);
  const ready = GATE_ITEMS.filter(i => gate[i.id]).length;
  const total = GATE_ITEMS.length;
  const c = 2 * Math.PI * 24;
  const test = () => {
    Alert.alert('Send test ride alert', 'Press Home or lock the screen. A test ride request appears in about 8 seconds.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Send', onPress: () => setTimeout(() => router.push('/request'), 3000) },
    ]);
  };
  return (
    <Screen title="Self check" back="/account" footer={<Button label="Send test ride alert" icon="bell" onPress={test} />}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 4 }}>
        <Svg width={56} height={56} viewBox="0 0 56 56">
          <Circle cx="28" cy="28" r="24" fill="none" stroke={colors.line} strokeWidth={7} />
          <Circle cx="28" cy="28" r="24" fill="none" stroke={colors.green} strokeWidth={7} strokeLinecap="round" strokeDasharray={`${(c * ready) / total} ${c}`} transform="rotate(-90 28 28)" />
        </Svg>
        <View>
          <AppText style={{ fontSize: 20, fontWeight: '800' }}>{`${ready} of ${total} ready`}</AppText>
          <AppText variant="small" color={colors.muted} style={{ fontSize: 14 }}>
            Realme, Android 16
          </AppText>
        </View>
      </View>
      <ListCard>
        {GATE_ITEMS.map((i, idx) => {
          const done = gate[i.id];
          return (
            <View key={i.id} style={[styles.item, idx < total - 1 ? styles.divider : null]}>
              <View style={styles.head}>
                <AppText variant="bodyStrong" style={{ flex: 1 }}>
                  {i.title}
                </AppText>
                {done ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Icon name="check" size={18} color={colors.green} strokeWidth={3} />
                    <AppText color={colors.green} style={{ fontSize: 14, fontWeight: '800' }}>
                      Ready
                    </AppText>
                  </View>
                ) : i.critical ? (
                  <Chip label="Required" bg={colors.redTint} fg={colors.red} />
                ) : (
                  <Chip label="Please check" bg={colors.warnTint} fg={colors.warnText} />
                )}
              </View>
              <AppText variant="small" color={colors.muted} style={{ fontSize: 14, lineHeight: 20 }}>
                {i.hint}
              </AppText>
              {!done ? (
                <Pressable accessibilityRole="button" onPress={() => proto.set({ gate: { ...gate, [i.id]: true } })} style={{ minHeight: 40, justifyContent: 'center' }}>
                  <AppText variant="bodyStrong">Open settings</AppText>
                </Pressable>
              ) : null}
            </View>
          );
        })}
      </ListCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  item: { paddingVertical: 12, gap: 2 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.line },
});
