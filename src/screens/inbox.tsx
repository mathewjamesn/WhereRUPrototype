import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen } from '../ui/Screen';
import { AppText } from '../ui/AppText';
import { ListCard } from '../ui/Parts';
import { colors } from '../theme';

const MSGS = [
  { title: 'Platform fees due', text: 'You owe ₹632.25 in platform fees from cash trips. Pay from your wallet to keep getting rides.', when: '3 Oct', unread: true },
  { title: 'Turn on full-screen ride alerts', text: 'Open Self check and allow the settings marked Required so ride requests open on your lock screen.', when: '3 Oct', unread: true },
  { title: 'Weekly earnings', text: 'You earned ₹5,126.80 between 28 Sep and 4 Oct.', when: 'Mon', unread: false },
];

export default function Inbox() {
  return (
    <Screen title="Inbox" back="/home">
      <ListCard style={{ paddingVertical: 0 }}>
        {MSGS.map((m, i) => (
          <View key={m.title} style={[styles.msg, i < MSGS.length - 1 ? styles.divider : null]}>
            <View style={[styles.dot, { backgroundColor: m.unread ? colors.blue : 'transparent' }]} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                <AppText style={{ fontSize: 16, fontWeight: m.unread ? '800' : '600', flex: 1 }}>{m.title}</AppText>
                <AppText variant="small" color={colors.muted}>
                  {m.when}
                </AppText>
              </View>
              <AppText color={colors.muted} style={{ fontSize: 15, lineHeight: 22, marginTop: 4 }}>
                {m.text}
              </AppText>
            </View>
          </View>
        ))}
      </ListCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  msg: { flexDirection: 'row', gap: 12, paddingVertical: 16 },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 7 },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.line },
});
