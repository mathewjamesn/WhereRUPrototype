import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from '../nav';
import { Screen } from '../ui/Screen';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { ListCard } from '../ui/Parts';
import { Icon } from '../ui/Icon';
import { colors } from '../theme';
import { GATE_ITEMS, gateReady, proto, useProto, type GateId } from '../state/proto';

/** Items the phone can't report (OEM pop-up settings, auto-start) are confirmed by the driver. */
const UNREPORTED: GateId[] = ['popups', 'autostart'];

/** After approval, before Home. Re-opens if a required setting is later turned off. */
export default function Permissions() {
  const gate = useProto(s => s.gate);
  const ready = useProto(gateReady);
  const left = GATE_ITEMS.filter(i => i.critical && !gate[i.id]).length;
  const set = (id: GateId, v: boolean) => proto.set({ gate: { ...proto.get().gate, [id]: v } });

  return (
    <Screen
      footer={
        <>
          {!ready ? (
            <AppText variant="small" color={colors.muted} style={{ textAlign: 'center' }}>
              {left === 1 ? '1 item left' : `${left} items left`}
            </AppText>
          ) : null}
          <Button
            label="Continue"
            disabled={!ready}
            onPress={() => {
              proto.set({ gatePassed: true });
              router.replace('/home');
            }}
          />
        </>
      }>
      <View style={{ gap: 6, paddingTop: 16 }}>
        <AppText variant="display" accessibilityRole="header">
          Set up your phone for rides
        </AppText>
        <AppText color={colors.muted} style={{ lineHeight: 23 }}>
          Allow these so ride requests reach you, even when the app is closed or the phone is locked.
        </AppText>
      </View>
      <ListCard>
        {GATE_ITEMS.map((item, idx) => {
          const done = gate[item.id];
          const confirmOnly = UNREPORTED.includes(item.id);
          return (
            <View key={item.id} style={[styles.item, idx < GATE_ITEMS.length - 1 ? styles.divider : null]}>
              <View style={styles.head}>
                <View style={[styles.dot, { backgroundColor: done ? colors.green : item.critical ? colors.red : colors.line }]}>
                  {done ? <Icon name="check" size={14} color={colors.white} strokeWidth={3} /> : null}
                </View>
                <AppText variant="bodyStrong" style={{ flex: 1 }}>
                  {item.title}
                </AppText>
                {!item.critical && !done ? (
                  <AppText variant="label" color={colors.muted}>
                    Optional
                  </AppText>
                ) : null}
              </View>
              {!done ? (
                <AppText variant="small" color={colors.muted} style={{ paddingLeft: 32, fontSize: 14, lineHeight: 20 }}>
                  {item.hint}
                </AppText>
              ) : null}
              {!done || confirmOnly ? (
                <View style={styles.actions}>
                  {!done ? (
                    <Pressable accessibilityRole="button" style={styles.link} onPress={() => !confirmOnly && set(item.id, true)}>
                      <AppText variant="bodyStrong">{confirmOnly ? 'Open settings' : 'Allow'}</AppText>
                    </Pressable>
                  ) : null}
                  {confirmOnly ? (
                    <Pressable accessibilityRole="button" style={styles.link} onPress={() => set(item.id, !done)}>
                      <AppText variant="bodyStrong" color={colors.muted}>
                        {done ? 'Mark as not done' : 'I’ve enabled it'}
                      </AppText>
                    </Pressable>
                  ) : null}
                </View>
              ) : null}
            </View>
          );
        })}
      </ListCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  item: { gap: 6, paddingVertical: 12 },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.line },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  actions: { flexDirection: 'row', gap: 20, paddingLeft: 32 },
  link: { minHeight: 44, justifyContent: 'center' },
});
